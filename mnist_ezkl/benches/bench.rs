use ezkl::pfsys;
use ezkl::pfsys::TranscriptType;
use ezkl::pfsys::create_proof_circuit_kzg;
use ezkl::pfsys::srs::gen_srs;
use mnist::{Mnist, MnistBuilder};
use std::{collections::HashMap};
use tch::{Tensor, Kind, Device, vision, Scalar};
use benchy::BenchmarkRun;
use ezkl::tensor::ValTensor;
use halo2curves::bn256::Fr;
use halo2_proofs::circuit::Value;
use std::marker::PhantomData;
use halo2_proofs::poly::kzg::commitment::KZGCommitmentScheme;
use halo2_wrong_ecc::halo2::circuit::{Chip, Layouter, SimpleFloorPlanner};
use halo2_wrong_ecc::halo2::plonk::{Advice, Circuit, Column, ConstraintSystem, Error, Expression, Selector};
use halo2_wrong_ecc::halo2::poly::Rotation;
use ezkl::circuit::CheckMode;
use ezkl::pfsys::create_keys;
use halo2curves::bn256::Bn256;
const IMAGE_SIZE: usize = 28 * 28;



struct MNISTModel {
    l1: Linear,
    l2: Linear,
}

impl MNISTModel {
    fn new (mem: &mut Memory) -> MNISTModel {
        let l1 = Linear::new(mem, 784, 128);
        let l2 = Linear::new(mem, 128, 10);
        Self {
            l1: l1,
            l2: l2,
        }
    }
}

impl Compute for MNISTModel {
    fn forward (&self,  mem: &Memory, input: &Tensor) -> Tensor {
        let mut o = self.l1.forward(mem, input);
        o = o.relu();
        o = self.l2.forward(mem, &o);
        o
    }
}

fn main() {
    let (x, y) = load_mnist();

    let mut m = Memory::new();
    let mnist_model = MNISTModel::new(&mut m);
    train(&mut m, &x, &y, &mnist_model, 100, 128, cross_entropy, 0.3);
    let out = mnist_model.forward(&m, &x);
    println!("Training Accuracy: {}", accuracy(&y, &out));
}

trait Compute {
    fn forward (&self,  mem: &Memory, input: &Tensor) -> Tensor;
}

struct Linear {
    params: HashMap<String, usize>,
}

impl Linear {
    fn new (mem: &mut Memory, ninputs: i64, noutputs: i64) -> Self {
        let mut p = HashMap::new();
        p.insert("W".to_string(), mem.new_push(&[ninputs,noutputs], true));
        p.insert("b".to_string(), mem.new_push(&[1, noutputs], true));

        Self {
            params: p,
        }
    }
}

impl Compute for Linear {
    fn forward (&self,  mem: &Memory, input: &Tensor) -> Tensor {
        let w = mem.get(self.params.get(&"W".to_string()).unwrap());
        let b = mem.get(self.params.get(&"b".to_string()).unwrap());
        input.matmul(w) + b
    }
}

fn mse(target: &Tensor, pred: &Tensor) -> Tensor {
    (target - pred).square().mean(Kind::Float)
}

fn cross_entropy (target: &Tensor, pred: &Tensor) -> Tensor {
    let loss = pred.log_softmax(-1, Kind::Float).nll_loss(target);
    loss
}

struct Memory {
    size: usize,
    values: Vec<Tensor>,
}

impl Memory {

    fn new() -> Self {
        let v = Vec::new();
        Self {size: 0,
            values: v}
    }

    fn push (&mut self, value: Tensor) -> usize {
        self.values.push(value);
        self.size += 1;
        self.size-1
    }

    fn new_push (&mut self, size: &[i64], requires_grad: bool) -> usize {
        let t = Tensor::randn(size, (Kind::Float, Device::Cpu)).requires_grad_(requires_grad);
        self.push(t)
    }

    fn get (&self, addr: &usize) -> &Tensor {
        &self.values[*addr]
    }

    fn apply_grads_sgd(&mut self, learning_rate: f32) {
        let mut g = Tensor::new();
        self.values
        .iter_mut()
        .for_each(|t| {
            if t.requires_grad() {
                g = t.grad();
                t.set_data(&(t.data() - learning_rate*&g));
                t.zero_grad();
            }
        });
    }

    fn apply_grads_sgd_momentum(&mut self, learning_rate: f32) {
        let mut g: Tensor = Tensor::new();
        let mut velocity: Vec<Tensor>= Tensor::zeros(&[self.size as i64], (Kind::Float, Device::Cpu)).split(1, 0);
        let mut vcounter = 0;
        const BETA:f32 = 0.9;

        self.values
        .iter_mut()
        .for_each(|t| {
            if t.requires_grad() {
                g = t.grad();
                velocity[vcounter] = BETA * &velocity[vcounter] + (1.0 - BETA) * &g;
                t.set_data(&(t.data() - learning_rate * &velocity[vcounter]));
                t.zero_grad();
            }
            vcounter += 1;
        });
    }
}

fn train<F>(mem: &mut Memory, x: &Tensor, y: &Tensor, model: &dyn Compute, epochs: i64, batch_size: i64, errfunc: F, learning_rate: f32)
    where F: Fn(&Tensor, &Tensor)-> Tensor
        {
        let mut error = Tensor::from(0.0);
        let mut batch_error = Tensor::from(0.0);
        let mut pred = Tensor::from(0.0);
        for epoch in 0..epochs {
            batch_error = Tensor::from(0.0);
            for (batchx, batchy) in get_batches(&x, &y, batch_size, true) {
                pred = model.forward(mem, &batchx);
                error = errfunc(&batchy, &pred);
                batch_error += error.detach();
                error.backward();
                mem.apply_grads_sgd_momentum(learning_rate);
            }
            println!("Epoch: {:?} Error: {:?}", epoch, batch_error/batch_size);
        }
}

fn get_batches(x: &Tensor, y: &Tensor, batch_size: i64, shuffle: bool) -> impl Iterator<Item = (Tensor, Tensor)> {
    let num_rows = x.size()[0];
    let num_batches = (num_rows + batch_size - 1) / batch_size;

    let indices = if shuffle {
        Tensor::randperm(num_rows as i64, (Kind::Int64, Device::Cpu))
    } else
    {
        let rng = (0..num_rows).collect::<Vec<i64>>();
        Tensor::from_slice(&rng)
    };
    let x = x.index_select(0, &indices);
    let y = y.index_select(0, &indices);

    (0..num_batches).map(move |i| {
        let start = i * batch_size;
        let end = (start + batch_size).min(num_rows);
        let batchx: Tensor = x.narrow(0, start, end - start);
        let batchy: Tensor = y.narrow(0, start, end - start);
        (batchx, batchy)
    })
}


fn load_mnist() -> (Tensor, Tensor) {
    let data = MnistBuilder::new()
        .label_format_digit()
        .training_set_length(1000)
        .validation_set_length(1000)
        .finalize();

    let train_images = Tensor::from_slice(&data.trn_img);
    let val_images = Tensor::from_slice(&data.trn_lbl);
    let x = train_images;
    let y = val_images;
    (x, y)
}

fn accuracy(target: &Tensor, pred: &Tensor) -> f64 {
    let yhat = pred.argmax(1,true).squeeze();
    let eq = target.eq_tensor(&yhat);
    let accuracy: f64 = (eq.sum(Kind::Int64) / target.size()[0]).double_value(&[]).into();
    accuracy
}

struct LinearCircuit {
    weights: Vec<f32>,
    biases: Vec<f32>,
    inputs: Vec<f32>,
    outputs: Vec<f32>,
}

impl Circuit<Fr> for LinearCircuit {
    fn configure(meta: &mut ConstraintSystem<Fr>) -> Self::Config {
        let weights_col = meta.advice_column();
        let biases_col = meta.advice_column();
        let inputs_col = meta.advice_column();
        let outputs_col = meta.advice_column();

        let s_mul = meta.selector();

        let config = LinearConfig {
            weights_col,
            biases_col,
            inputs_col,
            outputs_col,
            s_mul,
        };

        meta.enable_equality(config.weights_col.into());
        meta.enable_equality(config.biases_col.into());
        meta.enable_equality(config.inputs_col.into());
        meta.enable_equality(config.outputs_col.into());

        config
    }

    fn synthesize(&self, cs: &mut impl Layouter<Fr>, config: Self::Config) -> Result<(), Error> {
        for i in 0..self.weights.len() {
            let weight = self.weights[i];
            let bias = self.biases[i];
            let input = self.inputs[i];
            let output = self.outputs[i];

            cs.assign_advice(|| "weight", config.weights_col, 0, || Ok(Fr::from(weight)))?;
            cs.assign_advice(|| "bias", config.biases_col, 0, || Ok(Fr::from(bias)))?;
            cs.assign_advice(|| "input", config.inputs_col, 0, || Ok(Fr::from(input)))?;
            cs.assign_advice(|| "output", config.outputs_col, 0, || Ok(Fr::from(output)))?;

            config.s_mul.enable(cs, 0);
        }

        Ok(())
    }
}

struct LinearConfig {
    weights_col: Column<Advice>,
    biases_col: Column<Advice>,
    inputs_col: Column<Advice>,
    outputs_col: Column<Advice>,
    s_mul: Selector,
}


#[benchy::benchmark]
fn run_mnist(bench: &mut BenchmarkRun) {
    let mnist = MnistBuilder::new()
        .label_format_digit()
        .finalize();

    let (x, y) = load_mnist();

    let mut m = Memory::new();
    let mnist_model = MNISTModel::new(&mut m);
    train(&mut m, &x, &y, &mnist_model, 100, 128, cross_entropy, 0.3);
    let out = mnist_model.forward(&m, &x);

let weights_tensor = weights.view([-1]);
let mut weights: Vec<f32> = vec![0.0; weights_tensor.numel() as usize];
weights_tensor.copy_to(&mut weights, false);

let biases_tensor = biases.view([-1]);
let mut biases: Vec<f32> = vec![0.0; biases_tensor.numel() as usize];
biases_tensor.copy_to(&mut biases, false);
    let inputs = x.view([-1]);
    let output_tensor = mnist_model.forward(&m, &x);
    let outputs: Vec<f32> = output_tensor.view([-1]).iter::<f32>().unwrap().collect();

    let params = gen_srs::<KZGCommitmentScheme<_>>(14 as u32);

    let circuit = LinearCircuit {
        weights: weights.clone(),  // Fill in with your weights
        biases: biases.clone(),   // Fill in with your biases
        inputs: inputs.clone(),   // Fill in with your inputs
        outputs: outputs.clone(),  // Fill in with your outputs
    };

    // Use MNIST data for the tensors
    let image_tensor = Tensor::from_slice(&mnist.trn_img);
    let label_tensor = Tensor::from_slice(&mnist.trn_lbl);
    image_tensor.reshape(&[IMAGE_SIZE as i64, 1]);
    label_tensor.reshape(&[1 as i64, 1]);


    bench.run(|| {
            create_keys::<KZGCommitmentScheme<Bn256>, Fr, LinearCircuit>(&circuit, &params)
                .unwrap();
        });

        let pk =
            create_keys::<KZGCommitmentScheme<Bn256>, Fr, LinearCircuit>(&circuit, &params).unwrap();
    // Generate the proof
    let prover = create_proof_circuit_kzg(
        circuit.clone(),
        &params,
        None,
        &pk,
        TranscriptType::EVM,
        halo2_proofs::poly::kzg::strategy::SingleStrategy::new(&params),
        // use safe mode to verify that the proof is correct
        CheckMode::SAFE,
        None,
    );

    // Verify the proof
    let strategy = halo2_proofs::poly::kzg::strategy::SingleStrategy::new(params.verifier_params());
    let vk = pk.get_vk();
    // let result = verify_proof_circuit_kzg(params.verifier_params(), proof, vk, strategy);

    // assert!(result.is_ok());

}

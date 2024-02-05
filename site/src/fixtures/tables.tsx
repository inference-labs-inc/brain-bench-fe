import {
  LanguageSupportDescription,
  ResultTableProperty,
  SupportTable,
  meanAverage,
  sizeFormatter,
  timeFormatter,
} from '@/components/ResultsTable'
import { Link, Text } from '@chakra-ui/react'
import { upperFirst } from 'lodash'
import benchmarks from './benchmarks.json'

export const properties: ResultTableProperty[] = [
  {
    name: 'Source Language',
    prop: `sourceLanguage`,
    desc: `The language used to write the framework.`,
  },
  {
    name: 'Version',
    prop: `version`,
    desc: `The version of the framework used.`,
  },
  {
    name: 'API Support',
    desc: `Languages in which the framework supports an API. These are the languages that can be used to write programs that interact with the framework.`,
  },
  {
    name: 'Python',
    prop: `apiSupport.python`,
    desc: (
      <LanguageSupportDescription
        href='https://www.python.org/'
        name='Python'
      />
    ),
    indent: 4,
    annotations: {
      zkml: 'ZKML does not support API bindings, it is accessed via a command line interface.',
      '0g': '0g does not support API bindings, it is accessed via a command line interface.',
    },
  },
  {
    name: 'Javascript',
    prop: `apiSupport.javascript`,
    desc: (
      <LanguageSupportDescription
        href='https://developer.mozilla.org/en-US/docs/Web/JavaScript'
        name='Javascript'
      />
    ),
    indent: 4,

    annotations: {
      zkml: 'ZKML does not support API bindings, it is accessed via a command line interface.',
      '0g': '0g does not support API bindings, it is accessed via a command line interface.',
    },
  },
  {
    name: 'Rust',
    prop: `apiSupport.rust`,
    desc: (
      <LanguageSupportDescription
        href='https://www.rust-lang.org/'
        name='Rust'
      />
    ),
    indent: 4,

    annotations: {
      zkml: 'ZKML does not support API bindings, it is accessed via a command line interface.',
      '0g': '0g does not support API bindings, it is accessed via a command line interface.',
    },
  },
  {
    name: 'Others',
    prop: `apiSupport.others`,
    indent: 4,
  },
  {
    name: 'ZK Proving System',
    prop: `zkProvingSystem`,
    desc: `Zero Knowledge proof system used by the framework (if applicable).`,
  },
  {
    name: 'Unbounded Models',
    prop: `unboundedModels`,
    desc: `Unbounded models allow inputs / outputs of variable size and loops where the number of iterations is not known at compile time. See the FAQ below for more detail on unbounded vs bounded models.`,
  },
  {
    name: 'Randomness Operations',
    prop: `randomnessOperations`,
    desc: `Does the framework support randomness operations within models?`,
  },
  {
    name: 'Audit',
    prop: `audit`,
    desc: `Whether the framework has been audited by a third party.`,
  },
  {
    name: 'Native Model Format',
    desc: `The format that models need to be in to be used by the framework.`,
    info: {
      risc0: 'risc0 supports Rust fully, and C++ with experimental support.',
      zkml: 'ZKML supports TFLite models in the msgpack format.',
    },
    prop: `nativeModelFormat`,
  },
  {
    name: 'Supported Operators',
    desc: `Operators supported by the framework. This number and chart is based on the operations supported by the source model format accepted by the framework.`,
    prop: `operatorSupport`,
    value: (val: any) => {
      if (!val) return 'No data'
      val.supported = val.supported || 0
      val.total = val.total || 0
      return `${((val.supported.length / val.total.length) * 100).toFixed(0)}%`
    },
    info: {
      ezkl: <SupportTable id='ezkl' />,
      zkml: <SupportTable id='zkml' />,
      orion: <SupportTable id='orion' />,
      risc0:
        'risc0 is a generalized zkML solution, and supports Rust with experimental support for C++.',
    },
  },
  {
    name: 'GPU Acceleration',
    desc: `Which GPU acceleration frameworks does the library support?`,
  },
  {
    name: 'CUDA',
    indent: 4,
    prop: `gpu.cuda`,
    desc: `CUDA is a parallel computing platform and programming model developed by Nvidia for general computing on its own GPUs.`,
    info: {
      ezkl: (
        <Text fontSize='sm'>
          EZKL offers CUDA support via{' '}
          <Link
            target='_blank'
            href='https://github.com/ingonyama-zk/icicle#zero-knowledge-on-gpu'
            textDecor='underline'
          >
            Icicle's CUDA backend
          </Link>
          .
        </Text>
      ),
    },
  },
  {
    name: 'Metal',
    indent: 4,
    prop: `gpu.metal`,
    desc: `Metal is a low-level, low-overhead hardware-accelerated 3D graphic and compute shader application programming interface (API) developed by Apple.`,
  },
]

export const metrics: ResultTableProperty[] = Object.entries(benchmarks)
  .filter(([name]) => name !== 'meta' && !!name)
  .map(([name, benchmark]) => [
    // {
    //   name: 'Dot Product',
    //   desc: `A dot product is calculated for a given input size. This is a good test to see how the framework circuitizes and proves a simple operation.`,
    //   prop: `metrics.dot-product.results.0.$metric`,
    //   value: metricFormatter,
    // },
    {
      name: upperFirst(name.split('_').join(' ')),
      desc: `Benchmarks using the ${name} Model.`,
    },
    {
      name: 'Proof Size',
      indent: 4,
      desc: `The size of the proof generated by the framework.`,
      prop: `metrics.${name}.$framework.proofSize`,
      value: (vals: string[]) =>
        vals
          ? meanAverage(
              vals.map((val) => `${+val / 1000}`),
              '',
              sizeFormatter
            )
          : 'No data',
    },
    // {
    //   name: 'Accuracy',
    //   indent: 4,
    //   desc: `The accuracy of the model in relation to the original model. This test determines how well the framework can preserve the model being circuitized.`,
    //   prop: `metrics.${name}.$framework.accuracy_checker_accuracy`,
    //   value: (val: any) => (val || val === 0 ? `${val}%` : 'No data'),
    // },
    // {
    //   name: 'Proving Key Size',
    //   indent: 4,
    //   desc: `The size of the proving key generated by the framework.`,
    //   prop: `metrics.${name}.$framework.proofSize`,
    //   value: (val: string[]) => meanAverage(val, 'kb', sizeFormatter),
    // },
    {
      name: 'Proof Memory Usage',
      indent: 4,
      desc: `The memory usage of the proof generation process.`,
      prop: `metrics.${name}.$framework.memoryUsage`,
      value: (val: string[]) => meanAverage(val, 'kb', sizeFormatter),
    },
    {
      name: 'Proof Time',
      indent: 4,
      desc: `The time it takes to generate a proof for this circuit.`,
      prop: `metrics.${name}.$framework.provingTime`,
      value: (val: string[]) => meanAverage(val, 's', timeFormatter),
    },
    // {
    //   name: 'Verification Key Size',
    //   indent: 4,
    //   desc: `The size of the verification key generated by the framework.`,
    //   prop: `metrics.${name}.$framework.verification_key_size`,
    //   value: metricFormatter,
    // },
    // {
    //   name: 'Solidity Verifier Size',
    //   indent: 4,
    //   desc: `The size of the Solidity verifier generated by the framework.`,
    //   prop: `metrics.${name}.$framework.verifier_size`,
    //   value: metricFormatter,
    //   annotations: {
    //     zkml: 'ZKML does not generate a Solidity verifier.',
    //   },
    // },
    // {
    //   name: 'Solidity Verifier Gas Fee',
    //   indent: 4,
    //   desc: `The approximate cost to verify an inference on-chain using the Solidity verifier generated by the framework.`,
    //   prop: `metrics.${name}.$framework.prove_file_sizes.solidity_verifier_gas_fee`,
    //   value: (val: any) => (val || val === 0 ? `${val} gas` : 'No data'),
    //   annotations: {
    //     zkml: 'ZKML does not generate a Solidity verifier.',
    //   },
    // },
  ])
  .flat()

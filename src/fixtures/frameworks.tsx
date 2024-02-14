import ezklOps from './ezkl/supported_ops.json'
import onnxOps from './onnx_ops.json'
import orionOps from './orion/supported_ops.json'
import tfliteOps from './tflite_ops.json'
import zkmlOps from './zkml/supported_ops.json'

export enum Support {
  FULL = '✅',
  PARTIAL = '🟡',
  NONE = '❌',
  UNKNOWN = 'No Data',
}

export const frameworks = [
  {
    id: 'ezkl',
    name: 'EZKL',
    url: 'https://ezkl.xyz',
    version: '7.0.0',
    apiSupport: {
      python: Support.FULL,
      javascript: Support.FULL,
      rust: Support.FULL,
      others: 'WASM',
    },
    operatorSupport: {
      total: onnxOps.sort(),
      supported: ezklOps.sort(),
      notSupported: onnxOps
        .filter(
          (op) =>
            !ezklOps.map((op) => op.toLowerCase()).includes(op.toLowerCase())
        )
        .sort(),
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'SNARK',
    unboundedModels: Support.NONE,
    randomnessOperations: Support.NONE,
    nativeModelFormat: 'ONNX',
    audit: Support.NONE,
    gpu: {
      cuda: Support.FULL,
      metal: Support.NONE,
    },
  },
  {
    id: 'riscZero',
    name: 'risc0',
    url: 'https://github.com/risc0/risc0',
    version: 'v0.19.1',
    apiSupport: {
      python: Support.NONE,
      javascript: Support.NONE,
      rust: Support.FULL,
      others: Support.PARTIAL,
    },
    operatorSupport: {
      total: [0],
      supported: [0],
      notSupported: [],
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'STARK',
    unboundedModels: Support.FULL,
    randomnessOperations: Support.FULL,
    nativeModelFormat: 'Rust, C++',
    audit: Support.NONE,
    gpu: {
      cuda: Support.FULL,
      metal: Support.FULL,
    },
  },
  {
    id: 'orion',
    name: 'Orion',
    url: 'https://github.com/gizatechxyz/orion',
    version: 'v0.2.2',
    sourceLanguage: 'Cairo',
    apiSupport: {
      python: Support.NONE,
      javascript: Support.NONE,
      rust: Support.FULL,
      others: Support.NONE,
    },
    operatorSupport: {
      total: onnxOps.sort(),
      supported: orionOps.sort(),
      notSupported: onnxOps
        .filter(
          (op) =>
            !orionOps.map((op) => op.toLowerCase()).includes(op.toLowerCase())
        )
        .sort(),
    },
    zkProvingSystem: 'STARK',
    unboundedModels: Support.NONE,
    randomnessOperations: Support.NONE,
    audit: Support.NONE,
    nativeModelFormat: 'ONNX',
    gpu: {
      cuda: Support.NONE,
      metal: Support.NONE,
    },
  },
  {
    id: 'zkml',
    disabled: true,
    disabledForMetricsOnly: true,
    name: `Daniel Kang's zkML`,
    url: 'https://github.com/ddkang/zkml',
    label:
      "This framework couldn't complete any of the benchmarks listed due to a lack of support for the required operations or uncaught errors.",
    version: 'main@4378958',
    apiSupport: {
      python: Support.NONE,
      javascript: Support.NONE,
      rust: Support.NONE,
      others: Support.NONE,
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'SNARK',
    unboundedModels: Support.NONE,
    randomnessOperations: Support.NONE,
    nativeModelFormat: 'msgpack',
    audit: Support.NONE,
    operatorSupport: {
      total: tfliteOps.sort(),
      supported: zkmlOps.sort(),
      notSupported: tfliteOps
        .filter(
          (op) =>
            !zkmlOps.map((op) => op.toLowerCase()).includes(op.toLowerCase())
        )
        .sort(),
    },
    gpu: {
      cuda: Support.NONE,
      metal: Support.NONE,
    },
  },
  {
    id: 'tensorplonk',
    name: `TensorPlonk`,
    url: '',
    disabled: true,
  },
]

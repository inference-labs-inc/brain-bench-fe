import get from 'lodash/get'
import benchmarks from './benchmarks.json'
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
    metrics: get(benchmarks, 'frameworks.ezkl', {}),
  },
  {
    id: 'zkml',
    name: 'ZKML',
    url: 'https://github.com/ddkang/zkml',
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
    metrics: get(benchmarks, 'frameworks.zkml', {}),
  },
  {
    id: '0g',
    name: '0g',
    url: 'https://github.com/zkp-gravity/0g-halo2',
    version: 'main@0ade6d5',
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
    nativeModelFormat: 'HDF5',
    audit: Support.NONE,
    gpu: {
      cuda: Support.NONE,
      metal: Support.NONE,
    },
    metrics: get(benchmarks, 'frameworks.0g', {}),
  },
  {
    id: 'orion',
    name: 'Orion',
    url: 'https://github.com/gizatechxyz/orion',
    version: 'v0.1.9',
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
    metrics: get(benchmarks, 'frameworks.orion', {}),
  },
]

import get from 'lodash/get'
import benchmarks from './benchmarks.json'

export const frameworks = [
  {
    id: 'ezkl',
    name: 'EZKL',
    url: 'https://ezkl.xyz',
    version: '7.0.0',
    apiSupport: {
      python: true,
      javascript: true,
      rust: true,
      others: 'WASM',
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'SNARK',
    unboundedModels: true,
    randomnessOperations: true,
    supportedFormats: {
      onnx: true,
      tensorflow: true,
      pytorch: true,
      others: null,
    },
    audit: false,
    gpu: {
      cuda: true,
    },
    metrics: get(benchmarks, 'frameworks.ezkl', {}),
  },
  {
    id: 'zkml',
    name: 'ZKML',
    url: 'https://github.com/ddkang/zkml',
    version: 'main@4378958',
    apiSupport: {
      python: false,
      javascript: false,
      rust: false,
      others: null,
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'SNARK',
    unboundedModels: false,
    randomnessOperations: false,
    supportedFormats: {
      onnx: false,
      tensorflow: true,
      pytorch: false,
      others: null,
    },
    audit: false,
    gpu: {
      cuda: false,
    },
    metrics: get(benchmarks, 'frameworks.zkml', {}),
  },
  {
    id: '0g',
    name: '0g',
    url: 'https://github.com/zkp-gravity/0g-halo2',
    version: 'main@0ade6d5',
    apiSupport: {
      python: false,
      javascript: false,
      rust: false,
      others: null,
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'BTHOWeN',
    unboundedModels: true,
    randomnessOperations: true,
    supportedFormats: {
      onnx: false,
      tensorflow: false,
      pytorch: false,
      others: 'WNN',
    },
    audit: false,
    gpu: {
      cuda: false,
    },
    metrics: get(benchmarks, 'frameworks.0g', {}),
  },
]

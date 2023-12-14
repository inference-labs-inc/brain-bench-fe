import benchmarks from './benchmarks.json'

export const frameworks = [
  {
    id: 'ezkl',
    name: 'EZKL',

    url: 'https://ezkl.xyz',
    apiSupport: {
      python: true,
      javascript: true,
      rust: true,
      others: null,
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
    metrics: benchmarks.frameworks.ezkl,
  },
  {
    id: 'zkml',
    name: 'ZKML',
    logo: null,
    url: 'https://github.com/ddkang/zkml',
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
    metrics: benchmarks.frameworks.zkml,
  },
  {
    id: '0g',
    name: '0g',
    logo: null,
    url: 'https://github.com/zkp-gravity/0g-halo2',
    apiSupport: {
      python: false,
      javascript: false,
      rust: false,
      others: null,
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'BETHOWeN',
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
    metrics: benchmarks.frameworks['0g'],
  },
]

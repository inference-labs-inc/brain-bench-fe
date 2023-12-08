import EZKLDarkLogo from '@/img/frameworks/EZKL_Dark.png'
import EZKLLightLogo from '@/img/frameworks/EZKL_Light.png'
import benchmarks from './benchmarks.json'

export const frameworks = [
  {
    id: 'ezkl',
    name: 'EZKL',
    logo: {
      height: 30,
      width: 30,
      src: {
        light: EZKLDarkLogo,
        dark: EZKLLightLogo,
      },
    },
    url: 'https://ezkl.xyz',
    supportedLanguages: {
      python: true,
      javascript: true,
      rust: true,
    },
    sourceLanguage: 'Rust',
    zkProvingSystem: 'SNARK',
    unboundedModels: true,
    randomnessOperations: true,
    supportedFormats: {
      onnx: true,
      tensorflow: true,
      pytorch: true,
    },
    audit: false,
    gpu: {
      cuda: true,
    },
    metrics: benchmarks.frameworks.ezkl,
  },
]

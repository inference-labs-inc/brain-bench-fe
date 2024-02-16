import {
  LanguageSupportDescription,
  SupportTable,
  meanAverage,
  sizeFormatter,
  timeFormatter,
} from '@/components/ResultsTable'
import { Link, Text } from '@chakra-ui/react'
import { upperFirst } from 'lodash'
import benchmarks from './benchmarks.json'

export const properties: any[] = [
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
    noProp: true,
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
    noProp: true,
  },
  {
    name: 'CUDA',
    indent: 4,
    prop: `gpu.cuda`,
    desc: `CUDA is a parallel computing platform and programming model developed by Nvidia for general computing on its own GPUs.`,
    annotations: {
      riscZero: (
        <Text>
          risc0 offers CUDA support via the Rust CUDA crate. Due to{' '}
          <Link href='https://github.com/risc0/risc0/issues/1025'>
            this open issue
          </Link>
          , we weren't able to include CUDA accelerated benchmarks on this site.
        </Text>
      ),
    },
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

export const metrics: any[] = Object.entries(benchmarks)
  .filter(([name]) => name !== 'meta' && !!name)
  .map((item) => Object.entries(item[1]))
  .flat()
  .map(([name]) => {
    return [
      {
        name: upperFirst(name.split('_').join(' ')),
        noProp: true,
        desc: `Benchmarks using the ${upperFirst(name).replace(
          '_',
          ' '
        )} model.`,
      },
      {
        name: 'Proof Size',
        indent: 4,
        desc: `The size of the proof generated by the framework.`,
        prop: `${name}.$framework.proofSize`,
        value: (vals: string[] | number[]) =>
          vals
            ? meanAverage(
                vals.map(
                  (val) =>
                    `${+(typeof val === 'string'
                      ? +val.replace('kb', '')
                      : +val / 1024)}kb`
                ),
                '',
                sizeFormatter
              )
            : 'No data',
        annotations: {
          zkml: 'ZKML Benchmarks could not be completed due to errors.',
        },
        info: {
          orion: "Proof size couldn't be calculated for orion.",
        },
      },
      {
        name: 'Proof Memory Usage',
        indent: 4,
        desc: `The memory usage of the proof generation process.`,
        prop: `${name}.$framework.memoryUsage`,
        value: (val: string[]) => meanAverage(val, 'kb', sizeFormatter),
        annotations: {
          zkml: 'ZKML Benchmarks could not be completed due to errors.',
        },
      },
      {
        name: 'Proof Time',
        indent: 4,
        desc: `The time it takes to generate a proof for this circuit.`,
        prop: `${name}.$framework.provingTime`,
        value: (val: string[]) => meanAverage(val, 's', timeFormatter),
        annotations: {
          zkml: 'ZKML Benchmarks could not be completed due to errors.',
        },
      },
    ]
  })
  .flat()
  .filter(
    (value, index, self) =>
      index ===
      self.findIndex((t) => t.name === value.name && t.prop === value.prop)
  )

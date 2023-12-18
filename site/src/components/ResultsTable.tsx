import { InfoIcon, WarningIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spacer,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useState } from 'react'
// import { MdInfo } from 'react-icons/md'
import benchmarks from '@/fixtures/benchmarks.json'
import { frameworks } from '@/fixtures/frameworks'
import { timeSinceLastUpdate } from '@/util/date'
import bytes from 'bytes'
import { FaExternalLinkAlt } from 'react-icons/fa'
import ezklOps from '../fixtures/ezkl/supported_ops.json'
import allOps from '../fixtures/onnx_ops.json'

const machines = [
  {
    name: 'M1 Max',
    prop: 'Darwin-arm-24Ghz-32GB',
    // Cost per hour, per https://instances.vantage.sh/aws/ec2/mac2.metal
    cost: 0.65,
  },
  {
    name: 'Ubuntu 16 Cores',
    prop: 'ubuntu-latest-16-cores',
    // Cost per hour, per https://instances.vantage.sh/?min_vcpus=16&selected=c6g.metal
    cost: 2.176,
    disabled: true,
  },
  {
    name: 'CUDA',
    prop: 'ubuntu-latest-cuda',
    // Cost per hour, per https://instances.vantage.sh/?min_vcpus=16&selected=g4dn.8xlarge
    cost: 4.032,
    disabled: true,
  },
]

const methods = [
  {
    id: 'python',
    name: 'Python',
    prop: 'python',
  },
  {
    id: 'rust',
    name: 'Rust',
    prop: 'rust',
    disabled: true,
  },
]

interface ResultTableProperty {
  name: string
  desc?: string | JSX.Element
  prop?: string
  indent?: number
  annotations?: Record<string, string | JSX.Element>
  value?: (val: any, vars: Record<string, any>) => any
}

const metricFormatter = (val: any, vars: Record<string, any>) => {
  if (!val) return 'No data'
  if (vars.cost) {
    const machine = machines.find((m) => m.prop === vars.machine)
    if (!machine) return null
    const costPerSecond = machine.cost / 3600
    const totalCost = (val.secs + val?.nanos / 1e9) * costPerSecond
    return `$${formatToTwoSignificantDigits(totalCost)}`
  }
  if (vars.metric == 'time') {
    return `${(val.secs + val?.nanos / 1e9).toFixed(2)}s`
  }
  return bytes(val)
}

const LanguageSupportDescription = ({
  name,
  href,
}: {
  name: string
  href: string
}) => (
  <>
    Whether this library supports the{' '}
    <Link href={href} target='_blank' isExternal>
      {name}
    </Link>{' '}
    programming language.
  </>
)

const properties: ResultTableProperty[] = [
  {
    name: 'Source Language',
    prop: 'sourceLanguage',
    desc: 'The language used to write the framework.',
  },
  {
    name: 'Version',
    prop: 'version',
    desc: 'The version of the framework used.',
  },
  {
    name: 'API Support',
    desc: 'Languages in which the framework supports an API. These are the languages that can be used to write programs that interact with the framework.',
  },
  {
    name: 'Python',
    prop: 'apiSupport.python',
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
    prop: 'apiSupport.javascript',
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
    prop: 'apiSupport.rust',
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
    prop: 'apiSupport.others',
    indent: 4,
  },
  {
    name: 'ZK Proving System',
    prop: 'zkProvingSystem',
    desc: 'Zero Knowledge proof system used by the framework (if applicable).',
  },
  {
    name: 'Unbounded Models',
    prop: 'unboundedModels',
    desc: 'Unbounded models allow inputs / outputs of variable size and loops where the number of iterations is not known at compile time. See the FAQ below for more detail on unbounded vs bounded models.',
  },
  {
    name: 'Randomness Operations',
    prop: 'randomnessOperations',
    desc: 'Does the framework support randomness operations within models?',
  },
  {
    name: 'Audit',
    prop: 'audit',
    desc: 'Whether the framework has been audited by a third party.',
  },
  {
    name: 'Native Model Format',
    desc: 'The format that models need to be in to be used by the framework.',
    //value: formatAsEmojiList,
    annotations: {
      '0g': '0g supports weightless neural nets (WNNs) in the HDF5 format.',
    },
    prop: 'nativeModelFormat',
  },
  {
    name: 'Supported Operators',
    desc: 'Operators supported by the framework.',
    prop: 'operatorSupport',
    value: (val: any) => {
      if (!val) return 'No data'
      val.supported = val.supported || 0
      val.total = val.total || 0
      return `${((val.supported.length / val.total.length) * 100).toFixed(0)}%`
    },
    annotations: {
      ezkl: (
        <TableContainer>
          <Table size='sm'>
            <Thead>
              <Tr>
                <Th color='green.400'>Supported</Th>
                <Th color='red.400'>Not Supported</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allOps.map((op: string, index: number) => {
                const supportedOp = ezklOps[index] ? ezklOps[index] : null
                const notSupportedOp = !ezklOps.includes(op) ? op : null
                return (
                  <Tr height={4}>
                    <Td background='rgba(130, 255, 130, 0.4)'>{supportedOp}</Td>
                    <Td background='rgba(255, 130, 130, 0.4)'>
                      {notSupportedOp}
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      ),
    },
  },
  {
    name: 'GPU Acceleration',
    desc: 'Which GPU acceleration frameworks does the library support?',
  },
  {
    name: 'CUDA',
    indent: 4,
    prop: 'gpu.cuda',
    desc: 'CUDA is a parallel computing platform and programming model developed by Nvidia for general computing on its own GPUs.',
  },
  {
    name: 'Metal',
    indent: 4,
    prop: 'gpu.metal',
    desc: 'Metal is a low-level, low-overhead hardware-accelerated 3D graphic and compute shader application programming interface (API) developed by Apple.',
  },
  {
    name: 'Dot Product',
    desc: 'A dot product is calculated for a given input size. This is a good test to see how the framework circuitizes and proves a simple operation.',
    prop: 'metrics.$machine.dot-product.results.0.$metric',
    value: metricFormatter,
  },
  {
    name: 'MNIST',
    desc: 'Benchmarks using the MNIST LeNet Model.',
  },
  {
    name: 'Proof Size',
    indent: 4,
    desc: 'The size of the proof generated by the framework.',
    prop: 'metrics.$machine.ezkl.results.mnist.prove_proof_size_bytes',
  },
]

const DisabledPopoverButton = ({ name }: { name: string }) => (
  <Popover trigger='hover' placement='top'>
    <PopoverTrigger>
      <Button size='sm' opacity='0.4' variant='ghost' cursor='not-allowed'>
        {name}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverBody>
        <Text overflowWrap='anywhere' fontSize='sm'>
          Follow us on &#120143; at{' '}
          <Link
            as={NextLink}
            target='_blank'
            color='blue.600'
            href='https://twitter.com/intent/user?screen_name=inference_labs'
          >
            @inference_labs{' '}
          </Link>
          to be notified when {name} benchmarking is added.
        </Text>
      </PopoverBody>
    </PopoverContent>
  </Popover>
)

const ResultsTable = () => {
  const [machine, setMachine] = useState(machines[0].prop)
  const [method, setMethod] = useState(methods[0].id)
  const vars = {
    machine,
    method: methods.find((a) => a.id === method)?.prop,
  }

  return (
    <Stack fontSize='sm' spacing={4}>
      <Stack
        pos='sticky'
        top={0}
        py={2}
        background='bws'
        zIndex={1001}
        direction={{ base: 'column', md: 'row' }}
      >
        <HStack>
          {machines.map(({ name, prop, disabled }) => {
            const selected = machine === prop
            if (disabled) {
              return <DisabledPopoverButton name={name} />
            }
            return (
              <Button
                size='sm'
                variant={selected ? 'solid' : 'ghost'}
                key={prop}
                onClick={() => {
                  setMachine(prop)
                }}
              >
                {name}
              </Button>
            )
          })}
        </HStack>
        <Spacer />
        <HStack>
          {methods.map(({ name, prop, id, disabled }) => {
            const selected = method === id
            if (disabled) return <DisabledPopoverButton name={name} />
            return (
              <Button
                size='sm'
                variant={selected ? 'solid' : 'ghost'}
                key={id}
                onClick={() => {
                  setMethod(id)
                }}
              >
                {name}
              </Button>
            )
          })}
        </HStack>
      </Stack>
      <Box
        border='1px solid'
        borderBottomWidth={0}
        borderColor='bw.100'
        borderRadius={5}
        maxW='90vw'
      >
        <TableContainer
          overflowX={{ base: 'scroll', lg: 'unset' }}
          overflowY='unset'
        >
          <Table>
            <Thead>
              <Tr>
                <Th
                  position='sticky'
                  top={{ base: 0, md: 12 }}
                  background='bws'
                  zIndex={1000}
                >
                  Property
                </Th>
                {frameworks.map((item) => (
                  <Th
                    key={item.name}
                    fontSize='sm'
                    position='sticky'
                    top={{ base: 0, md: 12 }}
                    background='bws'
                    zIndex={1000}
                  >
                    <Link href={item.url} target='_blank' h='full'>
                      <Stack spacing={2} justify='end' h='full'>
                        <Box>
                          {item.name}{' '}
                          <Icon
                            opacity='0.4'
                            fontSize='xs'
                            as={FaExternalLinkAlt}
                          />
                        </Box>
                      </Stack>
                    </Link>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {properties.map((prop) => {
                return (
                  <Tr key={prop.name}>
                    <Td fontWeight='600' minW='sm'>
                      <HStack pl={prop.indent ?? 0} spacing={1}>
                        <Box>{prop.name}</Box>
                        {prop.desc && (
                          <Box>
                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  opacity={0.3}
                                  variant='ghost'
                                  aria-label='info'
                                  height='18px'
                                  size='sm'
                                  icon={<InfoIcon />}
                                />
                              </PopoverTrigger>
                              <Portal>
                                <PopoverContent>
                                  <PopoverArrow />
                                  <PopoverBody>
                                    <Text overflowWrap='anywhere' fontSize='sm'>
                                      {prop.desc}
                                    </Text>
                                  </PopoverBody>
                                </PopoverContent>
                              </Portal>
                            </Popover>
                          </Box>
                        )}
                      </HStack>
                    </Td>
                    {frameworks.map((fw: any) => {
                      let value = prop.value
                        ? prop.value(getPathValue(fw, prop.prop, vars), vars)
                        : getPathValue(fw, prop.prop, vars)
                      const annotation = prop.annotations?.[fw.id]
                      return (
                        <Td key={fw.name} minW={48}>
                          <HStack spacing={1}>
                            <Box>{value}</Box>
                            {annotation && (
                              <Box>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      variant='ghost'
                                      height='1.5rem'
                                      width='1.5rem'
                                      aria-label='info'
                                      size='sm'
                                      icon={<WarningIcon color='orange.400' />}
                                    />
                                  </PopoverTrigger>
                                  <Portal>
                                    <PopoverContent>
                                      <PopoverArrow />
                                      <PopoverBody>
                                        <Text
                                          overflowWrap='anywhere'
                                          fontSize='sm'
                                        >
                                          {annotation}
                                        </Text>
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Portal>
                                </Popover>
                              </Box>
                            )}
                          </HStack>
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
            <Tfoot textAlign='center'>
              <Tr>
                <Td colSpan={4} w='full'>
                  <Text fontWeight='600' fontSize='md' textAlign='center'>
                    More benchmarks to be added.{' '}
                    <Link
                      href='https://github.com/inference-labs-inc/chainBench/pulls'
                      textDecor='underline'
                    >
                      Submit a PR
                    </Link>{' '}
                    to add yours!
                  </Text>
                </Td>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
      <HStack justify='space-between'>
        <Box
          px={2}
          as={Tooltip}
          placement='auto-start'
          label={<time>{benchmarks.meta.lastUpdated}</time>}
        >
          <Text fontWeight={600}>
            Updated {timeSinceLastUpdate(benchmarks.meta.lastUpdated)}
          </Text>
        </Box>
        <Text fontWeight={400}>
          Notice something incorrect?{' '}
          <Link
            href='https://github.com/inference-labs-inc/chainBench'
            fontWeight={600}
          >
            Let us know
          </Link>
        </Text>
      </HStack>
    </Stack>
  )
}

const getPathValue = (data: any, path?: string, vars?: Record<string, any>) => {
  if (!path) return
  let current = data
  path.split('.').forEach((part) => {
    if (!current) return undefined
    if (part.startsWith('$')) {
      part = vars?.[part.slice(1)]
      if (part.split('.').length > 1) {
        part.split('.').forEach((sub) => {
          current = current[sub]
        })
        return
      }
    }
    current = current[part]
  })
  return current
}

const formatToTwoSignificantDigits = (num: number): string => {
  const magnitude = Math.floor(Math.log10(Math.abs(num)) || 1)
  const roundedNumber =
    Math.round(num / Math.pow(10, magnitude - 1)) * Math.pow(10, magnitude - 1)
  return roundedNumber.toFixed(Math.max(0, 2 - magnitude))
}

export { ResultsTable }

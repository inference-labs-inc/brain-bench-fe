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
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import Image from 'next/image'
import NextLink from 'next/link'
import { useState } from 'react'
// import { MdInfo } from 'react-icons/md'
import benchmarks from '@/fixtures/benchmarks.json'
import { frameworks } from '@/fixtures/frameworks'
import { timeSinceLastUpdate } from '@/util/date'
import bytes from 'bytes'
import { FaExternalLinkAlt } from 'react-icons/fa'

const machines = [
  {
    name: '16x CPU',
    prop: 'ubuntu-16-shared',
    // Cost per hour
    cost: 1.008,
  },
  {
    name: '64x CPU',
    prop: 'ubuntu-latest-64-cores',
    // Cost per hour
    cost: 4.032,
  },
]

const metrics = [
  {
    id: 'time',
    name: 'Time',
    prop: 'time',
  },
  {
    id: 'memory',
    name: 'Memory',
    prop: 'metrics.memory_usage_bytes',
  },
  {
    id: 'proof_size',
    name: 'Proof Size',
    prop: 'metrics.proof_size_bytes',
  },
  {
    id: 'cost',
    name: 'Cost',
    prop: 'time',
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
  if (!val) return null
  if (vars.cost) {
    const machineCost = machines.find((m) => m.prop === vars.machine)?.cost
    if (!machineCost) return null
    const machinePerSecond = machineCost / 60 / 60
    return `$${formatToTwoSignificantDigits(
      (val.secs + val?.nanos / 1000000000) * machinePerSecond
    )}`
  }
  if (vars.metric == 'time') {
    return `${(val.secs + val?.nanos / 1000000000).toFixed(2)}s`
  }

  return bytes(val)
}

const MoreInfo = ({ children, count, more }: any) => (
  <HStack>
    <Text>{children}</Text>
    <Tooltip label={more}>
      <Text color='blue.700' cursor='pointer'>
        +{count} more
      </Text>
    </Tooltip>
  </HStack>
)

const formatAsBoolean = (val?: boolean) => (val ? '✅' : '❌')

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
    name: 'Supported Languages',
    desc: 'Languages supported by the framework. These are the languages that can be used to write programs that interact with the framework.',
  },
  {
    name: 'Python',
    prop: 'supportedLanguages.python',
    desc: (
      <LanguageSupportDescription
        href='https://www.python.org/'
        name='Python'
      />
    ),
    indent: 4,
    value: formatAsBoolean,
  },
  {
    name: 'Javascript',
    prop: 'supportedLanguages.javascript',
    desc: (
      <LanguageSupportDescription
        href='https://developer.mozilla.org/en-US/docs/Web/JavaScript'
        name='Javascript'
      />
    ),
    indent: 4,
    value: formatAsBoolean,
  },
  {
    name: 'Rust',
    prop: 'supportedLanguages.rust',
    desc: (
      <LanguageSupportDescription
        href='https://www.rust-lang.org/'
        name='Rust'
      />
    ),
    indent: 4,
    value: formatAsBoolean,
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
    value: formatAsBoolean,
  },
  {
    name: 'Randomness Operations',
    prop: 'randomnessOperations',
    desc: 'Does the framework support randomness operations within models?',
    value: formatAsBoolean,
  },
  {
    name: 'Audit',
    prop: 'audit',
    desc: 'Whether the framework has been audited by a third party.',
    value: formatAsBoolean,
  },
  {
    name: 'Supported Model Formats',
    desc: 'Which model formats does the framework support? ',
    //value: formatAsEmojiList,
    annotations: {},
  },
  {
    name: 'ONNX',
    indent: 4,
    prop: 'supportedFormats.onnx',
    desc: 'ONNX is an open format for machine learning models.',
    value: formatAsBoolean,
  },
  {
    name: 'TensorFlow',
    indent: 4,
    prop: 'supportedFormats.tensorflow',
    desc: 'TensorFlow is an open source software library for machine learning.',
    value: formatAsBoolean,
  },
  {
    name: 'PyTorch',
    indent: 4,
    prop: 'supportedFormats.pytorch',
    desc: 'PyTorch is an open source machine learning framework.',
    value: formatAsBoolean,
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
    value: formatAsBoolean,
  },
  {
    name: 'Metal',
    indent: 4,
    prop: 'gpu.metal',
    desc: 'Metal is a low-level, low-overhead hardware-accelerated 3D graphic and compute shader application programming interface (API) developed by Apple.',
    value: formatAsBoolean,
  },
  {
    name: 'Dot Product',
    desc: 'A dot product is calculated for a given input size. This is a good test to see how the framework circuitizes and proves a simple operation.',
    prop: 'metrics.$machine.dot_product.results.0.$metric',
    value: metricFormatter,
    annotations: {
      risc_zero:
        'Risc Zero is significantly slower for this test, as the minimum number of cycles for all Risc Zero programs is 64k. Therefore this very small program still requires a large number of cycles.',
    },
  },
]

export function ResultsTable() {
  const colorMode = useColorModeValue('light', 'dark')
  const [machine, setMachine] = useState(machines[0].prop)
  const [metric, setMetric] = useState(metrics[0].id)
  const vars = {
    machine,
    metric: metrics.find((a) => a.id === metric)?.prop,
    cost: metric === 'cost',
  }

  return (
    <Stack fontSize='sm' spacing={4}>
      <HStack>
        <HStack>
          {machines.map(({ name, prop }) => {
            const selected = machine === prop
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
          <Popover trigger='hover' placement='top'>
            <PopoverTrigger>
              <Button size='sm' opacity='0.4' variant='ghost'>
                CUDA
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
                  to be notified when CUDA benchmarking is added.
                </Text>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
        <Spacer />
        <HStack>
          {metrics.map(({ name, prop, id }) => {
            const selected = metric === id
            return (
              <Button
                size='sm'
                variant={selected ? 'solid' : 'ghost'}
                key={id}
                onClick={() => {
                  setMetric(id)
                }}
              >
                {name}
              </Button>
            )
          })}
        </HStack>
      </HStack>
      <Box
        border='1px solid'
        borderBottomWidth={0}
        borderColor='bw.100'
        borderRadius={5}
      >
        <TableContainer overflowX='unset' overflowY='unset'>
          <Table>
            <Thead>
              <Tr>
                <Th
                  position='sticky'
                  top={0}
                  background='bws'
                  zIndex={1000}
                ></Th>
                {frameworks.map((item) => (
                  <Th
                    key={item.name}
                    fontSize='sm'
                    position='sticky'
                    top={0}
                    background='bws'
                    zIndex={1000}
                  >
                    <a href={item.url} target='_blank'>
                      <Stack spacing={2}>
                        <Box textDecorationColor='#fff'>
                          <Image
                            alt={item.name}
                            src={item.logo.src[colorMode]}
                            height={item.logo.height}
                            width={item.logo.width}
                          />
                        </Box>
                        <Box>
                          {item.name}{' '}
                          <Icon
                            opacity='0.4'
                            fontSize='xs'
                            as={FaExternalLinkAlt}
                          />
                        </Box>
                      </Stack>
                    </a>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {properties.map((prop) => {
                return (
                  <Tr key={prop.name}>
                    <Td fontWeight='600'>
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
                        <Td key={fw.name}>
                          <HStack spacing={1}>
                            <Box>{value}</Box>
                            {annotation && (
                              <Box>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      variant='ghost'
                                      height='18px'
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
          </Table>
        </TableContainer>
      </Box>
      <Box px={2}>
        <HStack spacing={1} fontStyle='italic'>
          <Text fontWeight={600}>Last Updated:</Text>
          <Box>
            {timeSinceLastUpdate(benchmarks.meta.lastUpdated)} (
            <time>{benchmarks.meta.lastUpdated}</time>)
          </Box>
        </HStack>
      </Box>
    </Stack>
  )
}

function getPathValue(data: any, path?: string, vars?: Record<string, any>) {
  if (!path) return
  let current = data
  for (let part of path.split('.')) {
    if (!current) return undefined
    if (part.startsWith('$')) {
      part = vars?.[part.slice(1)]
      if (part.split('.').length > 1) {
        for (let sub of part.split('.')) {
          current = current[sub]
        }
        continue
      }
    }
    current = current[part]
  }
  return current
}

function formatToTwoSignificantDigits(num: number): string {
  if (num === 0) {
    return '0.00'
  }

  const magnitude = Math.floor(Math.log10(Math.abs(num)))
  const power = 1 - magnitude
  const roundedNumber =
    Math.round(num * Math.pow(10, power)) * Math.pow(10, -power)

  // When the number is less than 1
  if (magnitude < 0) {
    const placesAfterDecimal = Math.abs(magnitude) + 1
    return roundedNumber.toFixed(placesAfterDecimal)
  } else {
    const factor = Math.pow(10, magnitude - 1)
    return (roundedNumber * factor).toFixed(Math.max(0, magnitude - 1))
  }
}

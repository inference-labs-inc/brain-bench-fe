import benchmarks from '@/fixtures/benchmarks.json'
import { frameworks } from '@/fixtures/frameworks'
import { getRunnerDetails } from '@/util/bench_json'
import { timeSinceLastUpdate } from '@/util/date'
import { InfoIcon, WarningTwoIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  HStack,
  Heading,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  SimpleGrid,
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
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import bytes from 'bytes'
import { formatDuration, intervalToDuration } from 'date-fns'
import NextLink from 'next/link'
import { useState } from 'react'
import { FaExternalLinkAlt } from 'react-icons/fa'
import ComparisonBarChart from './Charts'

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
  },
]

const machines = Object.keys(benchmarks).filter((a) => a !== 'meta')

export interface ResultTableProperty {
  name: string
  desc?: string | JSX.Element
  prop?: string
  indent?: number
  annotations?: Record<string, string | JSX.Element>
  info?: Record<string, string | JSX.Element>
  value?: (val: any, vars: Record<string, any>) => any
}

export const metricFormatter = (val: any, vars: Record<string, any>) => {
  if (!val) return 'No data'

  if (vars.metric == 'time') {
    return `${(val.secs + val?.nanos / 1e9).toFixed(2)}s`
  }
  return bytes(val)
}

export const sizeFormatter = (size: any) => {
  if (!size) return 'No Data'
  const sizeInKb = parseFloat(size.replace('kb', ''))
  if (isNaN(sizeInKb)) return 'No Data'
  const sizeInBytes = sizeInKb * 1024
  var i =
    sizeInBytes == 0 ? 0 : Math.floor(Math.log(sizeInBytes) / Math.log(1024))
  return (
    (sizeInBytes / Math.pow(1024, i)).toFixed(2) +
    ' ' +
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  )
}

export const timeFormatter = (time: string) => {
  if (!time) return 'No Data'
  const timeInSeconds = +time.replace('s', '')
  if (isNaN(timeInSeconds)) return 'No Data'
  if (timeInSeconds < 1) return `${(timeInSeconds * 1000).toFixed(2)}ms`
  const duration = intervalToDuration({ start: 0, end: timeInSeconds * 1000 })
  return formatDuration(duration)
}

export const meanAverage = (
  arr: string[],
  postfix: string,
  formattingFunction: (val: string) => string
) => {
  if (!arr || !arr.length) return 'No data'

  const floatArray = arr.map((v: string) => parseFloat(v.replace(postfix, '')))
  const mean =
    floatArray.reduce((a: number, b: number) => a + b, 0) / floatArray.length

  return formattingFunction(`${mean}${postfix}`)
}

export const SupportTable = ({ id: idName }: { id: string }) => {
  const operatorSupport = frameworks.find(
    ({ id }) => id === idName
  )?.operatorSupport
  if (!operatorSupport) return null
  const redColor = useColorModeValue('red.400', 'red.600')
  const greenColor = useColorModeValue('green.400', 'green.600')

  return (
    <TableContainer overflowX={{ base: 'auto', lg: 'hidden' }}>
      <Table size='sm'>
        <Thead>
          <Tr>
            <Th border='none' color={greenColor} px={0}>
              Supported
            </Th>
            <Th border='none' color={redColor} px={0}>
              Not Supported
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {(operatorSupport.supported.length >
          operatorSupport.notSupported.length
            ? operatorSupport.supported
            : operatorSupport.notSupported
          ).map((_, index, arr) => {
            if (
              operatorSupport.supported[index] ||
              operatorSupport.notSupported[index]
            )
              return (
                <Tr height={4} key={`operator-support-${index}`}>
                  <Td
                    {...(index === arr.length - 1
                      ? { roundedBottomLeft: 'lg', borderBottom: 'none' }
                      : {})}
                    {...(index === 0 ? { roundedTopLeft: 'md' } : {})}
                    backgroundColor={`color-mix(in srgb, var(--chakra-colors-${greenColor.replace(
                      '.',
                      '-'
                    )}) 40%, transparent)`}
                    fontSize='xs'
                  >
                    {operatorSupport.supported[index]}
                  </Td>
                  <Td
                    {...(index === arr.length - 1
                      ? { roundedBottomRight: 'lg', borderBottom: 'none' }
                      : {})}
                    {...(index === 0 ? { roundedTopRight: 'md' } : {})}
                    backgroundColor={`color-mix(in srgb, var(--chakra-colors-${redColor.replace(
                      '.',
                      '-'
                    )}) 40%, transparent)`}
                    fontSize='xs'
                  >
                    {operatorSupport.notSupported[index]}
                  </Td>
                </Tr>
              )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export const LanguageSupportDescription = ({
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

const ResultsTable = ({
  metrics = false,
  properties,
}: {
  metrics?: boolean
  properties: ResultTableProperty[]
}) => {
  const [machine, setMachine] = useState(machines[0])
  const [method, setMethod] = useState(methods[0].id)
  const vars = {
    machine,
    method: methods.find((a) => a.id === method)?.prop,
    framework: '',
  }

  const disabledColor = useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
  return (
    <Stack fontSize='sm' spacing={4}>
      <Stack
        pos='sticky'
        top={0}
        py={2}
        background='bws'
        zIndex={1001}
        direction={{ base: 'column', md: 'row' }}
        display={metrics ? 'flex' : 'none'}
      >
        <HStack>
          {machines.map((name) => {
            const specs = getRunnerDetails(name)
            const selected = machine === name
            // if (disabled) {
            //   return <DisabledPopoverButton key={prop} name={name} />
            // }
            return (
              <Button
                size='sm'
                variant={selected ? 'solid' : 'ghost'}
                key={name}
                onClick={() => {
                  setMachine(name)
                }}
              >
                {[
                  specs.cpu,
                  'Cores,',
                  specs.ram,
                  ...(specs.accelerator && specs.accelerator !== 'None'
                    ? ['GB RAM,', specs.accelerator, 'Accelerator']
                    : ['GB RAM']),
                ].join(' ')}
              </Button>
            )
          })}
        </HStack>
        <Spacer />
        {/* <HStack>
          {methods.map(({ name, prop, id, disabled }: any) => {
            const selected = method === id
            if (disabled) return <DisabledPopoverButton key={id} name={name} />
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
        </HStack> */}
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
                  top={{ base: 0, md: metrics ? 12 : 0 }}
                  background='bws'
                  zIndex={1000}
                >
                  {metrics ? 'Benchmark' : 'Property'}
                </Th>
                {frameworks.map((item) => (
                  <Th
                    key={item.name + item.id}
                    fontSize='sm'
                    position='sticky'
                    top={{ base: 0, md: metrics ? 12 : 0 }}
                    background='bws'
                    zIndex={1000}
                    bgColor={item.disabled ? disabledColor : 'none'}
                    backdropFilter={item.disabled ? 'blur(5px)' : 'none'}
                  >
                    <Tooltip
                      label={
                        item.disabled
                          ? "This framework is not yet released and couldn't be benchmarked as a result."
                          : null
                      }
                    >
                      <Link href={item.url} target='_blank' h='full'>
                        <Stack spacing={2} justify='end' h='full'>
                          <HStack>
                            <Text>{item.name}</Text>
                            {item.disabled ? (
                              <WarningTwoIcon color='red.400' />
                            ) : (
                              <Icon
                                opacity='0.4'
                                fontSize='xs'
                                as={FaExternalLinkAlt}
                              />
                            )}
                          </HStack>
                        </Stack>
                      </Link>
                    </Tooltip>
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {properties.map((prop, index) => {
                let propPath = prop.prop || ''
                if (metrics) {
                  let pathParts = propPath.split('.')
                  if (
                    !pathParts.some((part) =>
                      machines.some((name) => part.includes(name))
                    )
                  ) {
                    pathParts.unshift(machine)
                  } else {
                    pathParts[
                      pathParts.findIndex((part) =>
                        machines.some((name) => part.includes(name))
                      )
                    ] = machine
                  }

                  if (!pathParts.includes('metrics'))
                    pathParts.unshift('metrics')
                  propPath = pathParts.join('.')
                }
                prop.prop = propPath

                return (
                  <Tr key={prop.name + index}>
                    <Td fontWeight='600' minW='sm'>
                      <HStack pl={prop.indent ?? 0} spacing={1}>
                        <Box>{prop.name}</Box>
                        {prop.desc && (
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
                              <PopoverContent
                                minW={{ base: '100%', lg: 'max-content' }}
                              >
                                <PopoverArrow />
                                <PopoverBody>
                                  <Text overflowWrap='anywhere' fontSize='sm'>
                                    {prop.desc}
                                  </Text>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                        )}
                      </HStack>
                    </Td>
                    {frameworks.map((fw: any) => {
                      let value = prop.value
                        ? prop.value(
                            getPathValue(fw, prop.prop, {
                              ...vars,
                              framework: fw.id,
                            }),
                            { ...vars, framework: fw.id }
                          )
                        : getPathValue(fw, prop.prop, {
                            ...vars,
                            framework: fw.id,
                          })
                      const annotation = prop.annotations?.[fw.id]
                      const info = prop.info?.[fw.id]
                      const content = info || annotation
                      return (
                        <Td
                          key={fw.name}
                          minW={48}
                          bg={fw.disabled ? disabledColor : 'none'}
                          opacity={fw.disabled ? 0.4 : 1}
                        >
                          <HStack spacing={1}>
                            <Box>{fw.disabled ? 'Unknown' : value}</Box>
                            {content ? (
                              <Box>
                                <Popover>
                                  <PopoverTrigger>
                                    <IconButton
                                      variant='ghost'
                                      height='1.5rem'
                                      width='1.5rem'
                                      aria-label='info'
                                      size='sm'
                                      icon={
                                        info ? (
                                          <InfoIcon color='gray.400' />
                                        ) : (
                                          <WarningTwoIcon color='yellow.400' />
                                        )
                                      }
                                    />
                                  </PopoverTrigger>
                                  <Portal>
                                    <PopoverContent
                                      minW={{ base: '100%', lg: 'min-content' }}
                                      maxH='sm'
                                      overflow='visible !important'
                                    >
                                      <PopoverArrow />
                                      <PopoverBody
                                        overflowX={{
                                          base: 'scroll',
                                          lg: 'hidden',
                                        }}
                                      >
                                        {typeof content === 'string' ? (
                                          <Text
                                            overflowWrap='anywhere'
                                            fontSize='sm'
                                          >
                                            {info || annotation}
                                          </Text>
                                        ) : (
                                          content
                                        )}
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Portal>
                                </Popover>
                              </Box>
                            ) : null}
                          </HStack>
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })}
            </Tbody>
            <Tfoot
              textAlign='center'
              display={metrics ? 'table-footer-group' : 'none'}
            >
              <Tr>
                <Td colSpan={6} w='full'>
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
      <HStack justify='space-between' display={metrics ? 'flex' : 'none'}>
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
      {metrics && (
        <SimpleGrid columns={2} spacing={10}>
          {Object.keys(
            benchmarks[Object.keys(benchmarks)[0] as keyof typeof benchmarks]
          ).map((model) =>
            Object.keys(
              (
                benchmarks[
                  Object.keys(benchmarks)[0] as keyof typeof benchmarks
                ] as any
              )[model]
            ).map((property, index) => (
              <VStack key={`${model}-${property}`}>
                <Heading as='h2' fontSize='xl'>
                  {property} for{' '}
                  {model
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </Heading>
                <ComparisonBarChart
                  modelName={model}
                  propertyName={index === 0 ? 'memoryUsage' : 'provingTime'}
                  machine={machine as keyof typeof benchmarks}
                />
              </VStack>
            ))
          )}
        </SimpleGrid>
      )}
    </Stack>
  )
}
const getPathValue = (data: any, path?: string, vars?: Record<string, any>) => {
  if (!path) return
  let current = data

  path.split('.').forEach((part) => {
    if (!current) return undefined
    if (part === 'metrics') {
      current = benchmarks
      return
    }
    if (part.startsWith('$')) {
      part = vars?.[part.slice(1)]
    }
    current = part.split('.').reduce((acc, sub) => acc && acc[sub], current)
  })

  return current
}

const formatToTwoSignificantDigits = (num: number): string => {
  const magnitude = Math.floor(Math.log10(Math.abs(num)) || 1)
  const roundedNumber =
    Math.round(num / Math.pow(10, magnitude - 1)) * Math.pow(10, magnitude - 1)
  return roundedNumber.toFixed(Math.max(0, 2 - magnitude))
}

export const ResultsTableContainer = ({
  name,
  children,
}: {
  name: string
  children: JSX.Element
}) => (
  <Box maxW='container.xl' margin='0 auto'>
    <VStack spacing={8} align='start'>
      <Heading>{name}</Heading>
      {children}
    </VStack>
  </Box>
)

export default ResultsTable

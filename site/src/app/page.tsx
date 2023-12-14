'use client'

import { ColorModeSwitcher } from '@/components/ColorModeSwitcher'
import { ResultsTable } from '@/components/ResultsTable'
import x from '@/img/X.png'
import logo_dark from '@/img/logo/Dark.svg'
import logo_light from '@/img/logo/Light.svg'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Image as ChakraImage,
  Flex,
  HStack,
  Heading,
  Link,
  Spacer,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import Image from 'next/image'
import bench_dark from '../img/bench_dark.svg'
import bench_light from '../img/bench_light.svg'
import Faq from '../mkd/faq.mdx'

export default function Home() {
  const logo = useColorModeValue(logo_light, logo_dark)
  const bench = useColorModeValue(bench_light, bench_dark)
  return (
    <main>
      <Box mb={20}>
        <Flex>
          <Box px={4}>
            <Box as={VStack} justify='start' align='start' spacing={4} p={4}>
              <Heading fontSize='xx-large'>
                ch<sub>AI</sub>nBench
              </Heading>
              <HStack>
                <Heading fontSize='medium'>By</Heading>
                <Flex maxW={125}>
                  <Link
                    priority
                    loading='eager'
                    as={Image}
                    alt='Inference Labs'
                    href='https://inferencelabs.com'
                    target='_blank'
                    src={logo}
                  />
                </Flex>
              </HStack>
            </Box>
          </Box>
          <Spacer />
          <HStack p={3} align='start'>
            <Button
              as={Link}
              rightIcon={<ExternalLinkIcon />}
              textDecoration='none !important'
              variant='ghost'
              href='https://github.com/inference-labs-inc/chainBench'
              target='_blank'
              fontWeight='600'
            >
              Bring Your Own Benchmarks
            </Button>
            <ColorModeSwitcher />
          </HStack>
        </Flex>
        <Box p={4}>
          <Stack spacing={10}>
            <Box p={2}>
              <Center>
                <Stack spacing={4}>
                  <Center as={VStack} spacing={16} pb={16}>
                    <ChakraImage
                      as={Image}
                      transition='transform 0.5s'
                      transform='perspective(1000px) rotateY(0deg) rotateX(0deg)'
                      _hover={{
                        transform:
                          'perspective(3000px) rotateY(20deg) rotateX(20deg)',
                      }}
                      src={bench}
                      alt='inference labs bench'
                      width={125}
                      style={{ userSelect: 'none' }}
                      draggable={false}
                    />
                    <Heading as='h1' fontSize='x-large'>
                      Your benchmark for on-chain inference
                    </Heading>
                  </Center>
                </Stack>
              </Center>
            </Box>
            <Box maxW='container.xl' margin='0 auto'>
              <Stack spacing={8}>
                <ResultsTable />
              </Stack>
            </Box>
            <Box maxW='container.md' width='100%' margin='0 auto' p={2}>
              <Stack
                bg='bw.50'
                borderRadius={10}
                textAlign='center'
                padding={10}
                spacing={4}
                mt={10}
              >
                <Stack>
                  <Heading>Follow us on &#120143;</Heading>
                  <Heading fontSize='xl' color='bw.700'>
                    Follow the Inference Labs team to get updates ch
                    <sub>AI</sub>nBench.
                  </Heading>
                </Stack>
                <Center>
                  <Button
                    as='a'
                    href='https://twitter.com/inference_labs'
                    target='_blank'
                    size='lg'
                    background='blackAlpha.900'
                    color='white'
                    _hover={{ background: 'blackAlpha.800' }}
                    _active={{ background: 'blackAlpha.700' }}
                    colorScheme='white'
                  >
                    <HStack>
                      <Image width={22} src={x} alt='X Logo' />
                      <Text>@inference_labs</Text>
                    </HStack>
                  </Button>
                </Center>
              </Stack>
            </Box>
            <Box maxW='container.md' margin='0 auto' width='100%' p={2}>
              <Faq />
            </Box>
          </Stack>
        </Box>
      </Box>
    </main>
  )
}

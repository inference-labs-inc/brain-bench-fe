'use client'

import { ColorModeSwitcher } from '@/components/ColorModeSwitcher'
import ResultsTable, { ResultsTableContainer } from '@/components/ResultsTable'
import { metrics, properties } from '@/fixtures/tables'
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
                br<sub>AI</sub>nBench
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
              href='https://github.com/inference-labs-inc/brainBench'
              target='_blank'
              fontWeight='600'
              display={{ base: 'none', md: 'flex' }}
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
                    <Heading as='h1' fontSize='x-large' textAlign='center'>
                      Your benchmark for on-chain inference
                    </Heading>
                  </Center>
                </Stack>
              </Center>
            </Box>
            <ResultsTableContainer name='Features'>
              <ResultsTable properties={properties} />
            </ResultsTableContainer>
            <ResultsTableContainer name='Benchmarks'>
              <ResultsTable properties={metrics} metrics />
            </ResultsTableContainer>

            <Box
              maxW='container.xl'
              margin='0 auto'
              width='100%'
              px={{ base: 2, lg: 14 }}
            >
              <Faq />
            </Box>
            <Stack
              maxW='container.xl'
              width='100%'
              margin='0 auto'
              p={2}
              px={{ base: 2, lg: 14 }}
              direction={{ base: 'column', md: 'row' }}
              justify='center'
            >
              <Stack
                bg='bw.50'
                borderRadius={10}
                textAlign='left'
                padding={10}
                spacing={4}
                mt={10}
              >
                <Stack>
                  <Heading>Visit our site</Heading>
                  <Heading fontSize='md' color='bw.700'>
                    Visit the Inference Labs site to learn more about our
                    mission.
                  </Heading>
                </Stack>
                <Button
                  as={Link}
                  href='https://inferencelabs.com'
                  target='_blank'
                  size='lg'
                  background='blackAlpha.900'
                  color='white'
                  _hover={{ background: 'blackAlpha.800' }}
                  _active={{ background: 'blackAlpha.700' }}
                  colorScheme='white'
                  rightIcon={<ExternalLinkIcon />}
                >
                  Visit Site
                </Button>
              </Stack>
              <Stack
                bg='bw.50'
                borderRadius={10}
                textAlign='left'
                padding={10}
                spacing={4}
                mt={10}
              >
                <Stack>
                  <Heading>Follow us on &#120143;</Heading>
                  <Heading fontSize='md' color='bw.700'>
                    Follow the Inference Labs team to get updates on ch
                    <sub>AI</sub>nBench.
                  </Heading>
                </Stack>
                <Button
                  as={Link}
                  href='https://twitter.com/inference_labs'
                  target='_blank'
                  size='lg'
                  background='blackAlpha.900'
                  color='white'
                  _hover={{ background: 'blackAlpha.800' }}
                  _active={{ background: 'blackAlpha.700' }}
                  colorScheme='white'
                  rightIcon={<ExternalLinkIcon />}
                >
                  @inference_labs
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </main>
  )
}

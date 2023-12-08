import { LinkIcon } from '@chakra-ui/icons'
import {
  Box,
  Code,
  Divider,
  HStack,
  Heading,
  Icon,
  Link,
  ListItem,
  OrderedList,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
} from '@chakra-ui/react'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import type { MDXComponents } from 'mdx/types'
import NextLink from 'next/link'

const CustomHeading = ({ as, id, ...props }: any) => {
  if (id) {
    return (
      <Link as={NextLink} href={`#${id}`} textDecoration='none !important'>
        <HStack
          justify='start'
          align='center'
          {...pick(props, ['mt', 'mb'])}
          role='group'
        >
          <Heading
            as={as}
            id={id}
            lineHeight='1em'
            textDecoration='none'
            {...omit(props, ['mt', 'mb'])}
          />
          <Icon
            as={LinkIcon}
            w={5}
            h={5}
            transition='opacity 0.1s'
            _groupHover={{ opacity: 0.4 }}
            opacity={0}
          />
        </HStack>
      </Link>
    )
  }
  return <Heading as={as} {...props} />
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children, ...props }) => (
      <CustomHeading as='h1' size='xl' mt={12} mb={4} {...props}>
        {children}
      </CustomHeading>
    ),
    h2: ({ children, ...props }) => (
      <CustomHeading as='h2' size='lg' mt={12} mb={4} {...props}>
        {children}
      </CustomHeading>
    ),
    h3: ({ children, ...props }) => (
      <CustomHeading as='h3' size='md' mt={8} mb={3} {...props}>
        {children}
      </CustomHeading>
    ),
    h4: ({ children, ...props }) => (
      <CustomHeading as='h4' size='sm' mt={4} mb={2} {...props}>
        {children}
      </CustomHeading>
    ),
    h5: ({ children, ...props }) => (
      <CustomHeading as='h5' size='xs' mt={3} mb={2} {...props}>
        {children}
      </CustomHeading>
    ),
    h6: ({ children, ...props }) => (
      <CustomHeading as='h6' size='xs' mt={2} mb={1} {...props}>
        {children}
      </CustomHeading>
    ),

    // Table support
    table: ({ children }) => (
      <Box
        fontSize='sm'
        my={4}
        border='1px solid'
        borderColor='bw.100'
        borderRadius={5}
        overflowX='auto'
      >
        <Table variant='simple'>{children}</Table>
      </Box>
    ),
    thead: ({ children }) => <Thead bg='bw.100'>{children}</Thead>,
    tbody: ({ children }) => <Tbody>{children}</Tbody>,
    tr: ({ children }) => <Tr>{children}</Tr>,
    th: ({ children }) => (
      <Th fontSize='sm' px={4} py={2}>
        {children}
      </Th>
    ),
    td: ({ children }) => (
      <Td px={4} py={2}>
        {children}
      </Td>
    ),

    // Text and paragraphs
    p: ({ children }) => (
      <Text mt={2} mb={4} lineHeight={1.8} fontSize='md'>
        {children}
      </Text>
    ),

    // Inline code
    inlineCode: ({ children }) => <Code fontSize='sm'>{children}</Code>,

    // Block code (You can extend this further with a proper code highlighter)
    code: ({ children }) => (
      <Box
        as='pre'
        p={4}
        rounded='md'
        bg='bw.100'
        fontSize='sm'
        overflowX='auto'
      >
        {children}
      </Box>
    ),

    // Unordered list
    ul: ({ children }) => <UnorderedList my={4}>{children}</UnorderedList>,

    // Ordered list
    ol: ({ children }) => <OrderedList my={4}>{children}</OrderedList>,

    // List item
    li: ({ children }) => (
      <ListItem fontSize='md' mx={2} my={2}>
        {children}
      </ListItem>
    ),

    // Links
    a: ({ children, ...props }) => (
      <Link color='blue.500' {...props}>
        {children}
      </Link>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <Box as='blockquote' px={4} py={2} bg='gray.100' my={4} rounded='md'>
        {children}
      </Box>
    ),

    // Divider
    hr: () => <Divider my={6} />,

    // Merge with passed components
    ...components,
  }
}

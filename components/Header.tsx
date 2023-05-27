import Link from "next/link";
import { Flex, Heading, Text, Button } from "@chakra-ui/react";

export default function Header() {
  return (
    <Flex as="header" justifyContent="center">
      <Flex width="100%" justifyContent="space-between" maxW="52rem">
        <Link href="/">
          <Heading>🤗</Heading>
        </Link>
        <Link href="/new">
          <Button>New</Button>
        </Link>
      </Flex>
    </Flex>
  );
}

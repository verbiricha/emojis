import Link from "next/link";

import { Flex, Heading } from "@chakra-ui/react";

import Login from "@emoji/components/Login";

export default function Header() {
  return (
    <Flex as="header" justifyContent="center">
      <Flex width="100%" justifyContent="space-between" maxW="52rem">
        <Link href="/">
          <Heading>🤗</Heading>
        </Link>
        <Login />
      </Flex>
    </Flex>
  );
}

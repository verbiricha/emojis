import Link from "next/link";
import { Flex, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex as="footer" alignItems="center" justifyContent="center">
      <Text>
        Made with 💜 by{" "}
        <Link href="https://snort.social/verbiricha">
          <Text as="span" color="purple.600" fontWeight={500}>
            verbiricha
          </Text>
        </Link>
      </Text>
    </Flex>
  );
}

"use client";

import { useAtom } from "jotai";

import { Flex, Text } from "@chakra-ui/react";

import List from "@emoji/components/List";
import { pool, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";

export default function Emoji({ kind, pubkey, identifier }) {
  const [relays] = useAtom(relaysAtom);
  const { events, eose } = useEvents(
    [{ kinds: [kind], authors: [pubkey], "#d": [identifier] }],
    relays
  );
  return (
    <Flex flexDirection="column" alignItems="center">
      {events[0] && <List event={events[0]} isDetail w="100%" maxW="52rem" />}
    </Flex>
  );
}

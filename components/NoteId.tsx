"use client";

import { useAtom } from "jotai";

import { Flex, Text } from "@chakra-ui/react";

import Note from "@emoji/components/Note";
import { useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";

export default function Event({ id, author, relays }) {
  const { events, eose } = useEvents(
    [{ authors: [author], ids: [id] }],
    relays
  );
  return (
    <Flex flexDirection="column" alignItems="center">
      {events[0] && <Note event={events[0]} />}
    </Flex>
  );
}

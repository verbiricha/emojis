"use client";

import { useAtom } from "jotai";

import { Flex, Text } from "@chakra-ui/react";

import CreateList from "@emoji/components/CreateList";
import { pool, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";

export default function Edit({ kind, pubkey, identifier }) {
  const [relays] = useAtom(relaysAtom);
  const { events, eose } = useEvents(
    [{ kinds: [kind], authors: [pubkey], "#d": [identifier] }],
    relays
  );
  const list = events[0];
  return list ? <CreateList event={list} /> : null;
}

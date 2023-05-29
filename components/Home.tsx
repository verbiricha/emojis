"use client";

import { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { EMOJIS } from "@emoji/nostr/const";
import Emojis from "@emoji/components/List";
import { pool, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";
import EmojiGrid from "@emoji/components/EmojiGrid";

export default function HomeContent() {
  const [relays] = useAtom(relaysAtom);
  const { events, eose } = useEvents([{ kinds: [EMOJIS] }], relays);
  return (
    <Flex alignItems="center" justifyContent="center">
      <EmojiGrid>
        {events.map((e) => (
          <Emojis key={e.id} event={e} maxH="21rem" overflow="scroll" />
        ))}
      </EmojiGrid>
    </Flex>
  );
}

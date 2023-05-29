"use client";

import { Heading, Box, Stack } from "@chakra-ui/react";

import { useAtom } from "jotai";
import { getAddress } from "@emoji/nostr/address";
import { EMOJIS, USER_EMOJIS } from "@emoji/nostr/const";
import { useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";
import EmojiList from "@emoji/components/EmojiList";

export default function UserEmojis({ event }) {
  const [relays] = useAtom(relaysAtom);
  const addresses = event.tags
    .filter((t) => t.at(0) === "a" && t.at(1)?.startsWith(`${EMOJIS}:`))
    .map((t) => t.at(1))
    .filter((t) => t);
  const filter = addresses.reduce(
    (acc, addr) => {
      const [, author, d] = addr.split(":");
      return {
        "#d": acc["#d"].concat([d]),
        authors: acc.authors.concat([author]),
      };
    },
    {
      "#d": [],
      authors: [],
      kinds: [EMOJIS],
    }
  );
  const { events, eose } = useEvents([filter], relays);
  const mainEmojis = event.tags.filter((t) => t.at(0) === "emoji");
  const linkedEmojis = events
    .filter((e) =>
      event.tags.find((t) => t.at(0) === "a" && t.at(1) === getAddress(e))
    )
    .map((e) => e.tags.filter((t) => t.at(0) === "emoji"))
    .reverse()
    .flat();
  const emojis = [...mainEmojis, ...linkedEmojis];
  return addresses.length > 0 ? (
    <>
      <Box maxW="52em" px={2}>
        <EmojiList emojis={emojis} />
      </Box>
    </>
  ) : null;
}

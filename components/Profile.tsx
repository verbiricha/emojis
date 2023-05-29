"use client";

import { useAtom } from "jotai";

import { Flex, Stack, Text, Heading, Avatar } from "@chakra-ui/react";

import { EMOJIS, USER_EMOJIS } from "@emoji/nostr/const";
import List from "@emoji/components/List";
import UserEmojis from "@emoji/components/UserEmojis";
import { pool, useProfile, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";
import EmojiGrid from "@emoji/components/EmojiGrid";

export default function Profile({ pubkey }) {
  const [relays] = useAtom(relaysAtom);
  const profile = useProfile(pubkey);
  const { events, eose } = useEvents(
    [{ kinds: [EMOJIS, USER_EMOJIS], authors: [pubkey] }],
    relays
  );
  const packs = events.filter((ev) => ev.kind === EMOJIS);
  const profileEmoji = events.find((ev) => ev.kind === USER_EMOJIS);
  return (
    <Flex flexDirection="column" alignItems="center" gap={2}>
      {profile && (
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Avatar src={profile.picture} alt={profile.name} size="lg" />
          <Heading>{profile.name}</Heading>
        </Flex>
      )}
      {profileEmoji && <UserEmojis event={profileEmoji} />}
      <Heading>Emoji packs</Heading>
      <EmojiGrid>
        {packs.map((ev) => (
          <List key={ev.id} event={ev} />
        ))}
      </EmojiGrid>
    </Flex>
  );
}

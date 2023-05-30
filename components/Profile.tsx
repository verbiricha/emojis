"use client";

import { useAtom } from "jotai";

import { Flex, Text, Heading, Avatar } from "@chakra-ui/react";

import { EMOJIS, USER_EMOJIS } from "@emoji/nostr/const";
import List from "@emoji/components/List";
import UserEmojis from "@emoji/components/UserEmojis";
import { pool, useProfile, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom, userEmojiAtom } from "@emoji/user/state";
import EmojiGrid from "@emoji/components/EmojiGrid";

export default function Profile({ pubkey }) {
  const [relays] = useAtom(relaysAtom);
  const [userEmoji] = useAtom(userEmojiAtom);
  const profile = useProfile(pubkey);
  const { events, eose } = useEvents(
    [{ kinds: [EMOJIS], authors: [pubkey] }],
    relays
  );
  return (
    <Flex flexDirection="column" alignItems="center" gap={4}>
      {profile && (
        <Flex flexDirection="column" alignItems="center" mb={4}>
          <Avatar src={profile.picture} alt={profile.name} size="lg" />
          <Heading>{profile.name}</Heading>
        </Flex>
      )}
      {userEmoji && <UserEmojis event={userEmoji} />}
      <Heading>Emoji packs</Heading>
      <EmojiGrid>
        {events.map((ev) => (
          <List key={ev.id} event={ev} w="100vh" maxW="16rem" />
        ))}
      </EmojiGrid>
    </Flex>
  );
}

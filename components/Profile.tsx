"use client";

import { useAtom } from "jotai";

import { Flex, Stack, Text, Heading, Avatar } from "@chakra-ui/react";

import { EMOJIS, USER_EMOJIS } from "@emoji/nostr/const";
import List from "@emoji/components/List";
import { pool, useProfile, useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";

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
          <Text fontSize="sm" maxW="21em">
            {profile.about}
          </Text>
        </Flex>
      )}
      {profileEmoji && (
        <>
          <Heading>Emoji packs</Heading>
          <code>{JSON.stringify(profileEmoji)}</code>
        </>
      )}
      <Heading>Emoji packs</Heading>
      <Stack>
        {packs.map((ev) => (
          <List key={ev.id} event={ev} />
        ))}
      </Stack>
    </Flex>
  );
}

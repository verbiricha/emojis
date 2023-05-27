import { useMemo } from "react";

import Link from "next/link";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Avatar,
} from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import Emoji from "@emoji/components/Emoji";
import { useProfile } from "@emoji/nostr/hooks";

function EmojiTag({ tag }) {
  const [_, name, src] = tag;
  return (
    <Stack align="center" direction="row">
      <Emoji src={src} name={name} />
      <Text fontSize="lg">{name}</Text>
    </Stack>
  );
}

export default function List({ event }) {
  const identifier = event.tags.find((t) => t.at(0) === "d")?.at(1);
  const emojis = event.tags.filter((t) => t.at(0) === "emoji");
  const profile = useProfile(event.pubkey);
  const naddr = useMemo(() => {
    if (event.pubkey) {
      return nip19.naddrEncode({
        kind: event.kind,
        pubkey: event.pubkey,
        identifier,
      });
    }
  }, [event]);
  return (
    <Card minW="22rem" maxW="42rem">
      <CardHeader>
        <Flex flexDirection="column">
          {naddr ? (
            <Link href={`/a/${naddr}`}>
              <Heading>{identifier}</Heading>
            </Link>
          ) : (
            <Heading>{identifier}</Heading>
          )}
          {profile && (
            <Link href={`/p/${nip19.npubEncode(event.pubkey)}`}>
              <Stack align="center" direction="row" spacing={1}>
                <Avatar src={profile.picture} alt={profile.name} size="xs" />
                <Text fontSize="xs">{profile.name}</Text>
              </Stack>
            </Link>
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <Stack spacing={1}>
          {emojis.map((e, idx) => (
            <EmojiTag key={idx} tag={e} />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

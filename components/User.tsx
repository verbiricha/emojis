import Link from "next/link";

import { Stack, Avatar, Text } from "@chakra-ui/react";
import { nip19 } from "nostr-tools";

import { useProfile } from "@emoji/nostr/hooks";

export default function User({ pubkey, ...rest }) {
  const profile = useProfile(pubkey);
  return profile ? (
    <Link href={`/p/${nip19.npubEncode(pubkey)}`}>
      <Stack align="center" direction="row" spacing={2}>
        <Avatar src={profile.picture} alt={profile.name} size="xs" {...rest} />
        <Text fontSize="xs" {...rest}>
          {profile.name}
        </Text>
      </Stack>
    </Link>
  ) : null;
}

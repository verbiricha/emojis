"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Image,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  AtSignIcon,
  AddIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useAtom } from "jotai";
import { nip19 } from "nostr-tools";

import { RELAYS, USER_EMOJIS } from "@emoji/nostr/const";
import { pubkeyAtom, relaysAtom, userEmojiAtom } from "@emoji/user/state";
import { useProfile, pool, useEvents } from "@emoji/nostr/hooks";

export default function Header() {
  const router = useRouter();

  const [relays, setRelays] = useAtom(relaysAtom);
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);
  const [, setUserEmoji] = useAtom(userEmojiAtom);

  const { events } = useEvents(
    [
      {
        kinds: [USER_EMOJIS],
        authors: [pubkey],
        limit: 1,
      },
    ],
    relays,
    { closeOnEose: false }
  );

  useEffect(() => {
    if (events.length > 0) {
      setUserEmoji(events.at(0));
    }
  }, [events]);

  const profile = useProfile(pubkey);

  useEffect(() => {
    if (window.nostr && !pubkey) {
      window.nostr.getPublicKey().then(setPubkey);
    }
  }, [pubkey]);

  useEffect(() => {
    if (pubkey) {
      pool
        .get(relays, {
          kinds: [RELAYS],
          authors: [pubkey],
        })
        .then((ev) => {
          const relays = ev.tags
            .filter((t) => t.at(0) === "r")
            .map((t) => t.at(1));
          setRelays(relays);
        });
    }
  }, [pubkey]);

  async function goToProfile() {
    const url = `/p/${nip19.nprofileEncode({ pubkey, relays })}`;
    await router.push(url);
  }

  async function newList() {
    await router.push(`/new`);
  }

  async function newNote() {
    await router.push(`/note`);
  }

  return profile ? (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Flex align="center" gap={2}>
          <Avatar size="xs" name={profile.name} src={profile.picture} />
          <Text>{profile.name}</Text>
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem icon={<AtSignIcon />} onClick={goToProfile}>
          Profile
        </MenuItem>
        <MenuItem icon={<AddIcon />} onClick={newList}>
          New Emoji pack
        </MenuItem>
        <MenuItem icon={<EditIcon />} onClick={newNote}>
          New Post
        </MenuItem>
      </MenuList>
    </Menu>
  ) : null;
}

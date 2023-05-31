import { useMemo } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import {
  Flex,
  Stack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
  ExternalLinkIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { nip19 } from "nostr-tools";

import { USER_EMOJIS } from "@emoji/nostr/const";
import { pool } from "@emoji/nostr/hooks";
import { pubkeyAtom, relaysAtom, userEmojiAtom } from "@emoji/user/state";
import { getIdentifier, getAddress } from "@emoji/nostr/address";
import Zaps from "@emoji/components/Zaps";
import User from "@emoji/components/User";
import EmojiList from "@emoji/components/EmojiList";

function ListMenu({ naddr, event, isDetail }) {
  const router = useRouter();
  const [pubkey] = useAtom(pubkeyAtom);
  const [relays] = useAtom(relaysAtom);
  const [userEmoji] = useAtom(userEmojiAtom);
  const address = getAddress(event);

  const hasListAdded = userEmoji?.tags.find(
    (t) => t.at(0) === "a" && t.at(1) === address
  );
  const isMine = pubkey === event.pubkey;

  async function addToMyEmoji() {
    try {
      const userEmoji = await pool.get(relays, {
        kinds: [USER_EMOJIS],
        authors: [pubkey],
      });
      if (userEmoji) {
        const tags = userEmoji.tags.filter(
          (t) => t.at(0) === "a" && t.at(1) !== address
        );
        const ev = {
          kind: USER_EMOJIS,
          content: "",
          created_at: Math.floor(Date.now() / 1000),
          tags: [...tags, ["a", address]],
        };
        const signed = await window.nostr.signEvent(ev);
        pool.publish(relays, signed);
      } else {
        const ev = {
          kind: USER_EMOJIS,
          content: "",
          created_at: Math.floor(Date.now() / 1000),
          tags: [["a", getAddress(event)]],
        };
        const signed = await window.nostr.signEvent(ev);
        pool.publish(relays, signed);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function removeFromMyEmoji() {
    try {
      const userEmoji = await pool.get(relays, {
        kinds: [USER_EMOJIS],
        authors: [pubkey],
      });
      if (userEmoji) {
        const address = getAddress(event);
        const tags = userEmoji.tags.filter(
          (t) => t.at(0) === "a" && t.at(1) !== address
        );
        const ev = {
          kind: USER_EMOJIS,
          content: "",
          created_at: Math.floor(Date.now() / 1000),
          tags,
        };
        const signed = await window.nostr.signEvent(ev);
        pool.publish(relays, signed);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="unstyled"
      />
      <MenuList>
        {hasListAdded ? (
          <MenuItem icon={<DeleteIcon />} onClick={removeFromMyEmoji}>
            Remove from my emoji
          </MenuItem>
        ) : (
          <MenuItem icon={<AddIcon />} onClick={addToMyEmoji}>
            Add to my emoji
          </MenuItem>
        )}
        {isMine && (
          <MenuItem
            icon={<EditIcon />}
            onClick={() => router.push(`/a/${naddr}/edit`)}
          >
            Edit
          </MenuItem>
        )}
        {!isDetail && (
          <MenuItem
            icon={<ExternalLinkIcon />}
            onClick={() => router.push(`/a/${naddr}`)}
          >
            Open
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
}

export default function List({
  event,
  showMenu = true,
  isDetail = false,
  ...rest
}) {
  const identifier = getIdentifier(event);
  const emojis = event.tags.filter((t) => t.at(0) === "emoji");
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
    <Card {...rest}>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          {naddr ? (
            <Link href={`/a/${naddr}`}>
              <Heading fontSize="xl">{identifier}</Heading>
            </Link>
          ) : (
            <Heading>{identifier}</Heading>
          )}
          {showMenu && (
            <ListMenu naddr={naddr} event={event} isDetail={isDetail} />
          )}
        </Flex>
      </CardHeader>
      <CardBody>
        <EmojiList emojis={emojis} />
      </CardBody>
      <CardFooter>
        <Flex justifyContent="space-between" width="100%">
          {isDetail && <Zaps event={event} />}
          <User pubkey={event.pubkey} />
        </Flex>
      </CardFooter>
    </Card>
  );
}

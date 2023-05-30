"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "@webscopeio/react-textarea-autocomplete/style.css";

import { nip19 } from "nostr-tools";

import {
  Flex,
  Box,
  Stack,
  Heading,
  Text,
  Button,
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useAtom } from "jotai";

import Note from "@emoji/components/Note";
import { uniqByFn } from "@emoji/nostr/util";
import Emoji from "@emoji/components/Emoji";
import { USER_EMOJIS, EMOJIS } from "@emoji/nostr/const";
import { useUserEmojis } from "@emoji/components/UserEmojis";
import { pool, useEvents } from "@emoji/nostr/hooks";
import { pubkeyAtom, relaysAtom } from "@emoji/user/state";

function filterEmojis(tags: string[], token: string) {
  const results = tags
    .filter((t) => t.at(0) === "emoji")
    .map((t) => {
      const [, name, url] = t;
      return { name, url };
    })
    .filter(({ name, url }) => {
      return name.includes(token);
    });
  return uniqByFn(results, ({ name }) => name);
}

function EmojiItem({ name, url, ...rest }) {
  return (
    <Flex gap={2} {...rest} p={2}>
      <Emoji name={name} src={url} />
      <Text>{name}</Text>
    </Flex>
  );
}

export default function CreateNote({ event, showPreview = true }) {
  const router = useRouter();
  const [relays] = useAtom(relaysAtom);
  const [pubkey] = useAtom(pubkeyAtom);

  const [tags, setTags] = useState([]);
  const [content, setContent] = useState("");

  const { events } = useEvents(
    [{ kinds: [USER_EMOJIS, EMOJIS], authors: [pubkey] }],
    relays
  );
  const userEmojis = useUserEmojis(events.find((e) => e.kind === USER_EMOJIS));
  const emojis = useMemo(() => {
    let results = [];
    events.forEach((ev) => {
      const es = ev.tags.filter((t) => t.at(0) === "emoji");
      results = results.concat(es);
    });
    return results.concat(userEmojis);
  }, [events, userEmojis]);

  const ev = useMemo(() => {
    const event = {
      kind: 1,
      content,
      created_at: Math.floor(Date.now() / 1000),
      tags: emojis.filter((e) => content.includes(`:${e.at(1)}:`)),
    };
    if (pubkey) {
      event.pubkey = pubkey;
    }
    return event;
  }, [content]);

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  async function publishNote() {
    try {
      const signed = await window.nostr.signEvent(ev);
      pool.publish(relays, signed);
      const nevent = nip19.neventEncode({
        id: signed.id,
        author: signed.pubkey,
        relays,
      });
      await router.push(`/e/${nevent}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Flex justifyContent="center">
      <Flex flex={1} flexDirection="column" maxW="52rem">
        <Stack>
          <Heading>Write note</Heading>
          <ReactTextareaAutocomplete
            placeholder="What's on your mind?"
            loadingComponent={Spinner}
            onChange={(e) => setContent(e.target.value)}
            style={{
              border: "1px solid #EEE",
              borderRadius: "12px",
              width: "100%",
              fontSize: "18px",
              lineHeight: "20px",
              padding: 10,
            }}
            containerStyle={{
              zIndex: 9999,
              width: "100%",
            }}
            trigger={{
              ":": {
                dataProvider: (token) => {
                  return filterEmojis(emojis, token);
                },
                component: ({ entity }) => <EmojiItem {...entity} />,
                output: (item, trigger) => `:${item.name}:`,
              },
            }}
          />
        </Stack>
        <Button
          isDisabled={content.length === 0}
          colorScheme="orange"
          mt={4}
          onClick={publishNote}
        >
          Publish
        </Button>
        <Stack mt={4}>
          <Heading fontSize="xl">Preview</Heading>
          <Note event={ev} />
        </Stack>
      </Flex>
    </Flex>
  );
}

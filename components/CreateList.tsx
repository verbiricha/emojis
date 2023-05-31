"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { nip19 } from "nostr-tools";

import {
  Flex,
  Stack,
  Heading,
  Button,
  Input,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useAtom } from "jotai";

import List from "@emoji/components/List";
import Emoji from "@emoji/components/Emoji";
import { pool } from "@emoji/nostr/hooks";
import { EMOJIS } from "@emoji/nostr/const";
import { getIdentifier } from "@emoji/nostr/address";
import { pubkeyAtom, relaysAtom } from "@emoji/user/state";

// todo: edit
export default function CreateList({ event, showPreview = true }) {
  const router = useRouter();
  const [relays] = useAtom(relaysAtom);
  const [pubkey] = useAtom(pubkeyAtom);

  const [listName, setListName] = useState(
    event ? getIdentifier(event) ?? "" : ""
  );
  const [pairs, setPairs] = useState(
    event
      ? event.tags
          .filter((t) => t.at(0) === "emoji")
          .map((t) => {
            return { name: t.at(1), url: t.at(2) };
          })
      : []
  );

  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const [json, setJson] = useState("");

  useEffect(() => {
    if (json.length > 0) {
      try {
        const parsed = JSON.parse(json);
        if (parsed) {
          const newPairs = Object.entries(parsed).map(([name, url]) => {
            return {
              name,
              url,
            };
          });

          setPairs([...pairs, ...newPairs]);
        }
        setJson("");
      } catch (error) {
        console.error(error);
      }
    }
  }, [json]);

  const ev = useMemo(() => {
    const event = {
      kind: EMOJIS,
      content: "",
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ["d", listName],
        ...pairs.map(({ name, url }) => ["emoji", name, url]),
      ],
    };
    if (pubkey) {
      event.pubkey = pubkey;
    }
    return event;
  }, [listName, pairs]);

  const handleListNameChange = (event) => {
    setListName(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleURLChange = (event) => {
    setURL(event.target.value);
  };

  const handleSaveList = async () => {
    try {
      const signed = await window.nostr.signEvent(ev);
      pool.publish(relays, signed);
      const naddr = nip19.naddrEncode({
        kind: signed.kind,
        pubkey: signed.pubkey,
        identifier: listName,
      });
      await router.push(`/a/${naddr}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPair = () => {
    if (name && url) {
      const newPair = { name, url };
      setPairs([...pairs, newPair]);
      setName("");
      setURL("");
    }
  };

  return (
    <Flex justifyContent="center">
      <Flex flex={1} flexDirection="column" maxW="52rem">
        <Stack>
          <Heading>Create emoji pack</Heading>
          <Input
            placeholder="Pack name"
            value={listName}
            onChange={handleListNameChange}
          />
          <Stack align="center" direction="row">
            {url ? (
              <Emoji src={url} name={name} />
            ) : (
              <Tooltip label="Add a URL to see a preview">
                <QuestionOutlineIcon boxSize={6} color="gray" />
              </Tooltip>
            )}
            <Input
              maxW="20em"
              placeholder="Emoji name"
              value={name}
              onChange={handleNameChange}
            />
            <Input placeholder="URL" value={url} onChange={handleURLChange} />
          </Stack>
          <Textarea
            placeholder="JSON"
            value={json}
            onChange={(e) => setJson(e.target.value)}
          />
          <Button isDisabled={!name || !url} mt={4} onClick={handleAddPair}>
            Add Emoji
          </Button>
          <Button
            isDisabled={!listName || pairs.length === 0}
            colorScheme="orange"
            onClick={handleSaveList}
          >
            Save
          </Button>
        </Stack>
        <Stack mt={4}>
          <Heading fontSize="xl">Preview</Heading>
          <List event={ev} />
        </Stack>
      </Flex>
    </Flex>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { nip19 } from "nostr-tools";

import { Flex, Stack, Heading, Button, Input, Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { useAtom } from "jotai";

import List from "@emoji/components/List";
import Emoji from "@emoji/components/Emoji";
import { pool } from "@emoji/nostr/hooks";
import { EMOJIS } from "@emoji/nostr/const";
import { pubkeyAtom, relaysAtom } from "@emoji/user/state";

// todo: edit
export default function CreateList({ event, showPreview = true }) {
  const router = useRouter();
  const [relays, setRelays] = useAtom(relaysAtom);
  const [pubkey, setPubkey] = useAtom(pubkeyAtom);

  const [listName, setListName] = useState(
    event ? event.tags.find((t) => t.at(0) === "d")?.at(1) ?? "" : ""
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

  useEffect(() => {
    if (window.nostr && !pubkey) {
      window.nostr.getPublicKey().then(setPubkey);
    }
  }, [pubkey]);

  useEffect(() => {
    if (pubkey) {
      pool
        .get(relays, {
          kinds: [10002],
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
          <Heading>Create emoji list</Heading>
          <Input
            placeholder="List name"
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
              placeholder="Name"
              value={name}
              onChange={handleNameChange}
            />
            <Input placeholder="URL" value={url} onChange={handleURLChange} />
          </Stack>
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
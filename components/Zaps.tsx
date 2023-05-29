import { useMemo } from "react";

import { useDisclosure, Flex, Text, Button, Icon } from "@chakra-ui/react";
import { useAtom } from "jotai";

import { ZAP } from "@emoji/nostr/const";
import { useEvents } from "@emoji/nostr/hooks";
import { relaysAtom } from "@emoji/user/state";
import { getZapRequest, getZapAmount } from "@emoji/nostr/nip57";
import { formatShortNumber } from "@emoji/format";
import { getAddress } from "@emoji/nostr/address";
import ZapsModal from "@emoji/components/ZapModal";
import ZapIcon from "@emoji/icons/Zap";

export default function Zaps({ event }) {
  const [relays] = useAtom(relaysAtom);
  const filters = [
    {
      "#a": [getAddress(event)],
      kinds: [ZAP],
    },
  ];
  const { events, eose } = useEvents(filters, relays, { closeOnEose: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const zappers = useMemo(() => {
    return events
      .map((z) => {
        return { ...getZapRequest(z), amount: getZapAmount(z) };
      })
      .filter((z) => z.pubkey !== event.pubkey);
  }, [events]);
  const zapped = zappers.some((z) => z.pubkey === pubkey);
  const zapsTotal = useMemo(() => {
    return zappers.reduce((acc, { amount }) => {
      return acc + amount;
    }, 0);
  }, [zappers]);
  return (
    <>
      <Flex alignItems="center" color="gray" gap={3}>
        <Icon
          cursor="pointer"
          variant="unstyled"
          onClick={onOpen}
          boxSize={3}
          color={zapped ? "purple" : "gray"}
          as={ZapIcon}
        />
        <Text fontSize="sm">{formatShortNumber(zapsTotal)}</Text>
      </Flex>
      <ZapsModal event={event} isOpen={isOpen} onClose={onClose} />
    </>
  );
}

import { Card, CardHeader, CardBody } from "@chakra-ui/react";

import User from "@emoji/components/User";
import NoteText from "@emoji/components/Text";

export default function Note({ event }) {
  return (
    <Card>
      <CardHeader>
        {event.pubkey && <User size="sm" fontSize="md" pubkey={event.pubkey} />}
      </CardHeader>
      <CardBody pt={0} px={16}>
        <NoteText content={event.content} tags={event.tags} />
      </CardBody>
    </Card>
  );
}

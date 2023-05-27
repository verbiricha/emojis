import { nip19 } from "nostr-tools";
import NoteId from "@emoji/components/NoteId";

export default function NotePage({ params }) {
  const { nevent } = params;
  const decoded = nip19.decode(nevent);
  if (decoded.type === "nevent") {
    return <NoteId {...decoded.data} />;
  } else {
    return "TODO";
  }
}

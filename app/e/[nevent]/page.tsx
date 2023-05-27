import { nip19 } from "nostr-tools";

export default function NotePage({ params }) {
  const { nevent } = params;
  const decoded = nip19.decode(nevent);
  if (decoded.type === "nevent") {
    return <code>{JSON.stringify(decoded.data)}</code>;
  } else {
    return "TODO";
  }
}

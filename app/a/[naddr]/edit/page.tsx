import { nip19 } from "nostr-tools";
import { EMOJIS } from "@emoji/nostr/const";
import Edit from "@emoji/components/Edit";

export default function EmojisPage({ params }) {
  const { naddr } = params;
  const decoded = nip19.decode(naddr);
  if (decoded.type === "naddr" && decoded.data.kind === EMOJIS) {
    return <Edit {...decoded.data} />;
  } else {
    return "TODO";
  }
}

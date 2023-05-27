import { nip19 } from "nostr-tools";
import Profile from "@emoji/components/Profile";

export default function ProfilePage({ params }) {
  const { npub } = params;
  const decoded = nip19.decode(npub);
  if (decoded.type === "npub") {
    return <Profile pubkey={decoded.data} />;
  } else if (decoded.type === "nprofile") {
    return <Profile pubkey={decoded.data.pubkey} />;
  } else {
    return "TODO";
  }
}

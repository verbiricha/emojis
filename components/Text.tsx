import { Text } from "@chakra-ui/react";
import Emoji from "@emoji/components/Emoji";

function extractCustomEmoji(f, tags) {
  return f.split(/:(\w+):/g).map((i) => {
    const t = tags.find((a) => a[0] === "emoji" && a[1] === i);
    if (t) {
      return <Emoji display="inline" boxSize={5} src={t[2]} name={t[0]} />;
    } else {
      return i;
    }
  });
}

export default function RichText({ content, tags }) {
  return <Text fontSize="lg">{extractCustomEmoji(content, tags)}</Text>;
}

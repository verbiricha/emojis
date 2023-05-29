import { Flex } from "@chakra-ui/react";
import Emoji from "@emoji/components/Emoji";

export default function EmojiList({ emojis }) {
  return (
    <Flex gap={2} flexWrap="wrap">
      {emojis.map((t) => (
        <Emoji key={t[1]} src={t[2]} name={t[1]} />
      ))}
    </Flex>
  );
}

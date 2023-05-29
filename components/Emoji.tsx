"use client";

import { Tooltip, Image } from "@chakra-ui/react";

export default function Emoji({ name, src, ...rest }) {
  return (
    <Tooltip label={name}>
      <Image boxSize={6} alt={name} src={src} {...rest} />
    </Tooltip>
  );
}

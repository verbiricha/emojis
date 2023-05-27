"use client";

import { Image } from "@chakra-ui/react";

export default function Emoji({ name, src }) {
  return <Image boxSize={6} alt={name} src={src} />;
}

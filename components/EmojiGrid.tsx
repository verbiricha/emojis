"use client";

import { Grid } from "@chakra-ui/react";

export default function EmojiGrid({ children }) {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
      }}
      gap={4}
      maxW="52rem"
    >
      {children}
    </Grid>
  );
}

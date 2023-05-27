"use client";

import { Flex, Grid as BaseGrid, GridItem } from "@chakra-ui/react";

import Header from "./Header";
import Footer from "./Footer";

export default function Grid({ children }) {
  return (
    <BaseGrid templateRows="auto 1fr auto" minH="100vh">
      <GridItem name="header" p={4}>
        <Header />
      </GridItem>
      <GridItem name="main" p={4}>
        {children}
      </GridItem>
      <GridItem name="footer" p={4}>
        <Footer />
      </GridItem>
    </BaseGrid>
  );
}

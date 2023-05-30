import { atom } from "jotai";

export const pubkeyAtom = atom();
export const relaysAtom = atom(["wss://nos.lol", "wss://nostr.wine"]);
export const userEmojiAtom = atom();

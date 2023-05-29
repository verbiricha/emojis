import { useState, useEffect, useContext, useMemo } from "react";

import hash from "object-hash";
import { atom, useAtom } from "jotai";
import { SimplePool, utils } from "nostr-tools";

import { getAddress } from "@emoji/nostr/address";
import { uniqByFn } from "@emoji/nostr/util";

const defaultRelays = [
  "wss://purplepag.es",
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nos.lol",
  "wss://nostr.wine",
];
export const pool = new SimplePool({ getTimeout: 2000 });

export function useEvents(
  filters,
  relays = defaultRelays,
  options = { closeOnEose: true }
) {
  const { closeOnEose } = options;
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState([]);

  const subHash = useMemo(() => {
    return hash({ filters, relays, options });
  }, [filters, relays, options]);

  useEffect(() => {
    if (filters) {
      const sub = pool.sub(relays, filters);

      sub.on("event", (ev, relay) => {
        setEvents((evs) =>
          uniqByFn(utils.insertEventIntoDescendingList(evs, ev), getAddress)
        );
      });

      sub.on("eose", () => {
        setEose(true);
        if (closeOnEose) {
          sub.unsub();
        }
      });

      return () => {
        sub.unsub();
      };
    }
  }, [subHash]);

  return { eose, events };
}

// todo: local storage atom
const profilesAtom = atom({});

export function useProfile(pubkey) {
  const [profiles, setProfiles] = useAtom(profilesAtom);

  useEffect(() => {
    if (pubkey) {
      if (profiles[pubkey]) {
        return;
      }
      setProfiles((ps) => {
        return { ...ps, [pubkey]: { name: "", picture: "" } };
      });
      pool
        .get(defaultRelays, {
          kinds: [0],
          authors: [pubkey],
        })
        .then((ev) =>
          setProfiles((ps) => {
            return { ...ps, [pubkey]: JSON.parse(ev.content) };
          })
        );
    }
  }, [pubkey]);

  return profiles[pubkey];
}

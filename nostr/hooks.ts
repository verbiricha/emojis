import { useState, useEffect, useContext, useMemo } from "react";

import hash from "object-hash";
import { atom, useAtom } from "jotai";
import { SimplePool, utils } from "nostr-tools";

const defaultRelays = [
  "wss://purplepag.es",
  "wss://relay.damus.io",
  "wss://relay.snort.social",
  "wss://nos.lol",
  "wss://nostr.wine",
];
export const pool = new SimplePool();

export function useEvents(filters, relays = defaultRelays) {
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState([]);

  const subHash = useMemo(() => {
    return hash({ filters, relays });
  }, [filters, relays]);

  useEffect(() => {
    if (filters) {
      const sub = pool.sub(relays, filters);

      sub.on("event", (ev, relay) => {
        setEvents((evs) =>
          uniqByFn(
            utils.insertEventIntoDescendingList(evs, ev),
            (e) =>
              `${e.kind}:${e.pubkey}:${e.tags
                .find((t) => t.at(0) === "d")
                ?.at(1)}`
          )
        );
      });

      sub.on("eose", () => {
        setEose(true);
      });

      return () => {
        sub.unsub();
      };
    }
  }, [subHash]);

  return { eose, events };
}

const uniqByFn = <T>(arr: T[], keyFn: any): T[] => {
  return Object.values(
    arr.reduce((map, item) => {
      const key = keyFn(item);
      if (map[key]) {
        return {
          ...map,
          [key]: map[key].created_at > item.created_at ? map[key] : item,
        };
      }
      return {
        ...map,
        [key]: item,
      };
    }, {})
  );
};

const profilesAtom = atom({});

export function useProfile(pubkey) {
  const [profiles, setProfiles] = useAtom(profilesAtom);

  useEffect(() => {
    if (pubkey) {
      if (profiles[pubkey]) {
        return;
      }
      setProfiles((ps) => {
        return { ...ps, [pubkey]: {} };
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

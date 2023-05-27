import { useState, useEffect, useContext } from "react";

import { SimplePool, utils } from "nostr-tools";

const defaultRelays = ["wss://nos.lol"];
export const pool = new SimplePool();

export function useEvents(filters, relays = defaultRelays) {
  const [eose, setEose] = useState(false);
  const [events, setEvents] = useState([]);

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
  }, []);

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

// todo: cache
export function useProfile(pubkey) {
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (pubkey) {
      pool
        .get(["wss://purplepag.es"], {
          kinds: [0],
          authors: [pubkey],
        })
        .then((ev) => setProfile(JSON.parse(ev.content)));
    }
  }, [pubkey]);

  return profile;
}

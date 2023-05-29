function isParamReplaceable(event) {
  return event.kind >= 30000 || event.kind <= 40000;
}

export function getIdentifier(event) {
  return event.tags.find((t) => t.at(0) === "d")?.at(1);
}

export function getRefTag(event) {
  return isParamReplaceable(event)
    ? ["a", getAddress(event)]
    : ["e", getAddress(event)];
}

export function getFilter(event) {
  return isParamReplaceable(event)
    ? {
        kinds: [event.kind],
        authors: [event.pubkey],
        "#d": [getIdentifier(event)],
      }
    : {
        ids: [event.id],
        authors: [event.pubkey],
      };
}

export function getAddress(event) {
  return isParamReplaceable(event)
    ? `${event.kind}:${event.pubkey}:${getIdentifier(event)}`
    : event.id;
}

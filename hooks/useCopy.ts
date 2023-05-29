import { useState } from "react";

export default function useCopy(timeout = 2000) {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (typeof navigator === "undefined") {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), timeout);
  };

  return { copied, copy, setCopied };
}

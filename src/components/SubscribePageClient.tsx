// src/components/SubscribePageClient.tsx
"use client";

import { useState } from "react";
import SubscribeToggle from "./SubscribeToggle/SubscribeToggle";

type Props = {
  markdown: string;
};

export default function SubscribePageClient({ markdown }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mainSubscribeDiv">
      {/* Logo */}
      <img
        src="/logoBabyBlue.svg"
        alt=""
        style={{
          width: "50vw",
          marginLeft: "50vw",
          transform: `translateX(-50%) ${open ? "translateY(0px)" : "translateY(0px)"}`,
          transition: "transform 0.5s ease",
        }}
      />

      {/* Bottone + Subscribe box */}
      <SubscribeToggle markdown={markdown} />
    </div>
  );
}

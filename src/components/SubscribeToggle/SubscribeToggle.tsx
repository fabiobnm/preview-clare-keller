"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import NewsletterIndex from "@/components/NewsletterIndex/NewsletterIndex";

type Props = {
  markdown: string;
};

export default function SubscribeToggle({ markdown }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      {/* BOTTONE */}
      <div
        className="bottone"
        style={{
          maxHeight: open ? "0px" : "200px",
          opacity: open ? 0 : 1,
          overflow: "hidden",
          transition: "max-height 0.6s ease, opacity 0.4s ease",
          textAlign: "center",
        }}
      >
        <div style={{ padding: "20px 0" }}>
          Sign up for early access
          <br />
          <button className="submitFormSubsIndex"
            onClick={() => setOpen(true)}
           style={{width:'200px', marginTop:'45px'}}
          >
           {'Subscribe now \u2192'}
          </button>
        </div>
      </div>

      {/* SUBSCRIBE BOX */}
      <div
        className="subscribeBoxIndex"
        style={{
          maxHeight: open ? "600px" : "0px",
          opacity: open ? 1 : 0,
          overflow: "hidden",
          transition:
            "max-height 0.7s ease 0.15s, opacity 0.5s ease 0.15s",
        }}
      >
        <div style={{ padding: "20px 0" }}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
          <NewsletterIndex />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { JoinCard } from "@/components/join-card";

export default function Home() {
  const [name, setName] = useState<string>("");

  return (
    <div className="flex items-center justify-center h-screen">
      <JoinCard
        name={name}
        onNameChange={(v) => {
          setName(v);
        }}
        onSubmit={() => {
          console.log("Form submitted");
        }}
      />
      ¸
    </div>
  );
}

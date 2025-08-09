"use client";

import { useState } from "react";

interface SubscribeFormProps {
  onSuccess?: (email: string) => void;
}

export function SubscribeForm({ onSuccess }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setErr(null);

    try {
      const res = await fetch("/api/v1/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed;");

      setOk(true);
      setEmail("");
      
      if (onSuccess) {
        onSuccess(email);
      }
    } catch (e: any) {
      setErr(e.message || "Something went wrong;");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {ok && <p className="text-green-700 text-sm">Subscribed successfully;</p>}
      {err && <p className="text-red-700 text-sm">{err}</p>}
    </form>
  );
}

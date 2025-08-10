"use client";

import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useSubscribe } from "../hooks/useSubscribe";

interface SubscribeFormProps {
  onSuccess?: (email: string) => void;
}

export function SubscribeForm({ onSuccess }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const { mutate, isPending, error } = useSubscribe((email: string) => {
    setEmail("");
    if (onSuccess) {
      onSuccess(email);
    }
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ email });
  }

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          size="small"
          label="Email address"
          variant="outlined"
        />
        <Button
          type="submit"
          disabled={isPending}
          variant="contained"
          color="primary"
          sx={{ minWidth: '120px' }}
        >
          {isPending ? "Subscribing…" : "Subscribe"}
        </Button>
      </Box>
      {error && (
        <Typography color="error" variant="body2">
          {error.message}
        </Typography>
      )}
    </Box>
  );
}

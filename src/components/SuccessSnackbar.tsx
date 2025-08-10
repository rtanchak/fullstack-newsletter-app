"use client";

import { Snackbar, Alert } from "@mui/material";

interface SuccessSnackbarProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function SuccessSnackbar({ open, message, onClose }: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert 
        onClose={onClose} 
        severity="success" 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

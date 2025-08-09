"use client";

import { useState } from "react";
import { Modal, Box, Typography, IconButton, Button, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { SubscribeForm } from "./SubscriberForm";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  
  const handleSubscriptionSuccess = (email: string) => {
    setSubscribedEmail(email);
    setIsSuccess(true);
  };
  
  const handleClose = () => {
    // Reset state when modal is closed
    setTimeout(() => {
      setIsSuccess(false);
      setSubscribedEmail("");
    }, 300); // Small delay to avoid flashing content during animation
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="subscribe-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="subscribe-modal-title" variant="h6" component="h2">
            Subscribe to Newsletter
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {!isSuccess ? (
          <>
            <Typography variant="body2" mb={3} color="text.secondary">
              Stay updated with our latest posts and announcements.
            </Typography>
            <SubscribeForm onSuccess={handleSubscriptionSuccess} />
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Alert severity="success" sx={{ mb: 3 }}>
              Congratulations! You've successfully subscribed.
            </Alert>
            <Typography variant="body1" mb={3}>
              <strong>{subscribedEmail}</strong> has been added to our newsletter.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleClose}
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
}

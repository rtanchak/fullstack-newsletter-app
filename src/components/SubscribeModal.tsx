"use client";

import { useState } from "react";
import { Modal, Box, Typography, IconButton, Button, Alert } from "@mui/material";
import { Close as CloseIcon, CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import { SubscribeForm } from "./SubscriberForm";
import { useSubscribe } from "../hooks/useSubscribe";

interface SubscribeModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubscribeModal({ open, onClose }: SubscribeModalProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const { mutate } = useSubscribe((email) => {
    setSubscribedEmail(email);
    setIsSuccess(true);
  });
  
  const handleSubscriptionSuccess = (email: string) => {
    mutate({ email });
  };
  
  const handleClose = () => {
    setIsSuccess(false);
    setSubscribedEmail("");
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
          width: { xs: '90%', sm: 500, md: 600 },
          maxWidth: '90%',
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
              Congratulations! You have successfully subscribed.
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

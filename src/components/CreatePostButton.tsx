"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreatePostForm from "./CreatePostForm";

export default function CreatePostButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
        sx={{ ml: 'auto' }}
      >
        Create Post
      </Button>
      <CreatePostForm open={open} onClose={handleClose} />
    </>
  );
}

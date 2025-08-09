"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from "@mui/material";
import { PostStatus } from "@prisma/client";


interface CreatePostFormProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatePostForm({ open, onClose }: CreatePostFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<PostStatus>(PostStatus.DRAFT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const requestData = {
        title,
        content,
        status,
      };

      const response = await axios.post("/api/v1/posts", requestData);

      if (!response.data) {
        throw new Error("Failed to create post");
      }
      
      setSuccess(true);
      setTitle("");
      setContent("");
      setStatus(PostStatus.DRAFT);
      
      // Refresh the post list reactively if the refresh function exists
      if (window.refreshPostList && typeof window.refreshPostList === 'function') {
        // @ts-ignore
        window.refreshPostList();
      }
      
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Post</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Post created successfully!
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Content"
            fullWidth
            required
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              label="Status"
              disabled={loading}
            >
              <MenuItem value={PostStatus.DRAFT}>Draft</MenuItem>
              <MenuItem value={PostStatus.PUBLISHED}>Published</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !title || !content}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

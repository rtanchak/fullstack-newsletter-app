'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { PostStatus } from '@prisma/client';

import {
  Container,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Stack,
  useTheme
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import dayjs from 'dayjs';

export default function NewPostPage() {
  const router = useRouter();
  const theme = useTheme();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>(PostStatus.PUBLISHED);
  const [publishDate, setPublishDate] = React.useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, any> = { title, content, status };
      if (author) body.author = author;
      
      if (status === PostStatus.SCHEDULED) {
        if (!publishDate) {
          setError("Please select a publication date for scheduled posts");
          setLoading(false);
          return;
        }
        body.publishedAt = publishDate.toISOString();
      }

      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.status === 201) {
        const json = await res.json();
        const slug = json?.data?.slug as string | undefined;
        
        if (status === PostStatus.SCHEDULED) {
          router.push('/');
          return;
        }
        
        if (slug) router.push(`/posts/${slug}`);
        else router.push('/');
        return;
      }

      const json = await res.json().catch(() => null);
      setError(json?.error?.message ?? `Failed with status ${res.status}`);
    } catch (err: any) {
      setError(err?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Post
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Fill in the fields and submit to create a draft, schedule, or publish now.
            </Typography>
          </Box>

          <Box component="form" onSubmit={onSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
                fullWidth
              />
              
              <TextField
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                fullWidth
              />

              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your content…"
                required
                multiline
                rows={10}
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id="post-status-label">Status</InputLabel>
                <Select
                  labelId="post-status-label"
                  value={status}
                  label="Status"
                  onChange={(e) => setStatus(e.target.value as PostStatus)}
                >
                  <MenuItem value={PostStatus.PUBLISHED}>Ready to be published</MenuItem>
                  <MenuItem value={PostStatus.SCHEDULED}>Scheduled</MenuItem>
                </Select>
              </FormControl>

              {status === PostStatus.SCHEDULED && (
                <DateTimePicker
                  label="Publish Date and Time"
                  value={publishDate}
                  onChange={(newValue) => setPublishDate(newValue)}
                  format="DD.MM.YYYY HH:mm"
                  ampm={false}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      helperText: "Select when this post should be published"
                    },
                    actionBar: {
                      actions: ['clear', 'today', 'accept']
                    },
                    layout: {
                      sx: {
                        '& .MuiPickersLayout-contentWrapper': {
                          bgcolor: theme.palette.background.paper
                        },
                        '& .MuiPickersLayout-actionBar': {
                          bgcolor: theme.palette.background.paper
                        },
                        '& .MuiClock-clock': {
                          bgcolor: theme.palette.background.paper
                        },
                        '& .MuiClockNumber-root': {
                          color: theme.palette.text.primary
                        },
                        '& .MuiPickersDay-root': {
                          color: theme.palette.text.primary
                        }
                      }
                    }
                  }}
                />
              )}

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !title || !content || (status === PostStatus.SCHEDULED && !publishDate)}
                fullWidth
                size="large"
              >
                {loading ? 'Saving…' : 'Create Post'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}

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
  useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { createPost } from '@/lib/api/posts';
import { CreatePostPayload } from '@/lib/types/api';

export default function NewPostPage() {
  const router = useRouter();
  const theme = useTheme();

  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [status, setStatus] = React.useState<PostStatus>(PostStatus.PUBLISHED);
  const [publishDate, setPublishDate] = React.useState<dayjs.Dayjs | null>(null);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createPost,
    onSuccess: (json, variables) => {
      if (variables.status === PostStatus.SCHEDULED) {
        router.push('/');
        return;
      }
      const slug = json?.data?.slug;
      router.push(slug ? `/posts/${slug}` : '/');
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status === PostStatus.SCHEDULED && !publishDate) return;

    const payload: CreatePostPayload = {
      title,
      content,
      status,
      ...(author ? { author } : {}),
      ...(status === PostStatus.SCHEDULED && publishDate
        ? { publishedAt: publishDate.toISOString() }
        : {}),
    };

    mutate(payload);
  }

  const isInvalidScheduled = status === PostStatus.SCHEDULED && !publishDate;
  const canSubmit = !!title && !!content && !isInvalidScheduled && !isPending;

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
                  <MenuItem value={PostStatus.PUBLISHED}>Publish now</MenuItem>
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
                      error: isInvalidScheduled,
                      helperText: isInvalidScheduled
                        ? 'Please select a publication date for scheduled posts'
                        : 'Select when this post should be published',
                    },
                    actionBar: {
                      actions: ['clear', 'today', 'accept'],
                    },
                    layout: {
                      sx: {
                        '& .MuiPickersLayout-contentWrapper': {
                          bgcolor: theme.palette.background.paper,
                        },
                        '& .MuiPickersLayout-actionBar': {
                          bgcolor: theme.palette.background.paper,
                        },
                        '& .MuiClock-clock': {
                          bgcolor: theme.palette.background.paper,
                        },
                        '& .MuiClockNumber-root': {
                          color: theme.palette.text.primary,
                        },
                        '& .MuiPickersDay-root': {
                          color: theme.palette.text.primary,
                        },
                      },
                    },
                  }}
                />
              )}

              {isError && <Alert severity="error">{(error as Error)?.message}</Alert>}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!canSubmit || isPending}
                fullWidth
                size="large"
              >
                {isPending ? 'Saving…' : 'Create Post'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}

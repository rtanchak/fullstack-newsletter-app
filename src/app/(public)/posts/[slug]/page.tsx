import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getPublishedPost } from "@/modules/posts/posts.service";
import { Container, Typography, Paper, Box, Chip, Divider } from "@mui/material";
import { CalendarToday as CalendarIcon } from "@mui/icons-material";

type Props = { params: { slug: string } };

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);

  if (!post) notFound();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          color: "primary.main",
          mb: 3
        }}>
          {post.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Chip 
            icon={<CalendarIcon fontSize="small" />}
            label={post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : ""}
            variant="outlined"
            size="small"
            sx={{ borderRadius: 1 }}
          />
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ 
          typography: 'body1',
          whiteSpace: "pre-wrap", 
          lineHeight: 1.8,
          '& p': { mb: 2 },
          '& h2': { 
            mt: 4, 
            mb: 2, 
            fontWeight: 600,
            color: 'text.primary' 
          },
          '& h3': { 
            mt: 3, 
            mb: 2, 
            fontWeight: 500,
            color: 'text.primary' 
          },
          '& a': { 
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          },
          '& ul, & ol': {
            pl: 4,
            mb: 2
          },
          '& li': {
            mb: 1
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.light',
            pl: 2,
            py: 0.5,
            my: 2,
            fontStyle: 'italic',
            bgcolor: 'background.paper'
          },
          '& code': {
            fontFamily: 'monospace',
            bgcolor: 'grey.100',
            p: 0.5,
            borderRadius: 0.5
          }
        }}>
          {post.content}
        </Box>
      </Paper>
    </Container>
  )
}

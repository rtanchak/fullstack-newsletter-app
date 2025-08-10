import NextLink from "next/link";
import { getPublishedPosts } from "@/modules/posts/posts.service";
import {
  Container,
  Typography,
  Box,
  Paper,
  Link,
  ListItemText,
  List,
  ListItem,
} from "@mui/material";
import PostsPagination from "@/components/PostsPagination";
import { format } from "date-fns";
import { parsePaginationParams } from '@/lib/pagination';

export const revalidate = 60;

type Props = {
  searchParams?: Promise<{ page?: string | string[]; limit?: string | string[] }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const { page, limit } = parsePaginationParams(params);
  const { items, total } = await getPublishedPosts(page, limit);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Published Posts
        </Typography>

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No posts yet.
          </Typography>
        ) : (
          <List sx={{ p: 0 }}>
            {items.map((p) => (
              <ListItem
                key={p.id}
                divider
                sx={{
                  py: 1.5,
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <ListItemText
                  primary={
                    <Link
                      component={NextLink}
                      href={`/posts/${p.slug}`}
                      underline="hover"
                      color="primary"
                      sx={{ fontWeight: 400 }}
                    >
                      {p.title}
                    </Link>
                  }
                  sx={{ flex: "1 1 auto" }}
                />
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: "100px" }}>
                    by {p.author}
                  </Typography>
                  {p.publishedAt && (
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: "90px" }}>
                      {format(new Date(p.publishedAt), "MMM d, yyyy")}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
        <PostsPagination
          page={page}
          limit={limit}
          total={total}
        />
      </Paper>
    </Container>
  );
}

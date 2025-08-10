import NextLink from "next/link";
import { getPublishedPosts } from "@/modules/posts/posts.service";
import { Container, Typography, Box, Paper, Link, Button } from "@mui/material";
import PostsPagination from "@/components/PostsPagination";
import { format } from "date-fns";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export const revalidate = 60;

type Props = {
  searchParams?: Promise<{ page?: string | string[]; limit?: string | string[] }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const pageParam = Array.isArray(params?.page) ? params?.page[0] : params?.page;
  const limitParam = Array.isArray(params?.limit) ? params?.limit[0] : params?.limit;

  const parsedPage = Number(pageParam);
  const parsedLimit = Number(limitParam);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limitUnclamped = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_LIMIT;
  const limit = Math.min(MAX_LIMIT, limitUnclamped);

  const { items, total } = await getPublishedPosts(page, limit);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, pb: 1, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Published Posts
        </Typography>

        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No posts yet.
          </Typography>
        ) : (
          <Box component="ul" sx={{ listStyleType: "none", pl: 0, mt: 2, mb: 0 }}>
            {items.map((p) => (
              <Box
                component="li"
                key={p.id}
                sx={{
                  borderBottom: "1px solid #eaeaea",
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Link
                  component={NextLink}
                  href={`/posts/${p.slug}`}
                  underline="hover"
                  color="primary"
                  sx={{ fontWeight: 400, flex: "1 1 auto" }}
                >
                  {p.title}
                </Link>
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
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 1, mb: 0, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            component={NextLink}
            href={`/?page=${Math.max(1, page - 1)}&limit=${limit}`}
            variant="outlined"
            size="small"
            disabled={page <= 1}
            sx={{
              minWidth: "40px",
              px: 1,
              borderRadius: "4px",
              color: page <= 1 ? "text.disabled" : "primary.main",
            }}
          />
        </Box>
        <PostsPagination
            page={page}
            limit={limit}
            total={total}
          />
      </Paper>
    </Container>
  );
}

import NextLink from "next/link"
import { getPublishedPosts } from "@/modules/posts/posts.service"
import { Container, Typography, Box, Paper, Link, Button } from "@mui/material"
import { format } from "date-fns"

export const revalidate = 60

type Props = {
  searchParams?: Promise<{ page?: string; limit?: string }>
}

export default async function HomePage({ searchParams }: Props) {
  const resolvedParams = await searchParams || {}
  
  const pageParam = typeof resolvedParams.page === 'string' ? resolvedParams.page : '1'
  const limitParam = typeof resolvedParams.limit === 'string' ? resolvedParams.limit : '10'

  const page = Math.max(1, Number(pageParam))
  const limit = Math.min(50, Math.max(1, Number(limitParam)))

  const { items, total } = await getPublishedPosts(page, limit)
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 3, pb: 1, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Published Posts
        </Typography>
        
        <Box component="ul" sx={{ listStyleType: 'none', pl: 0, mt: 2, mb: 0 }}>
          {items.map((p) => (
            <Box 
              component="li" 
              key={p.id}
              sx={{ 
                borderBottom: '1px solid #eaeaea',
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Link 
                component={NextLink} 
                href={`/posts/${p.slug}`} 
                underline="hover"
                color="primary"
                sx={{ fontWeight: 400, flex: '1 1 auto' }}
              >
                {p.title}
              </Link>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: '100px' }}>
                  by Guest Author
                </Typography>
                {p.publishedAt && (
                  <Typography variant="caption" color="text.secondary" sx={{ minWidth: '90px' }}>
                    {format(new Date(p.publishedAt), 'MMM d, yyyy')}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
        
        <Box sx={{ mt: 1, mb: 0, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={NextLink}
            href={`/?page=${Math.max(1, page - 1)}&limit=${limit}`}
            variant="outlined"
            size="small"
            disabled={page <= 1}
            sx={{ 
              minWidth: '40px',
              px: 1,
              borderRadius: '4px',
              color: page <= 1 ? 'text.disabled' : 'primary.main'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>←</Typography>
          </Button>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            px: 2,
            minWidth: '60px',
            justifyContent: 'center'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {page} / {totalPages}
            </Typography>
          </Box>
          
          <Button
            component={NextLink}
            href={`/?page=${Math.min(totalPages, page + 1)}&limit=${limit}`}
            variant="outlined"
            size="small"
            disabled={page >= totalPages}
            sx={{ 
              minWidth: '40px',
              px: 1,
              borderRadius: '4px',
              color: page >= totalPages ? 'text.disabled' : 'primary.main'
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>→</Typography>
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

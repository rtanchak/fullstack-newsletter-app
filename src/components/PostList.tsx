"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Box, Typography, Link, Button, CircularProgress } from "@mui/material";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
}

interface PostListProps {
  initialPosts: Post[];
  initialTotal: number;
  initialPage: number;
  initialLimit: number;
}

export default function PostList({ 
  initialPosts, 
  initialTotal, 
  initialPage, 
  initialLimit 
}: PostListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/posts?page=${page}&limit=${limit}`);
      if (response.data) {
        setPosts(response.data.data);
        setTotal(response.data.meta.total);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to refresh posts (called after creating a new post)
  const refreshPosts = () => {
    fetchPosts();
  };
  
  // Expose the refresh function to the window object so it can be called from other components
  useEffect(() => {
    // @ts-ignore
    window.refreshPostList = refreshPosts;
    
    return () => {
      // @ts-ignore
      delete window.refreshPostList;
    };
  }, []);
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Update URL without full page reload
    router.push(`/?page=${newPage}&limit=${limit}`, { scroll: false });
  };
  
  // Refetch posts when page or limit changes
  useEffect(() => {
    fetchPosts();
  }, [page, limit]);
  
  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      <Box component="ul" sx={{ listStyleType: 'none', pl: 0, mt: 2, mb: 0, opacity: loading ? 0.6 : 1 }}>
        {posts.map((p) => (
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
          variant="outlined"
          size="small"
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page <= 1 || loading}
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
          variant="outlined"
          size="small"
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages || loading}
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
    </>
  );
}

"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { SubscribeModal } from "./SubscribeModal";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  
  const isOnNewPostPage = pathname === '/posts/new';
  
  const handleCreatePost = () => {
    if (isOnNewPostPage) {
      router.push('/');
    } else {
      router.push('/posts/new');
    }
  };
  
  const handleOpenSubscribeModal = () => {
    setSubscribeModalOpen(true);
  };
  
  const handleCloseSubscribeModal = () => {
    setSubscribeModalOpen(false);
  };
  return (
    <>
      <AppBar position="static" color="default" elevation={0} sx={{ 
        mb: 0, 
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
      }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            href="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 'bold'
            }}
          >
            fullstack-newsletter-app
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
              color="primary" 
              variant="outlined"
              onClick={handleCreatePost}
              sx={{ borderRadius: '4px', px: 3, minWidth: '120px' }}
            >
              {isOnNewPostPage ? 'Home' : 'Create Post'}
            </Button>
            <Button 
              color="success" 
              variant="contained"
              onClick={handleOpenSubscribeModal}
              sx={{ borderRadius: '4px', px: 3 }}
            >
              Subscribe
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        height: '8px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0))',
        mb: 3 
      }} />
      <SubscribeModal 
        open={subscribeModalOpen} 
        onClose={handleCloseSubscribeModal} 
      />
    </>
  );
}

"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// This must match the COOKIE_NAME in .env
const COOKIE_NAME = 'author.sid';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split(';');
      const hasAuthCookie = cookies.some(cookie => 
        cookie.trim().startsWith(`${COOKIE_NAME}=`));
      console.log('Auth check:', { cookies, hasAuthCookie, cookieName: COOKIE_NAME });
      setIsLoggedIn(hasAuthCookie);
    };
    
    // Check immediately on mount
    checkAuth();
    
    // Check every second to catch quick state changes
    const intervalId = setInterval(checkAuth, 1000);
    
    // Check when window gets focus (e.g., after redirect)
    window.addEventListener('focus', checkAuth);
    
    // Check when storage changes (for cross-tab synchronization)
    window.addEventListener('storage', checkAuth);
    
    // Force check after navigation
    const handleRouteChange = () => {
      setTimeout(checkAuth, 100);
    };
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  async function handleLogout() {
    try {
      const res = await fetch('/api/v1/author/logout', {
        method: 'POST',
      });
      
      if (res.ok) {
        // Force cookie check and state update
        setIsLoggedIn(false);
        
        // Trigger a localStorage event to notify other tabs
        window.localStorage.setItem('auth_state_change', Date.now().toString());
        
        // Redirect to home page
        router.push('/');
      } else {
        console.error('Logout failed with status:', res.status);
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
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
          <Box>
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="primary" 
                  variant="outlined"
                  component={Link}
                  href="/author/posts/new"
                  sx={{ borderRadius: '4px' }}
                >
                  New Post
                </Button>
                <Button 
                  color="secondary" 
                  variant="outlined"
                  onClick={handleLogout}
                  sx={{ borderRadius: '4px' }}
                >
                  Log out
                </Button>
              </Box>
            ) : (
              <Button 
                color="primary" 
                variant="outlined"
                component={Link}
                href="/login"
                sx={{ borderRadius: '4px', px: 3 }}
              >
                Log in
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ 
        height: '8px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.03), rgba(0,0,0,0))',
        mb: 3 
      }} />
    </>
  );
}

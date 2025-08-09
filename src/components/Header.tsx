"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Header() {
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
            <Button 
              color="primary" 
              variant="outlined"
              component={Link}
              href="/login"
              sx={{ borderRadius: '4px', px: 3 }}
            >
              Log in
            </Button>
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

import { PostStatus } from '@prisma/client';

export type CreatePostPayload = {
  title: string;
  content: string;
  author?: string;
  status: PostStatus;
  publishedAt?: string;
};

export type ApiSuccess = { 
  data?: { 
    slug?: string 
  } 
};

export type ApiErrorResponse = { 
  error?: { 
    message?: string 
  } 
};

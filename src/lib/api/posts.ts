import { PostStatus } from '@prisma/client';
import apiClient from './axios';

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

export async function createPost(payload: CreatePostPayload): Promise<ApiSuccess> {
  try {
    const response = await apiClient.post('/v1/posts', payload);
    if (response.status === 201) return response.data as ApiSuccess;
    return {};
  } catch (error) {
    const axiosError = error as { response?: { data?: ApiErrorResponse, status?: number } };
    const errorMessage = axiosError.response?.data?.error?.message ||
      `Failed to create post (status ${axiosError.response?.status || 'unknown'})`;
    throw new Error(errorMessage);
  }
}

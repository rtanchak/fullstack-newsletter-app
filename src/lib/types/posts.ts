export type PublishedPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PostSummary = {
  id: string;
  title: string;
  slug: string;
  publishedAt: string | null;
  author: string;
};

export type PostContent = {
  id: string;
  title: string;
  content: string;
  slug: string;
};

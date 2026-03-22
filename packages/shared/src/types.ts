// packages/shared/src/types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: "member" | "admin";
  createdAt: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  author: User;
  board: Board;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: User;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface PostConnection {
  edges: { node: Post; cursor: string }[];
  pageInfo: PageInfo;
}

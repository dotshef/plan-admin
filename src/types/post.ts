import { z } from 'zod';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const createPostSchema = z.object({
  title: z.string().min(1, '제목은 필수입니다').max(200, '제목은 최대 200자입니다'),
  content: z.string().min(1, '내용은 필수입니다'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = CreatePostInput;

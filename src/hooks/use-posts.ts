import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CreatePostInput, Post, UpdatePostInput } from '@/types/post';

const POSTS_KEY = ['posts'] as const;

export function usePosts() {
  return useQuery({
    queryKey: POSTS_KEY,
    queryFn: () => api.get<Post[]>('/posts'),
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePostInput) => api.post<Post>('/posts', input),
    onSuccess: () => qc.invalidateQueries({ queryKey: POSTS_KEY }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePostInput }) =>
      api.patch<Post>(`/posts/${id}`, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: POSTS_KEY }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/posts/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: POSTS_KEY }),
  });
}

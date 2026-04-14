import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostForm } from '@/components/post-form';
import { useCreatePost } from '@/hooks/use-posts';
import { ApiError } from '@/lib/api';
import type { CreatePostInput } from '@/types/post';

// Thin wrapper page — PRD structure lists this file. Redirects back to list after submit.
export function PostCreatePage() {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const [open, setOpen] = useState(true);

  const handleSubmit = async (input: CreatePostInput) => {
    try {
      await createPost.mutateAsync(input);
      toast.success('글이 생성되었습니다.');
      navigate('/posts');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : '생성에 실패했습니다.';
      toast.error(msg);
    }
  };

  const close = () => {
    setOpen(false);
    navigate('/posts');
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 글 작성</DialogTitle>
        </DialogHeader>
        <PostForm
          submitting={createPost.isPending}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}

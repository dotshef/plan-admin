import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostForm } from '@/components/post-form';
import { usePosts, useUpdatePost } from '@/hooks/use-posts';
import { ApiError } from '@/lib/api';
import type { CreatePostInput } from '@/types/post';

// Thin wrapper page — PRD structure lists this file. Looks up the post from the cached list.
export function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: posts } = usePosts();
  const updatePost = useUpdatePost();
  const [open, setOpen] = useState(true);

  const target = posts?.find((p) => p.id === id) ?? null;

  const handleSubmit = async (input: CreatePostInput) => {
    if (!id) return;
    try {
      await updatePost.mutateAsync({ id, input });
      toast.success('글이 수정되었습니다.');
      navigate('/posts');
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.status === 404
            ? '존재하지 않는 글입니다'
            : e.message
          : '수정에 실패했습니다.';
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
          <DialogTitle>글 수정</DialogTitle>
        </DialogHeader>
        <PostForm
          initial={target}
          submitting={updatePost.isPending}
          onSubmit={handleSubmit}
          onCancel={close}
        />
      </DialogContent>
    </Dialog>
  );
}

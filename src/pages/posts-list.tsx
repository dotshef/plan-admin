import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PostTable } from '@/components/post-table';
import { PostForm } from '@/components/post-form';
import { DeleteDialog } from '@/components/delete-dialog';
import { useCreatePost, useDeletePost, usePosts, useUpdatePost } from '@/hooks/use-posts';
import { ApiError } from '@/lib/api';
import type { CreatePostInput, Post } from '@/types/post';

export function PostsListPage() {
  const { data: posts, isLoading, isError, error } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Post | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const handleCreate = async (input: CreatePostInput) => {
    try {
      await createPost.mutateAsync(input);
      toast.success('글이 생성되었습니다.');
      setCreateOpen(false);
    } catch (e) {
      toast.error(apiMessage(e, '생성에 실패했습니다.'));
    }
  };

  const handleUpdate = async (input: CreatePostInput) => {
    if (!editTarget) return;
    try {
      await updatePost.mutateAsync({ id: editTarget.id, input });
      toast.success('글이 수정되었습니다.');
      setEditTarget(null);
    } catch (e) {
      toast.error(apiMessage(e, '수정에 실패했습니다.'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePost.mutateAsync(deleteTarget.id);
      toast.success('글이 삭제되었습니다.');
      setDeleteTarget(null);
    } catch (e) {
      toast.error(apiMessage(e, '삭제에 실패했습니다.'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? '불러오는 중…' : `총 ${posts?.length ?? 0}건`}
        </p>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          새 글 작성
        </Button>
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {apiMessage(error, '목록을 불러오지 못했습니다.')}
        </div>
      )}

      <PostTable
        posts={posts ?? []}
        onEdit={setEditTarget}
        onDelete={setDeleteTarget}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 글 작성</DialogTitle>
          </DialogHeader>
          <PostForm
            submitting={createPost.isPending}
            onSubmit={handleCreate}
            onCancel={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>글 수정</DialogTitle>
          </DialogHeader>
          <PostForm
            initial={editTarget}
            submitting={updatePost.isPending}
            onSubmit={handleUpdate}
            onCancel={() => setEditTarget(null)}
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        title={deleteTarget?.title}
        submitting={deletePost.isPending}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function apiMessage(e: unknown, fallback: string): string {
  if (e instanceof ApiError) {
    if (e.status === 404) return '존재하지 않는 글입니다';
    return e.message || fallback;
  }
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

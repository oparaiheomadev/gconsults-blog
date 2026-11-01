import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeletePost } from '@/hooks/usePosts';

// Same pattern as DeleteJobDialog on your website.
// post = the post to delete, or null when the dialog is closed.
export default function DeletePostDialog({ post, onClose }) {
  const deletePost = useDeletePost();

  if (!post) return null;

  function handleDelete() {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success('Post deleted');
        onClose();
      },
    });
  }

  return (
    <Dialog open={Boolean(post)} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            Delete this post?
          </DialogTitle>
          <DialogDescription>
            "{post.title}" will be removed immediately. This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {deletePost.isError && (
          <p className="text-sm text-destructive" role="alert">
            Could not delete. {deletePost.error?.message}
          </p>
        )}

        <div className="mt-2 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-full"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            variant="destructive"
            className="flex-1 rounded-full"
          >
            {deletePost.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { Link } from 'react-router';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Button } from '@/components/ui/button';

// "12 Nov 2026"
function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PostsTable({ posts, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border text-left text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">
              Category
            </th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">
              Updated
            </th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((post) => {
            const isPublished = post.status === 'published';
            return (
              <tr
                key={post.id}
                className="border-b border-border last:border-0"
              >
                <td className="max-w-xs truncate px-4 py-3 font-medium">
                  {post.title}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {post.category || '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      'rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                      (isPublished
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground')
                    }
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {formatDate(post.updated_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {/* eye: only for published posts, opens the live post in a new tab */}
                    {isPublished && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label="View post"
                        className={buttonVariants({
                          variant: 'ghost',
                          size: 'icon-sm',
                        })}
                      >
                        <Eye />
                      </a>
                    )}
                    {/* pencil: open the editor for this post */}
                    <Link
                      to={`/admin/posts/${post.id}`}
                      aria-label="Edit post"
                      className={buttonVariants({
                        variant: 'ghost',
                        size: 'icon-sm',
                      })}
                    >
                      <Pencil />
                    </Link>
                    {/* bin: ask the dashboard to delete (confirm dialog comes in 3c) */}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete post"
                      onClick={() => onDelete(post)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

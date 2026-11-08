import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useAdminPosts } from '@/hooks/usePosts';
import { PAGE_SIZE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusPills from '@/components/admin/StatusPills';
import PostsTable from '@/components/admin/PostsTable';
import Pagination from '@/components/admin/Pagination';
import DeletePostDialog from '@/components/admin/DeletePostDialog';

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. get ALL posts (same idea as useJobs on the website)
  const { data: allPosts = [], isLoading, isFetching, error } = useAdminPosts();

  // what the admin has chosen
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // 2. the numbers on the pills
  const counts = useMemo(
    () => ({
      all: allPosts.length,
      published: allPosts.filter((post) => post.status === 'published').length,
      draft: allPosts.filter((post) => post.status === 'draft').length,
    }),
    [allPosts],
  );

  // 3. keep only the posts that match the pill and the search
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return allPosts
      .filter((post) => status === 'all' || post.status === status)
      .filter((post) => !query || post.title.toLowerCase().includes(query));
  }, [allPosts, status, search]);

  // 4. cut out the 20 posts for this page
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const posts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // changing tab or search starts again from page 1
  function changeStatus(value) {
    setStatus(value);
    setPage(1);
  }
  function changeSearch(e) {
    setSearch(e.target.value);
    setPage(1);
  }
  const [postToDelete, setPostToDelete] = useState(null);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* title + New post */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Write, edit and publish blog posts.
          </p>
        </div>
        <Button
          onClick={() => navigate('/admin/posts/new')}
          className="rounded-full px-4"
        >
          <Plus />
          New post
        </Button>
      </div>

      {/* pills + search */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <StatusPills value={status} onChange={changeStatus} counts={counts} />
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={changeSearch}
            placeholder="Search titles…"
            aria-label="Search posts"
            className="bg-card pl-9"
          />
        </div>
      </div>

      {/* list */}
      <div className={'mt-6 ' + (isFetching ? 'opacity-70' : '')}>
        {isLoading && (
          <p className="py-10 text-center text-muted-foreground">
            Loading posts…
          </p>
        )}

        {error && (
          <p className="py-10 text-center text-destructive">{error.message}</p>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
            <p className="font-medium">
              {search.trim()
                ? `No posts match "${search}".`
                : 'No posts here yet.'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "New post" to write your first one.
            </p>
          </div>
        )}

        {posts.length > 0 && (
          <PostsTable posts={posts} onDelete={setPostToDelete} />
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
      <DeletePostDialog
        post={postToDelete}
        onClose={() => setPostToDelete(null)}
      />
    </div>
  );
}

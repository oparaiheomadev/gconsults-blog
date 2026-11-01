import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Search } from 'lucide-react';
import { useAdminPosts, usePostCounts } from '@/hooks/usePosts';
import { useDebounce } from '@/hooks/useDebounce';
import { PAGE_SIZE } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StatusPills from '@/components/admin/StatusPills';
import PostsTable from '@/components/admin/PostsTable';
import Pagination from '@/components/admin/Pagination';

export default function Dashboard() {
  const navigate = useNavigate();

  // what the admin has chosen
  const [status, setStatus] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  // only search after typing pauses
  const search = useDebounce(searchText, 400);

  const { data, isLoading, isFetching, error } = useAdminPosts({
    status,
    search,
    page,
  });
  const { data: counts } = usePostCounts();

  const posts = data?.posts ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  // changing tab or search starts again from page 1
  function changeStatus(value) {
    setStatus(value);
    setPage(1);
  }
  function changeSearch(e) {
    setSearchText(e.target.value);
    setPage(1);
  }

  // temporary: the confirm dialog arrives in step 3c
  function handleDelete(post) {
    console.log('delete clicked for', post.title);
  }

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
            value={searchText}
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
              {search ? `No posts match "${search}".` : 'No posts here yet.'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click "New post" to write your first one.
            </p>
          </div>
        )}

        {posts.length > 0 && (
          <PostsTable posts={posts} onDelete={handleDelete} />
        )}
      </div>

      <div className="mt-6">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PAGE_SIZE } from '@/lib/constants';

// Every admin posts query starts with this key,
// so one invalidate refreshes the list AND the counts.
const ADMIN_POSTS_KEY = ['admin-posts'];

// ---- Reading: one page of posts for the dashboard ----
// status: 'all' | 'published' | 'draft'
// search: text typed in the search box
// page:   1, 2, 3...
export function useAdminPosts({ status = 'all', search = '', page = 1 }) {
  return useQuery({
    queryKey: [...ADMIN_POSTS_KEY, 'list', { status, search, page }],
    queryFn: async () => {
      // page 1 = rows 0-19, page 2 = rows 20-39, ...
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('posts')
        .select('id, title, slug, category, status, published_at, updated_at', {
          count: 'exact', // also tell us the total number of matching posts
        })
        .order('updated_at', { ascending: false }) // last edited first
        .range(from, to);

      if (status !== 'all') query = query.eq('status', status);
      if (search.trim()) query = query.ilike('title', `%${search.trim()}%`);

      const { data, count, error } = await query;
      if (error) throw error;
      return { posts: data, total: count ?? 0 };
    },
    // keep showing the old page while the next one loads (no flicker)
    placeholderData: keepPreviousData,
  });
}

// ---- Reading: the numbers on the All / Published / Drafts pills ----
export function usePostCounts() {
  return useQuery({
    queryKey: [...ADMIN_POSTS_KEY, 'counts'],
    queryFn: async () => {
      // head: true = "just count them, don't send the rows"
      const countWhere = (status) => {
        let q = supabase
          .from('posts')
          .select('id', { count: 'exact', head: true });
        if (status) q = q.eq('status', status);
        return q;
      };

      const [all, published, draft] = await Promise.all([
        countWhere(null),
        countWhere('published'),
        countWhere('draft'),
      ]);

      const error = all.error || published.error || draft.error;
      if (error) throw error;

      return {
        all: all.count ?? 0,
        published: published.count ?? 0,
        draft: draft.count ?? 0,
      };
    },
  });
}

// ---- Writing: delete a post ----
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
    },
    // refresh the list and the counts
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY }),
  });
}

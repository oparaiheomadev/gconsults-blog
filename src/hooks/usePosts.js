import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

// Every admin posts query starts with this key,
// so one invalidate refreshes the list AND the single post.
const ADMIN_POSTS_KEY = ['admin-posts'];

// ---- Reading: ALL posts for the dashboard (same idea as useJobs) ----
// The dashboard filters, searches and cuts pages in the browser.
export function useAdminPosts() {
  return useQuery({
    queryKey: ADMIN_POSTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, category, status, published_at, updated_at')
        .order('updated_at', { ascending: false }); // last edited first

      if (error) throw error;
      return data;
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

// Supabase says "duplicate key" when a slug is already taken.
// Turn that into words the admin understands.
function friendlyError(error) {
  if (error.code === '23505') {
    return new Error(
      'Another post already uses this slug. Change the slug and try again.',
    );
  }
  return error;
}

// ---- Reading: one full post, for the editor ----
export function useAdminPost(id) {
  return useQuery({
    queryKey: [...ADMIN_POSTS_KEY, 'one', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single(); // exactly one row, not a list
      if (error) throw error;
      return data;
    },
    enabled: !!id, // on /admin/posts/new there is no id, so don't fetch
  });
}

// ---- Writing: create a new post ----
export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post) => {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select() // send the new row back (we need its id)
        .single();
      if (error) throw friendlyError(error);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY }),
  });
}

// ---- Writing: save changes to an existing post ----
// call it like: updatePost.mutate({ id, title, ... })
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...changes }) => {
      const { data, error } = await supabase
        .from('posts')
        .update(changes)
        .eq('id', id)
        .select()
        .single();
      if (error) throw friendlyError(error);
      return data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ADMIN_POSTS_KEY }),
  });
}

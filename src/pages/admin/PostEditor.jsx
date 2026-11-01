import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import DOMPurify from 'dompurify';
import { toast } from 'sonner';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { useAdminPost, useCreatePost, useUpdatePost } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { slugify } from '@/lib/slugify';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/admin/RichTextEditor';
import PostSettings from '@/components/admin/PostSettings';

// /admin/posts/new  -> empty editor
// /admin/posts/:id  -> load that post first, then show the editor
export default function PostEditor() {
  const { id } = useParams();
  const { data: post, isLoading, error } = useAdminPost(id);

  if (id && isLoading) {
    return <p className="p-10 text-muted-foreground">Loading post…</p>;
  }
  if (error) {
    return <p className="p-10 text-destructive">{error.message}</p>;
  }

  // "key" = start a fresh form when we move from one post to another
  return <EditorForm key={id ?? 'new'} post={post ?? null} />;
}

// "interviews, CV ,, graduates" -> ['interviews', 'cv', 'graduates']
function toTags(text) {
  return text
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

// true when the editor has no real words in it
function isEmptyHtml(html) {
  return !html.replace(/<[^>]*>/g, '').trim() && !html.includes('<img');
}

function EditorForm({ post }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const isNew = !post;
  const isPublished = post?.status === 'published';
  const saving = createPost.isPending || updatePost.isPending;

  // ---- the form, filled from the saved post (or empty for a new one) ----
  const [title, setTitle] = useState(post?.title ?? '');
  const [body, setBody] = useState({
    json: post?.content ?? null,
    html: post?.content_html ?? '',
  });
  const [form, setForm] = useState({
    category: post?.category ?? '',
    tagsText: (post?.tags ?? []).join(', '),
    excerpt: post?.excerpt ?? '',
    slug: post?.slug ?? '',
    cover_image_url: post?.cover_image_url ?? '',
    seo_title: post?.seo_title ?? '',
    seo_description: post?.seo_description ?? '',
  });
  // once the slug is typed by hand (or the post already exists),
  // stop changing it when the title changes
  const [slugTouched, setSlugTouched] = useState(!isNew);

  function updateField(field, value) {
    if (field === 'slug') setSlugTouched(true);
    setForm((old) => ({ ...old, [field]: value }));
  }

  function changeTitle(value) {
    setTitle(value);
    if (!slugTouched) setForm((old) => ({ ...old, slug: slugify(value) }));
  }

  // ---- save: status is 'draft' or 'published' ----
  async function save(status) {
    const publishing = status === 'published';

    // simple checks before we send anything
    if (!title.trim()) return toast.error('Give your post a title.');
    if (publishing && isEmptyHtml(body.html)) {
      return toast.error('Write something before publishing.');
    }
    if (publishing && !form.category) {
      return toast.error('Choose a category before publishing.');
    }

    const slug = slugify(form.slug || title);
    if (!slug) return toast.error('The slug needs letters or numbers.');

    // the row we save, in the same shape as the posts table
    const row = {
      title: title.trim(),
      slug,
      excerpt: form.excerpt.trim() || null,
      content: body.json,
      content_html: DOMPurify.sanitize(body.html), // strip anything unsafe
      cover_image_url: form.cover_image_url || null,
      category: form.category || null,
      tags: toTags(form.tagsText),
      author_name: user?.user_metadata?.full_name || 'GConsults',
      status,
      // keep the first publish date; set it now if this is the first publish
      published_at: publishing
        ? (post?.published_at ?? new Date().toISOString())
        : (post?.published_at ?? null),
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
    };

    try {
      if (isNew) {
        const created = await createPost.mutateAsync(row);
        toast.success(publishing ? 'Post published' : 'Draft saved');
        // move to the edit address, so the next save updates this post
        navigate(`/admin/posts/${created.id}`, { replace: true });
      } else {
        await updatePost.mutateAsync({ id: post.id, ...row });
        setForm((old) => ({ ...old, slug })); // show the cleaned slug
        toast.success(
          publishing
            ? isPublished
              ? 'Post updated'
              : 'Post published'
            : isPublished
              ? 'Post moved back to drafts'
              : 'Draft saved',
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <div>
      {/* top bar: back link, status, buttons. Stays on screen while you scroll */}
      <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All posts
            </Link>
            <span
              className={
                'rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                (isPublished
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground')
              }
            >
              {isNew ? 'New' : isPublished ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={saving}
              onClick={() => save('draft')}
            >
              {isPublished ? 'Unpublish' : 'Save draft'}
            </Button>
            <Button disabled={saving} onClick={() => save('published')}>
              {saving && <LoaderCircle className="animate-spin" />}
              {isPublished ? 'Update post' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* phone: one column. laptop: editor left, settings right */}
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <textarea
              value={title}
              onChange={(e) => changeTitle(e.target.value)}
              placeholder="Post title"
              aria-label="Post title"
              rows={1}
              className="field-sizing-content w-full resize-none bg-transparent font-serif text-4xl leading-tight outline-none placeholder:text-muted-foreground/60"
            />
            <RichTextEditor content={body.json} onChange={setBody} />
          </div>

          <PostSettings form={form} onChange={updateField} />
        </div>
      </div>
    </div>
  );
}

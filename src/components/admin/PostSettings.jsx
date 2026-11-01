import { CATEGORIES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CoverImageUpload from '@/components/admin/CoverImageUpload';

// One labelled box in the panel. "hint" = small grey text under it.
function Field({ label, htmlFor, hint, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// The settings panel next to the editor.
// form:     all the post's settings (see the list below)
// onChange: onChange('category', 'Hiring Tips') updates one setting
//
// form = { category, tagsText, excerpt, slug, cover_image_url,
//          seo_title, seo_description }
export default function PostSettings({ form, onChange }) {
  return (
    <div className="space-y-5 rounded-xl border border-border bg-card p-5">
      <Field label="Cover image">
        <CoverImageUpload
          value={form.cover_image_url}
          onChange={(url) => onChange('cover_image_url', url)}
        />
      </Field>

      <Field label="Category">
        <Select
          value={form.category || null}
          onValueChange={(value) => onChange('category', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Tags" htmlFor="tags" hint="Separate with commas.">
        <Input
          id="tags"
          value={form.tagsText}
          onChange={(e) => onChange('tagsText', e.target.value)}
          placeholder="interviews, cv, graduates"
        />
      </Field>

      <Field
        label="Summary"
        htmlFor="excerpt"
        hint={`${form.excerpt.length}/200 · shown on the blog home page`}
      >
        <Textarea
          id="excerpt"
          rows={3}
          maxLength={200}
          value={form.excerpt}
          onChange={(e) => onChange('excerpt', e.target.value)}
          placeholder="One or two sentences about this post."
        />
      </Field>

      <Field
        label="Slug"
        htmlFor="slug"
        hint={`/blog/${form.slug || 'your-post-title'}`}
      >
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="made from the title"
        />
      </Field>

      {/* SEO: hidden until clicked */}
      <details className="group rounded-lg border border-border">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-medium">
          <span className="mr-1 inline-block transition-transform group-open:rotate-90">
            ›
          </span>
          SEO (Google)
        </summary>
        <div className="space-y-4 border-t border-border p-3">
          <Field
            label="SEO title"
            htmlFor="seo_title"
            hint={`${form.seo_title.length}/60 · empty = use the post title`}
          >
            <Input
              id="seo_title"
              maxLength={60}
              value={form.seo_title}
              onChange={(e) => onChange('seo_title', e.target.value)}
            />
          </Field>
          <Field
            label="SEO description"
            htmlFor="seo_description"
            hint={`${form.seo_description.length}/160 · empty = use the summary`}
          >
            <Textarea
              id="seo_description"
              rows={3}
              maxLength={160}
              value={form.seo_description}
              onChange={(e) => onChange('seo_description', e.target.value)}
            />
          </Field>
        </div>
      </details>
    </div>
  );
}

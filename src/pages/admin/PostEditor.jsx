import { useState } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import PostSettings from '@/components/admin/PostSettings';

// TEMPORARY (step 4c): editor + settings panel side by side, nothing saved yet.
// Step 4d replaces this with the real editor page.
export default function PostEditor() {
  const [body, setBody] = useState({ json: null, html: '' });
  const [form, setForm] = useState({
    category: '',
    tagsText: '',
    excerpt: '',
    slug: '',
    cover_image_url: '',
    seo_title: '',
    seo_description: '',
  });

  // change one setting, keep the rest
  function updateField(field, value) {
    setForm((old) => ({ ...old, [field]: value }));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 font-serif text-3xl">Editor test</h1>

      {/* phone: one column. laptop: editor left, settings right */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <RichTextEditor content={null} onChange={setBody} />
        <PostSettings form={form} onChange={updateField} />
      </div>

      {/* shows what will be saved, so you can see it working */}
      <pre className="mt-6 max-h-60 overflow-auto rounded-lg bg-muted p-4 text-xs whitespace-pre-wrap">
        {JSON.stringify(form, null, 2)}
        {'\n\n'}
        {body.html || 'Type something in the editor…'}
      </pre>
    </div>
  );
}

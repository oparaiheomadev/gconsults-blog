import { useState } from 'react';
import RichTextEditor from '@/components/admin/RichTextEditor';

// TEMPORARY (step 4b): just the writing area, so you can try it.
// Step 4d replaces this with the real editor page.
export default function PostEditor() {
  const [body, setBody] = useState({ json: null, html: '' });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 font-serif text-3xl">Editor test</h1>

      <RichTextEditor content={null} onChange={setBody} />

      {/* shows the HTML that will be saved, so you can see it working */}
      <pre className="mt-6 max-h-60 overflow-auto rounded-lg bg-muted p-4 text-xs whitespace-pre-wrap">
        {body.html || 'Type something above…'}
      </pre>
    </div>
  );
}

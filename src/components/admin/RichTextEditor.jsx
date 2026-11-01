import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '@/components/admin/EditorToolbar';
import './editor.css';

// The writing area of the post editor.
// content:  the saved post body (TipTap JSON), or null for a new post
// onChange: called on every change with { json, html }
//           json = what we save and load back into the editor
//           html = what the public post page will show
export default function RichTextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] }, // the post title is the only H1
        link: { openOnClick: false }, // clicking a link while writing shouldn't open it
      }),
      Image,
      Placeholder.configure({ placeholder: 'Start writing your post…' }),
    ],
    content: content ?? '',
    editorProps: {
      attributes: {
        // "prose" = the typography plugin: nice headings, lists, quotes
        class:
          'prose prose-lg max-w-none min-h-[400px] px-6 py-5 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.({ json: editor.getJSON(), html: editor.getHTML() });
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

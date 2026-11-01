import { useRef, useState } from 'react';
import { useEditorState } from '@tiptap/react';
import { toast } from 'sonner';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImagePlus,
  Undo2,
  Redo2,
  LoaderCircle,
} from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { cn } from '@/lib/utils';

// One square icon button. "active" makes it green (e.g. bold is on).
function ToolButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      // keep the cursor in the text when a button is pressed
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4',
        active && 'bg-primary/10 text-primary',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" />;
}

export default function EditorToolbar({ editor }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Ask TipTap what is switched on where the cursor is.
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null; // editor not ready yet
      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        h2: editor.isActive('heading', { level: 2 }),
        h3: editor.isActive('heading', { level: 3 }),
        bullet: editor.isActive('bulletList'),
        ordered: editor.isActive('orderedList'),
        quote: editor.isActive('blockquote'),
        link: editor.isActive('link'),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      };
    },
  });

  if (!editor || !state) return null;

  // put the cursor back in the text, then do the thing
  const run = (fn) => fn(editor.chain().focus()).run();

  function handleLink() {
    if (state.link) return run((c) => c.unsetLink());
    const url = window.prompt('Paste the link (https://...)');
    if (url) run((c) => c.extendMarkRange('link').setLink({ href: url }));
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets you pick the same file again later
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'content');
      run((c) => c.setImage({ src: url, alt: file.name }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-border bg-card px-2 py-1.5">
      <ToolButton
        label="Bold"
        active={state.bold}
        onClick={() => run((c) => c.toggleBold())}
      >
        <Bold />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={state.italic}
        onClick={() => run((c) => c.toggleItalic())}
      >
        <Italic />
      </ToolButton>
      <ToolButton
        label="Underline"
        active={state.underline}
        onClick={() => run((c) => c.toggleUnderline())}
      >
        <Underline />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Heading"
        active={state.h2}
        onClick={() => run((c) => c.toggleHeading({ level: 2 }))}
      >
        <Heading2 />
      </ToolButton>
      <ToolButton
        label="Small heading"
        active={state.h3}
        onClick={() => run((c) => c.toggleHeading({ level: 3 }))}
      >
        <Heading3 />
      </ToolButton>
      <ToolButton
        label="Bullet list"
        active={state.bullet}
        onClick={() => run((c) => c.toggleBulletList())}
      >
        <List />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={state.ordered}
        onClick={() => run((c) => c.toggleOrderedList())}
      >
        <ListOrdered />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={state.quote}
        onClick={() => run((c) => c.toggleBlockquote())}
      >
        <Quote />
      </ToolButton>

      <Divider />

      <ToolButton
        label={state.link ? 'Remove link' : 'Add link'}
        active={state.link}
        onClick={handleLink}
      >
        <Link2 />
      </ToolButton>
      <ToolButton
        label="Add image"
        disabled={uploading}
        onClick={() => fileInput.current?.click()}
      >
        {uploading ? <LoaderCircle className="animate-spin" /> : <ImagePlus />}
      </ToolButton>
      {/* hidden file picker, opened by the image button */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="hidden"
      />

      <Divider />

      <ToolButton
        label="Undo"
        disabled={!state.canUndo}
        onClick={() => run((c) => c.undo())}
      >
        <Undo2 />
      </ToolButton>
      <ToolButton
        label="Redo"
        disabled={!state.canRedo}
        onClick={() => run((c) => c.redo())}
      >
        <Redo2 />
      </ToolButton>
    </div>
  );
}

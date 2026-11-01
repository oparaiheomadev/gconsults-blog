import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, LoaderCircle, Trash2 } from 'lucide-react';
import { uploadImage } from '@/lib/uploadImage';
import { Button } from '@/components/ui/button';

// The cover picture of a post.
// value:    the image link (or '' when there is none)
// onChange: called with the new link after upload, or '' after remove
export default function CoverImageUpload({ value, onChange }) {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ''; // lets you pick the same file again later
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, 'covers');
      onChange(url);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value ? (
        // a cover is chosen: show it, with Change and Remove buttons
        <div className="space-y-2">
          <img
            src={value}
            alt="Cover"
            className="aspect-video w-full rounded-lg border border-border object-cover"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
            >
              {uploading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <ImagePlus />
              )}
              Change
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange('')}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        // no cover yet: a big dashed box to click
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
          className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {uploading ? (
            <LoaderCircle className="size-6 animate-spin" />
          ) : (
            <ImagePlus className="size-6" />
          )}
          {uploading ? 'Uploading…' : 'Upload cover image'}
        </button>
      )}

      {/* hidden file picker */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

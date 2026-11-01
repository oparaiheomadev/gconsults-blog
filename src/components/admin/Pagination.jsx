import { Button } from '@/components/ui/button';

// Previous / Page X of Y / Next
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null; // one page only: no buttons needed

  return (
    <div className="flex items-center justify-center gap-3 text-sm">
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

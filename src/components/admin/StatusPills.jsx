// The All / Published / Drafts buttons with their numbers
const TABS = [
  { value: 'all', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Drafts' },
];

export default function StatusPills({ value, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ' +
              (active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground')
            }
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">
              {counts?.[tab.value] ?? '…'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

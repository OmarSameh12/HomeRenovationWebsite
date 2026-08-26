export function BeforeAfter({
  beforeImageUrl,
  afterImageUrl,
  title,
}: {
  beforeImageUrl: string;
  afterImageUrl: string;
  title?: string;
}) {
  const items = [
    { label: "Before", src: beforeImageUrl },
    { label: "After", src: afterImageUrl },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.label} className="overflow-hidden rounded-xl border border-border">
          <div className="aspect-[4/3] bg-muted">
            <img
              src={item.src}
              alt={`${item.label}${title ? ` — ${title}` : ""}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="bg-card px-4 py-2.5 text-sm font-medium">{item.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}

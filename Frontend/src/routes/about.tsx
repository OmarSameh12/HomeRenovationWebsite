import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Rashad & Co. Renovations" },
      {
        name: "description",
        content:
          "A small local renovation and interior design team focused on careful craftsmanship, honest quotes and reliable timelines.",
      },
      { property: "og:title", content: "About Us — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Meet the local renovation team behind our kitchens, bathrooms and refurbishments.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "12", label: "Years in business" },
  { value: "180+", label: "Homes renovated" },
  { value: "9", label: "In-house tradespeople" },
];

function AboutPage() {
  return (
    <>
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="About us"
              title="A small team that finishes what it starts"
              description="We are a local renovation and interior design practice. Every project is run by one lead who surveys your home, writes the quote and stays with you until the last coat of paint."
            />
            <p className="mt-5 max-w-lg text-muted-foreground">
              We keep our books deliberately short so each home gets proper attention. Most of our
              work comes from neighbours of previous clients — which is exactly how we like it.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-semibold text-primary sm:text-3xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
            <Button asChild className="mt-10">
              <Link to="/quote">Request a Quote</Link>
            </Button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80"
              alt="Renovation team reviewing plans on site"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </Section>

      <Section muted>
        <SectionHeading eyebrow="How we work" title="Four simple steps" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", "Site visit", "A free visit to measure up and understand what you want."],
            ["02", "Fixed quote", "An itemised written quote with a clear scope and timeline."],
            ["03", "Build", "One team on site, weekly updates, tidy at the end of each day."],
            ["04", "Handover", "Snagging list cleared, certificates issued, keys back to you."],
          ].map(([n, title, text]) => (
            <div key={n} className="rounded-xl border border-border bg-card p-6">
              <p className="font-display text-sm font-semibold text-primary">{n}</p>
              <h3 className="mt-2 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

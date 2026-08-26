import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/Section";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Rashad & Co. Renovations" },
      {
        name: "description",
        content:
          "Call, email or visit our local office to talk about your renovation or interior design project.",
      },
      { property: "og:title", content: "Contact — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Get in touch with our local renovation and interior design team.",
      },
    ],
  }),
  component: ContactPage,
});

const details = [
  { icon: Phone, label: "Phone", value: "01234 567 890" },
  { icon: Mail, label: "Email", value: "hello@rashadandco.example" },
  { icon: MapPin, label: "Office", value: "14 Maple Street, Northfield" },
  { icon: Clock, label: "Hours", value: "Mon–Fri 8:00–17:30, Sat 9:00–13:00" },
];

function ContactPage() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk about your home"
        description="Give us a call or drop us an email — or send your project details straight through the quote form."
      />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {details.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{label}</p>
              <p className="mt-1 break-words text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border bg-secondary/60 p-8 text-center">
        <h2 className="text-xl font-semibold">Prefer to send details online?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Use the quote form to include photos of the space.
        </p>
        <Button asChild className="mt-6">
          <Link to="/quote">Request a Quote</Link>
        </Button>
      </div>
    </Section>
  );
}

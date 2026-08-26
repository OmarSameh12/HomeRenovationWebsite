import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowRight, ShieldCheck, Clock, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { ProjectCard } from "@/components/ProjectCard";
import { BeforeAfter } from "@/components/BeforeAfter";
import { getFaqs, getProjects, getServices, getTestimonials } from "@/services/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rashad & Co. — Home Renovation & Interior Design" },
      {
        name: "description",
        content:
          "Local home renovation, interior design, kitchen and bathroom specialists. Fixed written quotes and careful craftsmanship.",
      },
      { property: "og:title", content: "Rashad & Co. — Home Renovation & Interior Design" },
      {
        property: "og:description",
        content: "Renovation and interior services with fixed quotes and honest timelines.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const services = useQuery({ queryKey: ["services"], queryFn: getServices });
  const projects = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const testimonials = useQuery({ queryKey: ["testimonials"], queryFn: getTestimonials });
  const faqs = useQuery({ queryKey: ["faqs"], queryFn: getFaqs });

  const featured = (projects.data ?? []).slice(0, 3);
  const showcase = projects.data?.[0];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Renovation &amp; interiors
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Homes rebuilt with care, finished with intent.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              We design and build renovations for local homeowners — kitchens, bathrooms and whole
              houses — with fixed written quotes and a single team from survey to snagging.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/quote">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/projects">View Our Projects</Link>
              </Button>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "Fixed written quotes" },
                { icon: Clock, label: "On-time completion" },
                { icon: Hammer, label: "In-house trades" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 shrink-0 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
              alt="Renovated open-plan living space with warm neutral finishes"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <Section>
        <SectionHeading
          eyebrow="What we do"
          title="Services built around your home"
          description="Four core services, delivered by the same team that surveys your property."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(services.data ?? []).slice(0, 4).map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </Section>

      {/* Featured projects */}
      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Recent work" title="Featured projects" />
          <Button asChild variant="ghost">
            <Link to="/projects">
              All projects <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      {/* Before & after */}
      {showcase ? (
        <Section>
          <SectionHeading
            eyebrow="Transformation"
            title="Before &amp; after"
            description={`${showcase.title} — ${showcase.location}`}
          />
          <div className="mt-10">
            <BeforeAfter
              beforeImageUrl={showcase.before_image_url}
              afterImageUrl={showcase.after_image_url}
              title={showcase.title}
            />
          </div>
        </Section>
      ) : null}

      {/* Testimonials */}
      <Section muted>
        <SectionHeading eyebrow="Clients" title="What homeowners say" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {(testimonials.data ?? []).map((t) => (
            <Card key={t.id} className="h-full">
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "fill-current" : "opacity-25"}`}
                    />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">“{t.text}”</p>
                <p className="text-sm font-semibold">{t.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeading eyebrow="Questions" title="Frequently asked" />
        <div className="mt-8 max-w-3xl">
          <Accordion type="single" collapsible>
            {(faqs.data ?? []).map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* Final CTA */}
      <section className="bg-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-background sm:text-3xl">
            Ready to start your renovation?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-background/70">
            Tell us about your project and we'll arrange a free on-site visit and a fixed written
            quote.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-7">
            <Link to="/quote">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

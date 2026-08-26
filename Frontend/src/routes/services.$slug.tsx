import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/Section";
import { getServiceBySlug } from "@/services/api";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const title = `${params.slug.replace(/-/g, " ")} — Rashad & Co.`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Details, benefits and process for our ${params.slug.replace(/-/g, " ")} service.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `Details, benefits and process for our ${params.slug.replace(/-/g, " ")} service.`,
        },
      ],
    };
  },
  component: ServiceDetails,
});

function ServiceDetails() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug(slug),
  });

  if (isLoading) {
    return (
      <Section>
        <Skeleton className="h-80 w-full rounded-xl" />
      </Section>
    );
  }

  if (!service) {
    return (
      <Section>
        <h1 className="text-2xl font-semibold">Service not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/services">Back to services</Link>
        </Button>
      </Section>
    );
  }

  return (
    <Section>
      <Link
        to="/services"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All services
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border">
        <img
          src={service.image_url}
          alt={service.name}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">{service.name}</h1>
          <p className="mt-4 text-muted-foreground">{service.description}</p>

          <h2 className="mt-10 text-xl font-semibold">What's included</h2>
          <ul className="mt-4 space-y-3">
            {(service.features ?? []).map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-secondary/60 p-6">
          <h2 className="text-lg font-semibold">Interested in this service?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Book a free on-site visit and receive a fixed written quote within 5 working days.
          </p>
          <Button asChild className="mt-5 w-full">
            <Link to="/quote">Request a Quote</Link>
          </Button>
        </aside>
      </div>
    </Section>
  );
}

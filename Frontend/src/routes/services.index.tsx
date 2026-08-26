import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/Section";
import { ServiceCard } from "@/components/ServiceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getServices } from "@/services/api";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Our Services — Rashad & Co. Renovations" },
      {
        name: "description",
        content:
          "Home renovation, interior design, kitchen remodeling and bathroom renovation services for local homeowners.",
      },
      { property: "og:title", content: "Our Services — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Renovation and interior design services delivered by one dedicated team.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["services"], queryFn: getServices });

  return (
    <Section>
      <SectionHeading
        eyebrow="Services"
        title="Everything we do, under one roof"
        description="Design, build and finish — coordinated by a single point of contact."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
          : (data ?? []).map((s) => <ServiceCard key={s.id} service={s} />)}
      </div>
    </Section>
  );
}

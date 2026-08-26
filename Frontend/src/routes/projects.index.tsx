import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Section, SectionHeading } from "@/components/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getProjects } from "@/services/api";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Our Projects — Rashad & Co. Renovations" },
      {
        name: "description",
        content:
          "A gallery of recent local renovation projects: kitchens, bathrooms, extensions and full-home refurbishments.",
      },
      { property: "og:title", content: "Our Projects — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Browse recent renovation and interior design projects with before and after photos.",
      },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  return (
    <Section>
      <SectionHeading
        eyebrow="Portfolio"
        title="Recent projects"
        description="Real rooms, real budgets — a selection of work completed across the local area."
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)
          : (data ?? []).filter((p) => p.is_featured).map((p) => <ProjectCard key={p.id} project={p} />)}
      </div>
    </Section>
  );
}

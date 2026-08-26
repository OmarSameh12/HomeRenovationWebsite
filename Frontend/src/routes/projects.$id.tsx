import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Section } from "@/components/Section";
import { BeforeAfter } from "@/components/BeforeAfter";
import { getProjectById } from "@/services/api";

export const Route = createFileRoute("/projects/$id")({
  head: () => ({
    meta: [
      { title: "Project — Rashad & Co. Renovations" },
      {
        name: "description",
        content: "Project details with location, scope and before and after photography.",
      },
      { property: "og:title", content: "Project — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Project details with location, scope and before and after photography.",
      },
    ],
  }),
  component: ProjectDetails,
});

function ProjectDetails() {
  const { id } = Route.useParams();
  const { data: project, isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectById(id),
  });

  if (isLoading) {
    return (
      <Section>
        <Skeleton className="h-80 w-full rounded-xl" />
      </Section>
    );
  }

  if (!project) {
    return (
      <Section>
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/projects">Back to projects</Link>
        </Button>
      </Section>
    );
  }

  return (
    <Section>
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">{project.title}</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-primary">
        <MapPin className="h-4 w-4 shrink-0" /> {project.location}
      </p>
      <p className="mt-5 max-w-3xl text-muted-foreground">{project.description}</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border">
        <img
          src={project.image_url}
          alt={project.title}
          className="aspect-[16/9] w-full object-cover"
        />
      </div>

      <h2 className="mt-14 text-xl font-semibold">Before &amp; after</h2>
      <div className="mt-6">
        <BeforeAfter
          beforeImageUrl={project.before_image_url}
          afterImageUrl={project.after_image_url}
          title={project.title}
        />
      </div>

      <div className="mt-14 rounded-2xl border border-border bg-secondary/60 p-8 text-center">
        <h2 className="text-xl font-semibold">Want something similar?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Share a few details and we'll come and take a look.
        </p>
        <Button asChild className="mt-6">
          <Link to="/quote">Request a Quote</Link>
        </Button>
      </div>
    </Section>
  );
}

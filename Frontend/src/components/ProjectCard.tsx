import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/services/api";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link to="/projects/$id" params={{ id: String(project.id) }} className="block">
      <Card className="group h-full overflow-hidden py-0 transition-shadow hover:shadow-lg">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-5">
          <h3 className="text-base font-semibold sm:text-lg">{project.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-primary">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {project.location}
          </p>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

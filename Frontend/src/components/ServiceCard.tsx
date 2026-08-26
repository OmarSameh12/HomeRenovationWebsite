import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Service } from "@/services/api";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Card className="group overflow-hidden py-0 transition-shadow hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={service.image_url}
          alt={service.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <CardContent className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold">{service.name}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{service.description}</p>
        <Button asChild variant="outline" size="sm" className="mt-1 w-fit">
          <Link to="/services/$slug" params={{ slug: service.slug }}>
            View Service
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

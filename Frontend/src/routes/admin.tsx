import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FolderKanban, Inbox, Trash2, Wrench } from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteProject,
  deleteService,
  getEnquiries,
  getProjects,
  getServices,
  type Enquiry,
} from "@/services/api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rashad & Co. Renovations" },
      {
        name: "description",
        content: "Manage the fictional services, projects and customer enquiries used in this demo.",
      },
      { property: "og:title", content: "Admin — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Manage the content and enquiries in the Rashad & Co. frontend demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});
const dateFormatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });

/** Format a backend ISO datetime string; returns "—" for missing/invalid values instead of throwing. */
function formatDate(value: string | null | undefined): string {
  const date = new Date(value ?? "");
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}


function AdminPage() {
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry>();
  const servicesQuery = useQuery({ queryKey: ["services"], queryFn: getServices });
  const projectsQuery = useQuery({ queryKey: ["projects"], queryFn: getProjects });
  const enquiriesQuery = useQuery({ queryKey: ["enquiries"], queryFn: getEnquiries });

  const removeService = useMutation({
    mutationFn: deleteService,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
  const removeProject = useMutation({
    mutationFn: deleteProject,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const isLoading = servicesQuery.isLoading || projectsQuery.isLoading || enquiriesQuery.isLoading;

  return (
    <Section>
      <SectionHeading
        eyebrow="Demo dashboard"
        title="Admin"
        description="Review enquiries and manage the mock content shown across the site. Changes reset when the page reloads."
      />

      {isLoading ? (
        <div className="mt-10 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <Tabs defaultValue="enquiries" className="mt-10">
          <TabsList className="grid h-auto w-full grid-cols-3 sm:w-fit">
            <TabsTrigger value="enquiries" className="gap-2">
              <Inbox className="h-4 w-4" />
              Enquiries
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Wrench className="h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              <FolderKanban className="h-4 w-4" />
              Projects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries" className="mt-6 rounded-lg border border-border bg-card p-3 sm:p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden sm:table-cell">Received</TableHead>
                  <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(enquiriesQuery.data ?? []).map((enquiry) => {
                  const serviceName = servicesQuery.data?.find(
                    (service) => service.id === enquiry.service_id,
                  )?.name;

                  return (
                    <TableRow key={enquiry.id}>
                      <TableCell className="font-medium">{enquiry.name}</TableCell>
                      <TableCell>{serviceName ?? "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">{enquiry.location || "—"}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {formatDate(enquiry.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View enquiry"
                          aria-label={`View enquiry from ${enquiry.name}`}
                          onClick={() => setSelectedEnquiry(enquiry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="services" className="mt-6 rounded-lg border border-border bg-card p-3 sm:p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(servicesQuery.data ?? []).map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell className="hidden max-w-xl truncate sm:table-cell">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete service"
                        aria-label={`Delete ${service.name}`}
                        disabled={removeService.isPending}
                        onClick={() => removeService.mutate(service.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="projects" className="mt-6 rounded-lg border border-border bg-card p-3 sm:p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(projectsQuery.data ?? []).map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell className="hidden sm:table-cell">{project.location}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete project"
                        aria-label={`Delete ${project.title}`}
                        disabled={removeProject.isPending}
                        onClick={() => removeProject.mutate(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={Boolean(selectedEnquiry)} onOpenChange={(open) => !open && setSelectedEnquiry(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEnquiry?.name}</DialogTitle>
            <DialogDescription>Service ID: {selectedEnquiry?.service_id ?? "—"}</DialogDescription>
          </DialogHeader>
          {selectedEnquiry ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Phone</dt><dd>{selectedEnquiry.phone}</dd></div>
              <div><dt className="text-muted-foreground">Email</dt><dd className="break-all">{selectedEnquiry.email || "—"}</dd></div>
              <div><dt className="text-muted-foreground">Property</dt><dd>{selectedEnquiry.property_type ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Location</dt><dd>{selectedEnquiry.location ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Status</dt><dd>{selectedEnquiry.status}</dd></div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Project description</dt>
                <dd className="mt-1 leading-6">{selectedEnquiry.description}</dd>
              </div>
              {(selectedEnquiry.reference_images ?? []).length > 0 ? (
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Reference images</dt>
                  <dd className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedEnquiry.reference_images.map((img) => (
                      <a
                        key={img.id}
                        href={img.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="overflow-hidden rounded-lg border border-border"
                        title={img.original_filename}
                      >
                        <img
                          src={img.file_url}
                          alt={img.original_filename}
                          className="aspect-square w-full object-cover"
                        />
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
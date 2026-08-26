import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, FolderKanban, Inbox, Pencil, Plus, Trash2, Wrench } from "lucide-react";
import { Section, SectionHeading } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createProject,
  createService,
  deleteProject,
  deleteService,
  getAdminServices,
  getEnquiries,
  getProjects,
  updateProject,
  updateService,
  type Enquiry,
  type ProjectResponse,
  type ServiceResponse,
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

type ServiceFormValues = Pick<
  ServiceResponse,
  "name" | "slug" | "description" | "image_url" | "is_active"
>;

type ProjectFormValues = Pick<
  ProjectResponse,
  | "title"
  | "description"
  | "location"
  | "image_url"
  | "before_image_url"
  | "after_image_url"
  | "is_featured"
>;

const EMPTY_SERVICE_FORM: ServiceFormValues = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
};

const EMPTY_PROJECT_FORM: ProjectFormValues = {
  title: "",
  description: "",
  location: "",
  image_url: "",
  before_image_url: "",
  after_image_url: "",
  is_featured: false,
};

function AdminPage() {
  const queryClient = useQueryClient();
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry>();
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceResponse>();
  const [serviceValues, setServiceValues] = useState<ServiceFormValues>(EMPTY_SERVICE_FORM);
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectResponse>();
  const [projectValues, setProjectValues] = useState<ProjectFormValues>(EMPTY_PROJECT_FORM);
  const servicesQuery = useQuery({ queryKey: ["services", "all"], queryFn: getAdminServices });
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
  const saveService = useMutation({
    mutationFn: async ({ id, values }: { id?: number; values: ServiceFormValues }) => {
      if (id === undefined) {
        await createService(values);
      } else {
        await updateService(id, values);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["services"] });
      setServiceFormOpen(false);
    },
  });
  const saveProject = useMutation({
    mutationFn: async ({ id, values }: { id?: number; values: ProjectFormValues }) => {
      if (id === undefined) {
        await createProject(values);
      } else {
        await updateProject(id, values);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      setProjectFormOpen(false);
    },
  });

  function openServiceDialog(service?: ServiceResponse) {
    setEditingService(service);
    setServiceValues(
      service
        ? {
            name: service.name,
            slug: service.slug,
            description: service.description,
            image_url: service.image_url,
            is_active: service.is_active,
          }
        : { ...EMPTY_SERVICE_FORM },
    );
    saveService.reset();
    setServiceFormOpen(true);
  }

  function openProjectDialog(project?: ProjectResponse) {
    setEditingProject(project);
    setProjectValues(
      project
        ? {
            title: project.title,
            description: project.description,
            location: project.location,
            image_url: project.image_url,
            before_image_url: project.before_image_url,
            after_image_url: project.after_image_url,
            is_featured: project.is_featured,
          }
        : { ...EMPTY_PROJECT_FORM },
    );
    saveProject.reset();
    setProjectFormOpen(true);
  }

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
            <div className="mb-4 flex justify-end">
              <Button size="sm" onClick={() => openServiceDialog()}>
                <Plus className="h-4 w-4" />
                Add service
              </Button>
            </div>
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
                    <TableCell className="font-medium">
                      {service.name}
                      {!service.is_active && (
                        <Badge variant="secondary" className="ml-2 align-middle font-normal">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden max-w-xl truncate sm:table-cell">
                      {service.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`Edit ${service.name}`}
                          aria-label={`Edit ${service.name}`}
                          onClick={() => openServiceDialog(service)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="projects" className="mt-6 rounded-lg border border-border bg-card p-3 sm:p-5">
            <div className="mb-4 flex justify-end">
              <Button size="sm" onClick={() => openProjectDialog()}>
                <Plus className="h-4 w-4" />
                Add project
              </Button>
            </div>
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
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={`Edit ${project.title}`}
                          aria-label={`Edit ${project.title}`}
                          onClick={() => openProjectDialog(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
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
                      </div>
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

      <Dialog open={serviceFormOpen} onOpenChange={setServiceFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? `Edit ${editingService.name}` : "Add service"}</DialogTitle>
            <DialogDescription>
              {editingService
                ? "Update the details of this service."
                : "Create a new service shown across the site."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveService.mutate(
                editingService
                  ? { id: editingService.id, values: serviceValues }
                  : { values: serviceValues },
              );
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="service-name">Name</Label>
              <Input
                id="service-name"
                required
                value={serviceValues.name}
                onChange={(event) => setServiceValues({ ...serviceValues, name: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-slug">Slug</Label>
              <Input
                id="service-slug"
                required
                value={serviceValues.slug}
                onChange={(event) => setServiceValues({ ...serviceValues, slug: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-description">Description</Label>
              <Textarea
                id="service-description"
                required
                rows={3}
                value={serviceValues.description}
                onChange={(event) =>
                  setServiceValues({ ...serviceValues, description: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="service-image-url">Image URL</Label>
              <Input
                id="service-image-url"
                required
                value={serviceValues.image_url}
                onChange={(event) =>
                  setServiceValues({ ...serviceValues, image_url: event.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="service-active">Active</Label>
                <p className="text-xs text-muted-foreground">Shown on the public services page.</p>
              </div>
              <Switch
                id="service-active"
                checked={serviceValues.is_active}
                onCheckedChange={(checked) => setServiceValues({ ...serviceValues, is_active: checked })}
              />
            </div>
            {saveService.isError ? (
              <p className="text-sm text-destructive">
                Failed to save the service. Please check the values and try again.
              </p>
            ) : null}
            <Button type="submit" disabled={saveService.isPending}>
              {saveService.isPending ? "Saving…" : editingService ? "Save changes" : "Add service"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={projectFormOpen} onOpenChange={setProjectFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? `Edit ${editingProject.title}` : "Add project"}</DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the details of this project."
                : "Create a new project shown in the portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveProject.mutate(
                editingProject
                  ? { id: editingProject.id, values: projectValues }
                  : { values: projectValues },
              );
            }}
          >
            <div className="grid gap-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                required
                value={projectValues.title}
                onChange={(event) => setProjectValues({ ...projectValues, title: event.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                required
                rows={3}
                value={projectValues.description}
                onChange={(event) =>
                  setProjectValues({ ...projectValues, description: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-location">Location</Label>
              <Input
                id="project-location"
                required
                value={projectValues.location}
                onChange={(event) =>
                  setProjectValues({ ...projectValues, location: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-image-url">Image URL</Label>
              <Input
                id="project-image-url"
                required
                value={projectValues.image_url}
                onChange={(event) =>
                  setProjectValues({ ...projectValues, image_url: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-before-image-url">Before image URL</Label>
              <Input
                id="project-before-image-url"
                required
                value={projectValues.before_image_url}
                onChange={(event) =>
                  setProjectValues({ ...projectValues, before_image_url: event.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-after-image-url">After image URL</Label>
              <Input
                id="project-after-image-url"
                required
                value={projectValues.after_image_url}
                onChange={(event) =>
                  setProjectValues({ ...projectValues, after_image_url: event.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="project-featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Highlighted on the home page.</p>
              </div>
              <Switch
                id="project-featured"
                checked={projectValues.is_featured}
                onCheckedChange={(checked) =>
                  setProjectValues({ ...projectValues, is_featured: checked })
                }
              />
            </div>
            {saveProject.isError ? (
              <p className="text-sm text-destructive">
                Failed to save the project. Please check the values and try again.
              </p>
            ) : null}
            <Button type="submit" disabled={saveProject.isPending}>
              {saveProject.isPending ? "Saving…" : editingProject ? "Save changes" : "Add project"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
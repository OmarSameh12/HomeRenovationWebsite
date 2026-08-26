import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Section, SectionHeading } from "@/components/Section";
import { createEnquiry, getServices, uploadEnquiryImages } from "@/services/api";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Request a Quote — Rashad & Co. Renovations" },
      {
        name: "description",
        content:
          "Tell us about your renovation project and receive a free on-site visit and a fixed written quote.",
      },
      { property: "og:title", content: "Request a Quote — Rashad & Co. Renovations" },
      {
        property: "og:description",
        content: "Send your project details and reference photos for a free fixed quote.",
      },
    ],
  }),
  component: QuotePage,
});

const propertyTypes = ["Apartment", "Terraced", "Semi-detached", "Detached", "Bungalow", "Other"];

interface Preview {
  name: string;
  url: string;
  file: File;
}

function QuotePage() {
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: getServices });
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [service, setService] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  function addFiles(files: FileList | null) {
    if (!files) return;
    setPreviews((prev) => [
      ...prev,
      ...Array.from(files).map((f) => ({ name: f.name, url: URL.createObjectURL(f), file: f })),
    ]);
  }

  function removeFile(url: string) {
    setPreviews((prev) => prev.filter((p) => p.url !== url));
    URL.revokeObjectURL(url);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!service || !propertyType) {
      setError("Please select a service and property type.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const enquiry = await createEnquiry({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? "") || null,
        service_id: parseInt(service, 10),
        property_type: propertyType,
        location: String(form.get("location") ?? "") || null,
        description: String(form.get("description") ?? ""),
      });

      if (previews.length > 0) {
        await uploadEnquiryImages(
          enquiry.id,
          previews.map((p) => p.file),
        );
      }

      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <Section>
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-5 text-2xl font-semibold">Enquiry received</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Thank you — your request has been submitted. A member of our team will call you within
            one working day to arrange a free on-site visit.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <Link to="/projects">View our projects</Link>
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Submit another enquiry
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading
        eyebrow="Get started"
        title="Request a quote"
        description="Share a few details about your project. Fields marked * are required."
      />

      <form
        onSubmit={handleSubmit}
        className="mt-10 max-w-3xl space-y-6 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" name="phone" required placeholder="07700 900000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Northfield" />
          </div>
          <div className="space-y-2">
            <Label>Service *</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {(services ?? []).map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Property Type *</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            name="description"
            required
            rows={5}
            placeholder="Tell us about the rooms, the scope and any timings you have in mind."
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="images">Reference Images</Label>
          <label
            htmlFor="images"
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <Upload className="h-5 w-5 shrink-0" />
            Click to select images (you can choose several)
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {previews.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {previews.map((p) => (
                <li key={p.url} className="relative overflow-hidden rounded-lg border border-border">
                  <img src={p.url} alt={p.name} className="aspect-square w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(p.url)}
                    aria-label={`Remove ${p.name}`}
                    className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-foreground/70 text-background transition-opacity hover:opacity-80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : "Submit Enquiry"}
        </Button>
      </form>
    </Section>
  );
}

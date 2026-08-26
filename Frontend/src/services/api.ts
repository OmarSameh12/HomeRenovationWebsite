/**
 * Data layer that calls the FastAPI backend for all entities.
 * Every function is async for consistency.
 */
import { type FAQ, type Testimonial } from "./mockData";

/** Backend Project response shape (snake_case) */
export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  image_url: string;
  before_image_url: string;
  after_image_url: string;
  is_featured: boolean;
}

/** Backend Service response shape (snake_case) */
export interface ServiceResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
}

export type ServiceInput = Omit<ServiceResponse, "id">;

const API_BASE_URL = "https://home-renovation-website-beta.vercel.app";

/* Services - Real Backend */
export async function getServices(): Promise<ServiceResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/services`);
  if (!response.ok) {
    throw new Error(`Failed to fetch services: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Admin listing: every service, including inactive ones. */
export async function getAdminServices(): Promise<ServiceResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services`);
  if (!response.ok) {
    throw new Error(`Failed to fetch admin services: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getServiceBySlug(slug: string): Promise<ServiceResponse | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/services/${slug}`);
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch service: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function createService(data: ServiceInput): Promise<ServiceResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create service: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function updateService(id: number, data: Partial<ServiceInput>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update service: ${response.status} ${response.statusText}`);
  }
}

export async function deleteService(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/services/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete service: ${response.status} ${response.statusText}`);
  }
}

/* Projects - Real Backend */
export async function getProjects(): Promise<ProjectResponse[]> {
  const response = await fetch(`${API_BASE_URL}/api/projects`);
  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getProjectById(id: string): Promise<ProjectResponse | undefined> {
  const response = await fetch(`${API_BASE_URL}/api/projects/${id}`);
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export type ProjectInput = Omit<ProjectResponse, "id">;

export async function createProject(data: ProjectInput): Promise<ProjectResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function updateProject(id: number, data: Partial<ProjectInput>): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.status} ${response.statusText}`);
  }
}

export async function deleteProject(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/admin/projects/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete project: ${response.status} ${response.statusText}`);
  }
}

/* Content - Real Backend */
export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await fetch(`${API_BASE_URL}/api/testimonials`);
  if (!response.ok) {
    throw new Error(`Failed to fetch testimonials: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/* FAQs - Real Backend */
export async function getFaqs(): Promise<FAQ[]> {
  const response = await fetch(`${API_BASE_URL}/api/faqs`);
  if (!response.ok) {
    throw new Error(`Failed to fetch FAQs: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/* Enquiries - Real Backend */
export async function getEnquiries(): Promise<Enquiry[]> {
  const response = await fetch(`${API_BASE_URL}/api/admin/enquiries`);
  if (!response.ok) {
    throw new Error(`Failed to fetch enquiries: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/** Backend Enquiry response shape (snake_case) */
export interface EnquiryResponse {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service_id: number | null;
  property_type: string | null;
  location: string | null;
  description: string;
  status: string;
  created_at: string;
  reference_images: EnquiryImage[];
}

export type EnquiryInput = Omit<EnquiryResponse, "id" | "created_at" | "status" | "reference_images">;

export async function createEnquiry(data: EnquiryInput): Promise<EnquiryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create enquiry: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export interface EnquiryImage {
  id: number;
  file_url: string;
  original_filename: string;
}

/** Upload reference images for an existing enquiry. */
export async function uploadEnquiryImages(
  enquiryId: number,
  files: File[],
): Promise<EnquiryImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}/api/enquiries/${enquiryId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Failed to upload images: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export type { ServiceResponse as Service, Testimonial, FAQ };
export type { EnquiryResponse as Enquiry };
export type { ProjectResponse as Project };
export type { ServiceInput, ProjectInput };

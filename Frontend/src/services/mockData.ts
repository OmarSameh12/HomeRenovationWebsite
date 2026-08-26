export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  features?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  beforeImageUrl: string;
  afterImageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  propertyType: string;
  location: string;
  description: string;
  referenceImages: string[];
  createdAt: string;
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const services: Service[] = [
  {
    id: "1",
    name: "Home Renovation",
    slug: "home-renovation",
    description:
      "Full-home refurbishment from structural updates to final finishes, managed end to end by one dedicated team.",
    imageUrl: img("photo-1600585154340-be6161a56a0c"),
    features: [
      "Free on-site consultation and survey",
      "Fixed written scope before work begins",
      "Structural, electrical and plumbing coordination",
      "Weekly progress updates",
    ],
  },
  {
    id: "2",
    name: "Interior Design",
    slug: "interior-design",
    description:
      "Considered layouts, materials and lighting schemes that make everyday rooms feel calm, warm and well made.",
    imageUrl: img("photo-1618221195710-dd6b41faaea6"),
    features: [
      "Mood boards and material samples",
      "Space planning and 2D layouts",
      "Lighting and colour scheme",
      "Furniture and finish sourcing",
    ],
  },
  {
    id: "3",
    name: "Kitchen Remodeling",
    slug: "kitchen-remodeling",
    description:
      "Practical, hard-wearing kitchens built around how you actually cook, with cabinetry made to fit the room.",
    imageUrl: img("photo-1556909212-d5b604d0c90d"),
    features: [
      "Bespoke cabinetry and worktops",
      "Appliance and utilities planning",
      "Tiling, splashbacks and flooring",
      "Typically completed in 3-5 weeks",
    ],
  },
  {
    id: "4",
    name: "Bathroom Renovation",
    slug: "bathroom-renovation",
    description:
      "Watertight, beautifully finished bathrooms — from compact en-suites to family wet rooms.",
    imageUrl: img("photo-1620626011761-996317b8d101"),
    features: [
      "Full tanking and waterproofing",
      "Underfloor heating options",
      "Stone, porcelain and micro-cement finishes",
      "Certified plumbing and electrics",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Victorian Terrace Full Refurbishment",
    description:
      "A tired three-bedroom terrace stripped back and rebuilt with an open-plan kitchen, restored cornicing and a new rear extension.",
    location: "Maple Street, Northfield",
    imageUrl: img("photo-1600596542815-ffad4c1539a9"),
    beforeImageUrl: img("photo-1503174971373-b1f69850bded", 900),
    afterImageUrl: img("photo-1600607687939-ce8a6c25118c", 900),
  },
  {
    id: "2",
    title: "Warm Minimal Kitchen",
    description:
      "Hand-painted cabinetry, honed stone worktops and concealed appliances in a compact semi-detached home.",
    location: "Oakwood Rise",
    imageUrl: img("photo-1556911220-bff31c812dba"),
    beforeImageUrl: img("photo-1484154218962-a197022b5858", 900),
    afterImageUrl: img("photo-1600489000022-c2086d79f9d4", 900),
  },
  {
    id: "3",
    title: "Family Bathroom & En-Suite",
    description:
      "Two bathrooms reconfigured for a growing family, with underfloor heating and large-format porcelain tiling.",
    location: "Church Lane, Westgate",
    imageUrl: img("photo-1552321554-5fefe8c9ef14"),
    beforeImageUrl: img("photo-1584622650111-993a426fbf0a", 900),
    afterImageUrl: img("photo-1600607687920-4e2a09cf159d", 900),
  },
  {
    id: "4",
    title: "Living Room Redesign",
    description:
      "A layered lighting scheme, bespoke joinery and a muted palette turned a dark front room into the heart of the house.",
    location: "Harbour View",
    imageUrl: img("photo-1567767292278-a4f21aa2d36e"),
    beforeImageUrl: img("photo-1493809842364-78817add7ffb", 900),
    afterImageUrl: img("photo-1616486338812-3dadae4b4ace", 900),
  },
  {
    id: "5",
    title: "Loft Conversion Studio",
    description:
      "An unused loft converted into a bright home office and guest room with dormer windows and built-in storage.",
    location: "Elm Grove",
    imageUrl: img("photo-1522708323590-d24dbb6b0267"),
    beforeImageUrl: img("photo-1505873242700-f289a29e1e0f", 900),
    afterImageUrl: img("photo-1598928506311-c55ded91a20c", 900),
  },
  {
    id: "6",
    title: "Garden Room Extension",
    description:
      "A single-storey rear extension with full-height glazing connecting the kitchen to a newly landscaped garden.",
    location: "Bramble Close",
    imageUrl: img("photo-1600566753086-00f18fb6b3ea"),
    beforeImageUrl: img("photo-1560448204-e02f11c3d0e2", 900),
    afterImageUrl: img("photo-1600210492486-724fe5c67fb0", 900),
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Hannah Bell",
    text: "They handled our whole ground floor without a single missed deadline. The finish is better than anything we saw in the showrooms.",
    rating: 5,
  },
  {
    id: "2",
    name: "Marcus Whitfield",
    text: "Clear quote, no surprises, and the site was spotless every evening. Our kitchen is genuinely a joy to use now.",
    rating: 5,
  },
  {
    id: "3",
    name: "Priya Raman",
    text: "The design team listened properly. Small house, tricky layout — and they made it feel twice the size.",
    rating: 4,
  },
];

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How long does a typical renovation take?",
    answer:
      "A single room such as a bathroom usually takes 2-4 weeks. Kitchens run 3-5 weeks, and a full-home refurbishment is normally 3-6 months depending on structural work.",
  },
  {
    id: "2",
    question: "Do you provide a fixed quote?",
    answer:
      "Yes. After a free on-site visit we issue a written, itemised quote. The price only changes if you request additional work in writing.",
  },
  {
    id: "3",
    question: "Can I live at home during the works?",
    answer:
      "For single-room projects, usually yes. For full refurbishments we normally recommend moving out during the first-fix stage and we will tell you honestly at survey.",
  },
  {
    id: "4",
    question: "Do you handle design as well as building?",
    answer:
      "We do both. You can bring your own designer or architect, or use our in-house interior design service for layouts, materials and lighting.",
  },
];

export const enquiries: Enquiry[] = [
  {
    id: "1",
    name: "Laura Kent",
    phone: "07700 900112",
    email: "laura.kent@example.com",
    service: "Kitchen Remodeling",
    propertyType: "Semi-detached",
    location: "Northfield",
    description: "Looking to replace a 20-year-old kitchen and open up to the dining room.",
    referenceImages: [],
    createdAt: "2026-08-14T10:12:00.000Z",
  },
  {
    id: "2",
    name: "Daniel Osei",
    phone: "07700 900443",
    email: "d.osei@example.com",
    service: "Bathroom Renovation",
    propertyType: "Apartment",
    location: "Harbour View",
    description: "Small en-suite, want a walk-in shower and better storage.",
    referenceImages: [],
    createdAt: "2026-08-19T15:40:00.000Z",
  },
];

"""Seed realistic demo content into the database.

Idempotent: safe to run repeatedly. Existing records are never deleted or
overwritten; a record is only inserted when an equivalent one does not exist.

Run from the Backend directory:

    python seed.py
"""

from sqlalchemy import select

from app.database import SessionLocal
from app.models.service import Service
from app.models.project import Project
from app.models.testimonial import Testimonial
from app.models.faq import FAQ
from app.models.enquiry import Enquiry


def img(photo_id: str, w: int = 1200) -> str:
    return f"https://images.unsplash.com/{photo_id}?auto=format&fit=crop&w={w}&q=80"


SERVICES = [
    {
        "name": "Full Kitchen Renovation",
        "slug": "kitchen-renovation",
        "description": (
            "Complete kitchen transformation from design and demolition to "
            "fitted units, premium worktops, new flooring and lighting. We "
            "handle plumbing and electrical re-routing so your new kitchen "
            "works beautifully and functions flawlessly."
        ),
        "image_url": img("photo-1556911220-bff31c812dba"),
    },
    {
        "name": "Bathroom Installation",
        "slug": "bathroom-installation",
        "description": (
            "A full bathroom refit including sanitaryware, walk-in showers, "
            "tiling, extractor and underfloor heating. We minimise disruption "
            "and complete every job to a watertight, tiled finish."
        ),
        "image_url": img("photo-1620626011761-996317b8d101"),
    },
    {
        "name": "Living Room & Interior Design",
        "slug": "living-room-interior-design",
        "description": (
            "Stylish, liveable interiors planned and delivered end to end. "
            "From space planning and colour schemes to carpentry, feature "
            "walls and lighting design, we bring your vision to life."
        ),
        "image_url": img("photo-1618221195710-dd6b41faaea6"),
    },
    {
        "name": "Loft & Attic Conversions",
        "slug": "loft-conversions",
        "description": (
            "Transform unused loft space into a bedroom, office or studio. "
            "We manage structural work, dormer windows, insulation and "
            "staircases while keeping your home safe and compliant."
        ),
        "image_url": img("photo-1522708323590-d24dbb6b0267"),
    },
    {
        "name": "Extensions & Structural Works",
        "slug": "extensions-structural-works",
        "description": (
            "Single and double-storey extensions with full project management. "
            "From foundations and structural framing to roofing, glazing and "
            "finishing, we deliver on time and within budget."
        ),
        "image_url": img("photo-1600585154340-be6161a56a0c"),
    },
]
PROJECTS = [
    {
        "title": "Modern Kitchen Extension",
        "description": (
            "A rear single-storey extension opened the kitchen and dining "
            "space into one bright, sociable family room with a large island "
            "and bi-fold doors onto the garden."
        ),
        "location": "Elm Grove",
        "image_url": img("photo-1556911220-bff31c812dba"),
        "before_image_url": img("photo-1503174971373-b1f69850bded", 900),
        "after_image_url": img("photo-1600607687939-ce8a6c25118c", 900),
        "is_featured": True,
    },
    {
        "title": "Luxury Bathroom Refit",
        "description": (
            "A dated family bathroom transformed into a calm, contemporary "
            "retreat with a walk-in rainfall shower, freestanding tub and "
            "large-format porcelain tiles."
        ),
        "location": "Northfield",
        "image_url": img("photo-1620626011761-996317b8d101"),
        "before_image_url": img("photo-1484154218962-a197022b5858", 900),
        "after_image_url": img("photo-1600489000022-c2086d79f9d4", 900),
        "is_featured": True,
    },
    {
        "title": "Open-Plan Living Room",
        "description": (
            "Knocking through two small rooms created a bright open-plan "
            "living and dining area with bespoke fitted joinery, feature "
            "lighting and a warm oak floor."
        ),
        "location": "Harbour View",
        "image_url": img("photo-1552321554-5fefe8c9ef14"),
        "before_image_url": img("photo-1584622650111-993a426fbf0a", 900),
        "after_image_url": img("photo-1600607687920-4e2a09cf159d", 900),
        "is_featured": True,
    },
    {
        "title": "Loft Conversion Studio",
        "description": (
            "An unused loft converted into a bright home office and guest "
            "room with dormer windows, skylights and built-in storage."
        ),
        "location": "Elm Grove",
        "image_url": img("photo-1522708323590-d24dbb6b0267"),
        "before_image_url": img("photo-1493809842364-78817add7ffb", 900),
        "after_image_url": img("photo-1616486338812-3dadae4b4ace", 900),
        "is_featured": False,
    },
    {
        "title": "Kitchen & Dining Remodel",
        "description": (
            "A tired 1990s kitchen rebuilt with modern shaker cabinets, "
            "quartz worktops, pendant lighting and a breakfast bar."
        ),
        "location": "Meadow Lane",
        "image_url": img("photo-1600566753086-00f18fb6b3ea"),
        "before_image_url": img("photo-1560448204-e02f11c3d0e2", 900),
        "after_image_url": img("photo-1600210492486-724fe5c67fb0", 900),
        "is_featured": False,
    },
    {
        "title": "Contemporary Family Bathroom",
        "description": (
            "A complete main-bathroom overhaul with a double vanity, large "
            "wet-room shower and efficient heating for a growing family."
        ),
        "location": "Westfield",
        "image_url": img("photo-1600596542815-ffad4c1539a9"),
        "before_image_url": img("photo-1505873242700-f289a29e1e0f", 900),
        "after_image_url": img("photo-1598928506311-c55ded91a20c", 900),
        "is_featured": False,
    },
]
TESTIMONIALS = [
    {
        "name": "Sarah Mitchell",
        "text": (
            "The team transformed our tired kitchen beyond recognition. "
            "Professional, tidy and ahead of schedule from start to finish."
        ),
        "rating": 5,
    },
    {
        "name": "James Okafor",
        "text": (
            "Our loft conversion was managed end to end with zero stress. "
            "The finish is superb and the quality of workmanship is clear."
        ),
        "rating": 5,
    },
    {
        "name": "Priya Sharma",
        "text": (
            "Beautifully designed bathroom, exactly what we asked for. They "
            "kept us informed at every stage and the price was fair."
        ),
        "rating": 5,
    },
    {
        "name": "Daniel Brooks",
        "text": (
            "Knocking through our living and dining rooms has changed how we "
            "use our home. Great communication and a flawless finish."
        ),
        "rating": 4,
    },
    {
        "name": "Emily Carter",
        "text": (
            "From the first site visit to the final clean, everything was "
            "handled professionally. I would not hesitate to recommend them."
        ),
        "rating": 5,
    },
]

FAQS = [
    {
        "question": "How much does a typical renovation cost?",
        "answer": (
            "Costs vary widely depending on the size and scope of the project. "
            "We provide a free, fixed written quote after a no-obligation "
            "on-site visit, so you know exactly where you stand."
        ),
    },
    {
        "question": "Will I need to move out during the works?",
        "answer": (
            "For most kitchen, bathroom and living-space projects you can stay "
            "at home. Larger structural extensions or full-house renovations "
            "may be more comfortable to vacate, and we will advise you "
            "before work begins."
        ),
    },
    {
        "question": "Do you provide planning permission and building control?",
        "answer": (
            "Yes. For structural work we prepare and submit planning "
            "applications where needed and manage building control "
            "inspections throughout the project."
        ),
    },
    {
        "question": "How long will my project take?",
        "answer": (
            "A bathroom usually takes 2–3 weeks and a kitchen 3–5 weeks, "
            "while extensions and loft conversions typically run 8–14 weeks. "
            "We agree a clear schedule before we start."
        ),
    },
    {
        "question": "Are you insured and fully qualified?",
        "answer": (
            "Absolutely. We are fully insured and our tradespeople are "
            "qualified in their fields, giving you total peace of mind."
        ),
    },
    {
        "question": "Do you offer a guarantee on your work?",
        "answer": (
            "Yes, all of our workmanship is guaranteed. If anything needs "
            "attention after the project is complete, we will return to "
            "put it right."
        ),
    },
]
# Clearly-fictional demo enquiries so the Admin Enquiries page is not empty.
ENQUIRIES = [
    {
        "name": "Alex Demo",
        "phone": "07700 900123",
        "email": "alex.demo@example.com",
        "property_type": "Terraced",
        "location": "Demo Road, Cityville",
        "description": "Demo enquiry: interested in a kitchen renovation quote.",
    },
    {
        "name": "Jordan Sample",
        "phone": "07711 900456",
        "email": "jordan.sample@example.com",
        "property_type": "Apartment",
        "location": "Sample Court, Cityville",
        "description": "Demo enquiry: enquiring about a bathroom refit.",
    },
]
def main() -> None:
    from sqlalchemy.orm import Session

    db: Session = SessionLocal()
    counts = {
        "services": 0,
        "projects_inserted": 0,
        "projects_updated": 0,
        "testimonials": 0,
        "faqs": 0,
        "enquiries": 0,
    }

    try:
        # Services (idempotent by unique slug)
        for item in SERVICES:
            exists = db.scalar(select(Service).where(Service.slug == item["slug"]))
            if not exists:
                db.add(Service(**item, is_active=True))
                counts["services"] += 1

        # Projects: upsert by title. When a demo project already exists it is
        # corrected to match the seed definition (e.g. image URLs) without
        # creating a duplicate or deleting the record.
        for item in PROJECTS:
            project = db.scalar(select(Project).where(Project.title == item["title"]))
            if not project:
                db.add(Project(**item))
                counts["projects_inserted"] += 1
            else:
                changed = False
                for field, value in item.items():
                    if getattr(project, field) != value:
                        setattr(project, field, value)
                        changed = True
                if changed:
                    counts["projects_updated"] += 1

        # Testimonials (idempotent by name + text)
        for item in TESTIMONIALS:
            exists = db.scalar(
                select(Testimonial).where(
                    Testimonial.name == item["name"],
                    Testimonial.text == item["text"],
                )
            )
            if not exists:
                db.add(Testimonial(**item, is_active=True))
                counts["testimonials"] += 1

        # FAQs (idempotent by question)
        for item in FAQS:
            exists = db.scalar(select(FAQ).where(FAQ.question == item["question"]))
            if not exists:
                db.add(FAQ(**item, is_active=True))
                counts["faqs"] += 1

        # Enquiries (idempotent by name + phone; clearly demo data)
        for item in ENQUIRIES:
            exists = db.scalar(
                select(Enquiry).where(
                    Enquiry.name == item["name"],
                    Enquiry.phone == item["phone"],
                )
            )
            if not exists:
                db.add(Enquiry(**item, status="New"))
                counts["enquiries"] += 1

        db.commit()

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print("Seed complete. Records inserted this run:")
    for table, n in counts.items():
        print(f"  {table}: {n}")


if __name__ == "__main__":
    main()
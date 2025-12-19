# Aura Scouting – Angular Clean Version

Aura Angular is a clean, lightweight Angular rewrite of the **Aura Scouting** web project.

This repository is a **fresh starting point** focused on structure, clarity, and scalability.
The media gallery has been intentionally removed to keep the codebase simple and easy to extend.

Built following Angular best practices and ready for active development.

---

## What This Project Is

- Angular-based version of Aura Scouting
- Clean architecture, no legacy clutter
- Modular and scalable
- Solid base to progressively add new features (gallery, admin, dashboards, etc.)

---

## Project Structure


src/
├─ app/
│ ├─ pages/ # Full pages (routing-level components)
│ ├─ shared/ # Reusable UI components
│ └─ services/ # Shared logic and data services
├─ assets/ # Static assets (images, icons)
├─ environments/ # Environment configurations
└─ styles.css # Global styles



### Pages

- `HomeComponent`
  Main page of the application.

### Shared Components

Each section of the home page is split into reusable components:

- `HeaderComponent` – Navigation bar
- `OurNameComponent` – Hero / logo section
- `AboutComponent` – Who we are
- `ServicesComponent` – Scouting services
- `HowComponent` – How we work
- `WhyComponent` – Value proposition / agencies
- `ScoutFormComponent` – Model submission form
- `ContactComponent` – Contact information
- `FooterComponent` – Page footer

---

## Requirements

- Node.js **18+**
- Angular CLI **16+**

---

## Installation

```bash
git clone https://github.com/Cyberdude00/Aura-Angular.git
cd Aura-Angular
npm install
ng serve


http://localhost:4200


Modifying the Design

Global styles are located in:

src/styles.css


Each section has clear IDs or classes.
Example: search for #about to modify the About section.

Component-level CSS files can be used for specific tweaks, but global styles are preferred for consistency.

Modifying the Content

Each section’s content lives in its component HTML file.

Example:

src/app/shared/about/about.component.html


The overall page structure and section order are defined in:

src/app/pages/home/home.component.html

Notes

Media gallery intentionally removed

No backend coupling

Clean base meant to evolve, not a finished product
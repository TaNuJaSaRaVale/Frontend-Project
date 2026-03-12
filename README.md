# Atomity Frontend Engineering Challenge

## Overview

This project recreates an animated **Sustainability Impact Pulse** section inspired by the Atomity product video.
The goal was to interpret the feature concept and build a responsive, data-driven UI with smooth scroll-triggered animations.

The section presents sustainability metrics using animated KPI cards with circular progress indicators, number-counting animations, and subtle motion interactions.

---

## Feature Implemented

I implemented a **KPI metrics dashboard section** that displays sustainability insights derived from API data.

The section includes:

* Emissions Offset Potential
* High-Impact Items
* Data Quality Score
* Sustainability Score

Each metric is rendered as an animated card with a circular progress indicator and dynamically computed values.

---

## Tech Stack

* **React + TypeScript**
* **Framer Motion** for animations
* **TanStack React Query** for data fetching and caching
* **Tailwind CSS** for styling
* **Vite** for development and build

---

## Animation Approach

Animations are implemented using **Framer Motion**.

Key animation techniques used:

* Scroll-triggered section reveal
* Staggered card entrance
* Smooth number counting animations
* Animated circular progress indicators
* Subtle hover interaction on KPI cards

Animations respect `prefers-reduced-motion` to improve accessibility.

---

## Data Fetching

Data is fetched from the **DummyJSON API**.

The KPI metrics are computed dynamically from product data, including:

* average discount
* average rating
* stock levels
* total product value

These values are transformed into sustainability metrics used in the dashboard.

---

## Caching Strategy

Data fetching is handled using **React Query (TanStack Query)**.

Benefits:

* Automatic caching
* No redundant network requests
* Instant UI updates on revisit
* Loading and error states handled gracefully

---

## Design Token Architecture

A **design token system** is used to avoid hard-coded styling values.

Tokens are defined using CSS variables:

* color tokens
* spacing
* radius
* shadows
* typography

Components reference tokens instead of raw values to ensure consistency and maintainability.

---

## Component Structure

The project follows a modular component architecture:

src/
components/
feature/
FeatureSection.tsx
KpiCard.tsx
ui/
Badge.tsx

hooks/
useKpiData.ts

lib/
api.ts

tokens/
tokens.ts
theme.css

Each component has a clear responsibility and is reusable.

---

## Responsiveness

The layout adapts across devices:

Desktop → 4 KPI cards
Tablet → 2 KPI cards
Mobile → 1 KPI card

Fluid typography and responsive grid layouts ensure readability at all screen sizes.

---

## Accessibility Considerations

The implementation includes several accessibility improvements:

* semantic HTML structure (`section`, `header`, `h2`)
* `aria-labelledby` for assistive technologies
* keyboard focusable cards
* reduced motion support
* readable color contrast

---

## Tradeoffs

To keep the implementation focused within the time limit:

* I prioritized a single polished section instead of a full page.
* The sustainability metrics are simulated using product data from a public API.

---


## Live Demo

Deployed via **Vercel**

Live URL:
[KPI](https://frontendkpi.vercel.app/)]

---



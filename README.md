# Atomity Frontend Engineering Challenge

## Feature Implemented
I implemented the **Sustainability Impact Pulse KPI section** inspired by the product video.

## Tech Stack
- React + TypeScript
- Framer Motion for animations
- TanStack React Query for data fetching and caching
- Tailwind CSS
- Vite

## Features
- Scroll-triggered KPI card animations
- Number counting animations
- API-driven data (DummyJSON)
- Loading and error states
- React Query caching
- Responsive layout
- Accessibility considerations
- Design token architecture

## Animation Approach
Cards animate using **Framer Motion variants** with staggered entrance when the section enters the viewport.

Number values animate using `framer-motion animate()` for smooth counting.

## Data Handling
KPI metrics are computed from API data retrieved using React Query with caching enabled.

## Styling
A **design token system using CSS variables** ensures consistent colors and spacing.

## Improvements (with more time)
- Add container queries
- Add dark mode toggle
- Add more advanced animation sequencing
- Improve KPI data modeling

## Run Locally

```bash
npm install
npm run dev
# K12Path Landing Page

A modern, bilingual landing page for K12Path built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout with Header/Footer
│   └── page.tsx         # Landing page
├── components/
│   ├── layout/
│   │   ├── Header.tsx   # Sticky navbar with mobile menu
│   │   └── Footer.tsx   # Multi-column footer
│   ├── sections/
│   │   ├── Hero.tsx     # Hero section
│   │   ├── PainPoints.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   └── ui/
│       ├── Button.tsx   # Reusable button component
│       └── Logo.tsx     # Logo component
├── context/
│   └── LanguageContext.tsx  # Bilingual support
├── data/
│   ├── navigation.json      # Header/Footer links
│   └── landing-content.json # Page content
└── types/
    └── index.ts             # TypeScript interfaces
```

## Features

- ✅ **Bilingual Support:** Full English/Chinese content structure
- ✅ **Responsive Design:** Mobile-first with Tailwind utilities
- ✅ **Data-Driven:** All content from JSON configuration
- ✅ **Semantic HTML:** Proper use of HTML5 tags
- ✅ **Component Architecture:** Modular, reusable components
- ✅ **Type Safety:** Full TypeScript coverage

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Customization

### Adding Content

Edit the JSON files in `src/data/`:
- `navigation.json` - Header/footer links
- `landing-content.json` - Page sections

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component styles: Inline Tailwind classes

### Adding Pages

Create new files in `src/app/` following Next.js App Router conventions.

## License

MIT

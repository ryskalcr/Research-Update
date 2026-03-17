# Sandhill Investment Management — Research Update

A web-based tool for the research team to publish biweekly performance and macro updates to advisors. Replaces the Excel-to-PDF workflow with a sleek, interactive web app.

## Features

- **Advisor View** — clean, two-column layout with performance data on the left, market & portfolio commentary on the right, and full-width macro environment section below
- **Edit Data** — research team input panel for updating all performance numbers, commentary, and macro entries
- **Image paste/drop** — paste charts directly from clipboard, drag & drop files, or click to browse
- **Persistent storage** — data saves to localStorage and persists across sessions
- **Sandhill branded** — uses official brand colors (#004465 teal, #d0ac2b gold) and typography
- **Print-friendly** — advisor view prints cleanly for PDF export
- **Zero dependencies** — pure HTML, CSS, and vanilla JavaScript

## Layout

**Top half (two columns):**
- Left: YTD Performance, Market Benchmarks, Portfolio Changes
- Right: Market Commentary, Portfolio Commentary

**Bottom half (full width):**
- Macro Environment: Inflation, Economy, Labor Market, Consumer, Fed & Rates, Other — each with text and full-width charts

## Files

```
index.html          — Main page
style.css           — Sandhill-branded styles
app.js              — Application logic
Sandhill_logo.png   — Company logo (optional, for branding)
README.md           — This file
```

## Quick Start

Open `index.html` in a web browser. No server or build tools required.

## Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push all files to the `main` branch
3. Go to **Settings → Pages → Deploy from branch → main**
4. Your site will be live at `https://yourusername.github.io/repo-name/`

## Usage

1. Click **Edit Data** in the nav bar
2. Update performance numbers, commentary, and macro entries
3. Paste or drag chart images into the drop zones
4. Click **Save Changes**
5. Switch to **Advisor View** to see the output
6. Print or share the URL with advisors

## Customization

- **Colors**: Edit CSS variables in `:root` at the top of `style.css`
- **Default data**: Edit the `DEFAULT_DATA` object in `app.js`
- **Macro sections**: Add or remove sections in the `macroSections` array

## Disclaimer

For internal use only. The information provided does not constitute financial advice.

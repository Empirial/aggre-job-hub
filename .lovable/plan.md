
# Complete AdSense Remediation Changes

## Overview
This plan covers the final AdSense remediation tasks: updating the sitemap with new resource pages, adding the Technology & IT editorial description to the Jobs page, and expanding the navigation to include more high-value pages.

---

## Changes to Implement

### 1. Update sitemap.xml with Resource Pages
**File:** `public/sitemap.xml`

Add 6 new URLs for the resource hub and its articles:

| URL | Change Frequency | Priority |
|-----|------------------|----------|
| `/resources` | weekly | 0.8 |
| `/resources/sa-job-market-guide-2026` | monthly | 0.7 |
| `/resources/nsfas-application-mistakes` | monthly | 0.7 |
| `/resources/johannesburg-cv-tips` | monthly | 0.7 |
| `/resources/sassa-srd-guide` | monthly | 0.7 |
| `/resources/western-cape-stem-bursaries` | monthly | 0.7 |

---

### 2. Add Technology & IT Editorial Description to Jobs Page
**File:** `src/pages/Jobs.tsx`

Add a conditional editorial section that displays when the URL contains `?category=technology` or similar IT-related categories. This will:
- Read the current URL query parameter for category
- Display a contextual editorial paragraph above the job listings
- Include descriptions for multiple categories (Technology, Government, Learnerships, Internships)

**Editorial content for Technology & IT:**
> "The South African Technology and IT sector is booming, driving demand for skilled professionals in software development, data science, and cybersecurity. This category features the latest vacancies from leading tech hubs in Cape Town, Johannesburg, and remote-first companies across the country. We list roles from entry-level support to senior architecture positions, with transparent salary ranges to help you benchmark your career. Explore opportunities in FinTech, EdTech, and enterprise solutions, and find your next challenge in one of South Africa's fastest-growing industries."

---

### 3. Expand Navigation Bar
**File:** `src/components/Navigation.tsx`

Update the `navLinks` array to include additional high-value pages:

**Current links:**
- Government Jobs
- Learnerships
- Bursaries
- Career Resources

**Updated links:**
- Government Jobs
- Learnerships
- Internships
- SASSA Updates
- Bursaries
- Universities
- NSFAS
- Career Resources

This matches the original SA high-traffic niche strategy and ensures all key pages are accessible from the main navigation.

---

## Technical Details

### Jobs Page Category Detection
```text
- Use useSearchParams() or useLocation() to detect URL query parameters
- Create a categoryDescriptions object mapping category names to editorial content
- Render the appropriate description based on the current category
- Categories to support: government, learnerships, internships, technology
```

### Sitemap Structure
The new resource URLs will be inserted after the existing content pages (before legal pages) with appropriate SEO priorities.

---

## Summary of Files to Modify
1. `public/sitemap.xml` - Add 6 new resource page URLs
2. `src/pages/Jobs.tsx` - Add category-based editorial descriptions
3. `src/components/Navigation.tsx` - Expand navigation to include Internships, SASSA Updates, Universities, and NSFAS

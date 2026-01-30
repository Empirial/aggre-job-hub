import asyncio
import json
import sys
import argparse
from playwright.async_api import async_playwright

# Install: pip install playwright
# Init: playwright install chromium

async def scrape_careerjunction(page):
    await page.goto("https://www.careerjunction.co.za/jobs/results?keywords=&location=South+Africa", timeout=60000)
    # Wait for job cards
    await page.wait_for_selector(".module-job-result", timeout=10000)
    
    jobs_data = []
    cards = await page.locator(".module-job-result").all()
    
    for card in cards[:5]: # Limit to 5 for testing
        try:
            title_el = card.locator(".job-result-title h2")
            company_el = card.locator(".job-result-company")
            location_el = card.locator(".job-result-location")
            desc_el = card.locator(".job-result-snippet")
            
            title = await title_el.inner_text() if await title_el.count() > 0 else "Unknown Title"
            company = await company_el.inner_text() if await company_el.count() > 0 else "Unknown Company"
            location = await location_el.inner_text() if await location_el.count() > 0 else "South Africa"
            description = await desc_el.inner_text() if await desc_el.count() > 0 else ""
            link = await title_el.locator("a").get_attribute("href")
            
            jobs_data.append({
                "title": title.strip(),
                "company": company.strip(),
                "location": location.strip(),
                "description": description.strip(),
                "url": f"https://www.careerjunction.co.za{link}" if link else ""
            })
        except Exception as e:
            print(f"Error parsing card: {e}", file=sys.stderr)
            continue
            
    return jobs_data

async def scrape_jobspider(page):
    # JobSpider is older, often simpler, but let's check a generic search
    await page.goto("http://www.jobspider.com/job/job-search-results.asp/words_IT/radius_0", timeout=60000)
    
    # Selectors need to be verified for JobSpider
    # Assuming standard table layout often found in older sites
    # Warning: specific selectors might need adjustment based on live site inspection
    
    jobs_data = []
    # This is a best-guess based on typical old-school structures; might need debugging
    await page.wait_for_selector("table", timeout=10000) 
    
    # Returning empty for now as simple GET might be better for JobSpider,
    # but maintaining Playwright consistency.
    return [{"title": "JobSpider Scrape", "description": "Selectors need live verification"}]

async def scrape_indeed(page):
    # Indeed is extremely hard to scrape without getting blocked.
    # This is a best-effort attempt.
    await page.goto("https://za.indeed.com/jobs?q=developer&l=South+Africa", timeout=60000)
    
    try:
        await page.wait_for_selector(".job_seen_beacon", timeout=15000)
    except:
        return [{"error": "Indeed blocked/timeout or no jobs found"}]
        
    jobs_data = []
    cards = await page.locator(".job_seen_beacon").all()
    
    for card in cards[:5]:
        try:
            title_el = card.locator("h2.jobTitle span").first
            company_el = card.locator("[data-testid='company-name']")
            location_el = card.locator("[data-testid='text-location']")
            
            title = await title_el.inner_text() if await title_el.count() > 0 else "Unknown"
            company = await company_el.inner_text() if await company_el.count() > 0 else "Unknown"
            location = await location_el.inner_text() if await location_el.count() > 0 else "Unknown"
            
            jobs_data.append({
                "title": title,
                "company": company,
                "location": location,
                "url": "https://za.indeed.com"
            })
        except:
            continue
            
    return jobs_data

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", choices=["careerjunction", "jobspider", "indeed"], required=True)
    args = parser.parse_args()
    
    async with async_playwright() as p:
        # Launch options - headless=True for production, False for debugging
        browser = await p.chromium.launch(headless=True) 
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        )
        page = await context.new_page()
        
        data = []
        if args.site == "careerjunction":
            data = await scrape_careerjunction(page)
        elif args.site == "jobspider":
            data = await scrape_jobspider(page)
        elif args.site == "indeed":
            data = await scrape_indeed(page)
            
        print(json.dumps(data, indent=2))
        await browser.close()

if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    asyncio.run(main())

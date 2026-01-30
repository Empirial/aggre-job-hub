import asyncio
import sys
import argparse
import os
from playwright.async_api import async_playwright

# Template for the social media post image
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
<style>
  body {{
    margin: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    height: 630px; /* LinkedIn/Twitter Card Size approx */
    width: 1200px;
    display: flex;
    justify_content: center;
    align_items: center;
    color: white;
  }}
  .card {{
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 60px;
    width: 900px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
  }}
  .tag {{
    background: #fbbf24;
    color: #1e3a8a;
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 1.2rem;
    display: inline-block;
    margin-bottom: 20px;
  }}
  h1 {{
    font-size: 4rem;
    margin: 10px 0 20px 0;
    line-height: 1.1;
  }}
  .location {{
    font-size: 2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    opacity: 0.9;
  }}
  .footer {{
    margin-top: 40px;
    font-size: 1.5rem;
    opacity: 0.8;
  }}
</style>
</head>
<body>
  <div class="card">
    <div class="tag">New Opportunity</div>
    <h1>{title}</h1>
    <div class="location">
      <span>📍</span> {location}
    </div>
    <div class="footer">Apply now via CareerGate</div>
  </div>
</body>
</html>
"""

async def generate_image(title, location, output_path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1200, "height": 630})
        
        # Fill template
        content = HTML_TEMPLATE.format(title=title, location=location)
        await page.set_content(content)
        
        # Take screenshot
        await page.screenshot(path=output_path)
        print(f"Image saved to {output_path}")
        
        await browser.close()

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", required=True)
    parser.add_argument("--location", default="South Africa")
    parser.add_argument("--output", default="job_post_image.png")
    args = parser.parse_args()
    
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        
    await generate_image(args.title, args.location, args.output)

if __name__ == "__main__":
    asyncio.run(main())

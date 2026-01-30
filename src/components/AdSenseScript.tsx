import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

export const AdSenseScript = () => {
    const location = useLocation();

    useEffect(() => {
        // Define blocked routes (exact paths or patterns)
        // We block 404 pages (usually captured by routing, but if we have specific logic)
        // Since this component sits in App.tsx, we can check location.pathname

        // Note: React Router's "catch-all" (*) is often handled by a specific component,
        // but the URL remains what the user typed.
        // If the user lands on /non-existent-page, location.pathname is /non-existent-page.
        // We can't know for SURE if it's a 404 just from pathname unless we match against known routes.
        // HOWEVER, the simplest way to avoid "no content" violations is to whitelist or strictly block known bads.
        // Since identifying ALL valid routes dynamically is hard without a central config,
        // we will rely on key indicators or try to detect the "NotFound" state if possible.
        // But usually, common practice is to allow global, but exclude specific admin/auth/empty paths.

        // For now, let's assume all valid pages are "safe" and we just want to avoid 
        // obvious non-content pages if we can identify them. 
        // Actually, AdSense Auto Ads are smart, but the "No Content" error often comes from
        // the crawler hitting a page with 0 text.

        // STRATEGY: We will load the script EVERYWHERE, but you can blacklist paths here.
        // If you need to stop it on 404s, you ideally wouldn't render this component on the 404 page.
        // But since it's in App.tsx layout, it's always there.

        // REVISED STRATEGY: We will check if the current path seems to be a valid structure
        // or if we simply want to inject it once.

        // Given the user's specific error "screens without publisher-content", 
        // it effectively means the crawler found a page (maybe a redirect or a search result with 0 items)
        // and saw ads.

        const shouldLoadAds = () => {
            // Example: Don't show ads on admin routes or auth routes
            if (location.pathname.startsWith("/admin")) return false;
            if (location.pathname.startsWith("/auth")) return false;

            // If you want to be very strict:
            // Only allow known root paths: /, /jobs, /bursaries, /stem-careers, etc.
            // This is safer for "publisher-content" violations.
            const safePrefixes = [
                "/",
                "/jobs",
                "/job/",
                "/bursaries",
                "/stem-careers",
                "/sassa-updates",
                "/universities",
                "/nsfas",
                "/donate",
                "/privacy",
                "/disclaimer",
                "/terms",
                "/cookie-policy",
                "/resources",
                "/about",
                "/contact"
            ];

            // Exact match for root
            if (location.pathname === "/") return true;

            // Check prefixes
            return safePrefixes.some(prefix => location.pathname.startsWith(prefix));
        };

        if (!shouldLoadAds()) {
            console.log("AdSense blocked on this route:", location.pathname);
            return;
        }

        // Check if script is already present
        if (document.querySelector('script[src*="adsbygoogle.js"]')) {
            return;
        }

        const script = document.createElement("script");
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8293305741444500";
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);

        return () => {
            // Optional: Remove script on unmount? 
            // Usually AdSense scripts are global and don't support clean removal/re-addition easily.
            // Once loaded, it's loaded. 
            // But preventing it from loading on the *first* landing page if it's a 404 is the goal.
        };
    }, [location.pathname]);

    return null;
};

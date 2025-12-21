import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("cookieConsent", "essential");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg border-2">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <Cookie className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-1">We use cookies</h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to improve your experience, analyze site traffic, and show relevant ads. 
                By clicking "Accept All," you consent to our use of cookies including third-party advertising cookies (Google AdSense).{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Learn more in our Privacy Policy
                </Link>
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
            <Button variant="outline" size="sm" onClick={acceptEssential} className="flex-1 md:flex-none">
              Essential Only
            </Button>
            <Button size="sm" onClick={acceptAll} className="flex-1 md:flex-none">
              Accept All
            </Button>
          </div>
        </div>
        <button 
          onClick={acceptEssential}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </Card>
    </div>
  );
};

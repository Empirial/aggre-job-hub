import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Cookie, Info, Shield, Settings, BarChart3, Target, Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              How we use cookies and similar technologies on CareerGate
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last updated: December 2024
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* What Are Cookies */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Cookie className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">What Are Cookies?</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. They are widely used to make websites work more efficiently, provide information to website owners, and enhance user experience.
                  </p>
                  <p>
                    Cookies can be "persistent" or "session" cookies:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until you delete them</li>
                    <li><strong>Session cookies:</strong> Are deleted when you close your web browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* How We Use Cookies */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CareerGate uses cookies for several purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>To ensure the website functions properly</li>
                    <li>To remember your preferences and settings</li>
                    <li>To analyze how you use our website</li>
                    <li>To display relevant advertisements</li>
                    <li>To improve our services based on user behavior</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Types of Cookies */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Types of Cookies We Use</h2>
              
              {/* Essential Cookies */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-lg">Essential Cookies</h3>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as setting your privacy preferences or filling in forms.
                  </p>
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Cookie Name</th>
                        <th className="text-left py-2 font-medium">Purpose</th>
                        <th className="text-left py-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">cookieConsent</td>
                        <td className="py-2">Stores your cookie consent preference</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">session_id</td>
                        <td className="py-2">Maintains your session state</td>
                        <td className="py-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <BarChart3 className="w-6 h-6 text-secondary" />
                  <h3 className="font-semibold text-lg">Analytics Cookies</h3>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
                  </p>
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Cookie Name</th>
                        <th className="text-left py-2 font-medium">Purpose</th>
                        <th className="text-left py-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">_ga</td>
                        <td className="py-2">Google Analytics - distinguishes users</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">_ga_*</td>
                        <td className="py-2">Google Analytics - maintains session state</td>
                        <td className="py-2">2 years</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">_gid</td>
                        <td className="py-2">Google Analytics - distinguishes users</td>
                        <td className="py-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Advertising Cookies */}
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-primary" />
                  <h3 className="font-semibold text-lg">Advertising Cookies</h3>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    These cookies are used to show you relevant advertisements. They may be set by us or by advertising partners and help build a profile of your interests.
                  </p>
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Cookie Name</th>
                        <th className="text-left py-2 font-medium">Purpose</th>
                        <th className="text-left py-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">__gads</td>
                        <td className="py-2">Google AdSense - ad serving</td>
                        <td className="py-2">13 months</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">__gpi</td>
                        <td className="py-2">Google AdSense - personalized ads</td>
                        <td className="py-2">13 months</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">NID</td>
                        <td className="py-2">Google - preferences and ad personalization</td>
                        <td className="py-2">6 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-6 h-6 text-secondary" />
                  <h3 className="font-semibold text-lg">Functional Cookies</h3>
                </div>
                <div className="text-muted-foreground space-y-2">
                  <p>
                    These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.
                  </p>
                  <table className="w-full mt-4 text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Cookie Name</th>
                        <th className="text-left py-2 font-medium">Purpose</th>
                        <th className="text-left py-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">theme</td>
                        <td className="py-2">Remembers your theme preference (light/dark)</td>
                        <td className="py-2">1 year</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">filters</td>
                        <td className="py-2">Remembers your job/bursary filter preferences</td>
                        <td className="py-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>

          {/* Third-Party Cookies */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  In addition to our own cookies, we may also use third-party cookies to report usage statistics, deliver advertisements, and so on. These third parties include:
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Google Analytics</h4>
                    <p className="text-sm">
                      We use Google Analytics to understand how visitors interact with our website. You can learn more about how Google uses your data at{" "}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Google's Privacy Policy
                      </a>.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Google AdSense</h4>
                    <p className="text-sm">
                      We display advertisements through Google AdSense. Google uses cookies to serve ads based on your prior visits. You can opt out of personalized advertising at{" "}
                      <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Google Ads Settings
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Managing Cookies */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Settings className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Managing Your Cookie Preferences</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You have the right to accept or reject cookies. When you first visit CareerGate, you will see a cookie consent banner where you can choose to accept all cookies or only essential cookies.
                  </p>
                  
                  <h3 className="font-semibold text-foreground mt-6 mb-2">Browser Settings</h3>
                  <p>
                    Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Google Chrome
                      </a>
                    </li>
                    <li>
                      <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Mozilla Firefox
                      </a>
                    </li>
                    <li>
                      <a href="https://support.apple.com/en-za/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Safari
                      </a>
                    </li>
                    <li>
                      <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Microsoft Edge
                      </a>
                    </li>
                  </ul>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg mt-6">
                    <p className="text-sm">
                      <strong className="text-foreground">Please note:</strong> If you choose to block or delete cookies, some features of our website may not function properly, and your user experience may be affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Cookie Retention */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Cookie Retention Periods</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Different cookies have different retention periods:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                    <li><strong>Persistent cookies:</strong> Remain for varying periods depending on their purpose, typically from 24 hours to 2 years</li>
                  </ul>
                  <p>
                    You can see the specific retention period for each cookie in the tables above.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Updates to Policy */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
                </p>
                <p>
                  When we make changes, we will update the "Last updated" date at the top of this page. Significant changes may be communicated through a notice on our website.
                </p>
              </div>
            </div>
          </Card>

          {/* Related Policies */}
          <Card className="p-6 md:p-8 mb-8 bg-muted/30">
            <div>
              <h2 className="text-2xl font-bold mb-4">Related Policies</h2>
              <div className="space-y-2">
                <p className="text-muted-foreground mb-4">
                  For more information about how we handle your data, please see our other policies:
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/privacy" className="inline-flex items-center gap-2 px-4 py-2 bg-background border rounded-lg hover:border-primary transition-colors">
                    <Shield className="w-4 h-4 text-primary" />
                    Privacy Policy
                  </Link>
                  <Link to="/terms" className="inline-flex items-center gap-2 px-4 py-2 bg-background border rounded-lg hover:border-primary transition-colors">
                    <Settings className="w-4 h-4 text-primary" />
                    Terms and Conditions
                  </Link>
                  <Link to="/disclaimer" className="inline-flex items-center gap-2 px-4 py-2 bg-background border rounded-lg hover:border-primary transition-colors">
                    <Info className="w-4 h-4 text-primary" />
                    Disclaimer
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> info@careergate.co.za</li>
                    <li><strong>Address:</strong> Johannesburg, South Africa</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;

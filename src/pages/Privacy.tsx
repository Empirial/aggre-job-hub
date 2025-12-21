import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { 
  Shield, 
  Cookie, 
  Database, 
  Share2, 
  Lock, 
  Mail,
  FileText,
  AlertCircle
} from "lucide-react";

const Privacy = () => {
  const lastUpdated = "21 December 2024";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/90">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                JobFinder SA ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
              <p className="text-muted-foreground">
                We comply with the Protection of Personal Information Act (POPIA) and are committed to ensuring that your privacy is protected. By using our website, you consent to the data practices described in this policy.
              </p>
            </Card>

            {/* Information We Collect */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Information We Collect</h2>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                When you use our services, we may collect the following personal information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mb-6 space-y-1">
                <li>Name and surname</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Location/Province</li>
                <li>Information you provide in contact forms</li>
              </ul>

              <h3 className="font-semibold text-lg mb-2">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>IP address and geographic location</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Pages viewed and time spent on pages</li>
                <li>Referring website or source</li>
                <li>Search queries on our platform</li>
              </ul>
            </Card>

            {/* Cookie Disclosure */}
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Cookie Disclosure</h2>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <p className="text-sm">
                    <strong>Important:</strong> This website uses cookies and similar tracking technologies. By continuing to use our website, you consent to our use of cookies as described below.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2">Types of Cookies We Use</h3>
              
              <div className="space-y-4 mb-6">
                <div className="border-l-4 border-primary pl-4">
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Required for the website to function properly. These cannot be disabled.
                  </p>
                </div>
                <div className="border-l-4 border-secondary pl-4">
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how visitors interact with our website (e.g., Google Analytics).
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-medium">Advertising Cookies (Third-Party)</h4>
                  <p className="text-sm text-muted-foreground">
                    Used by advertising partners to deliver relevant ads. See "Third-Party Services" below.
                  </p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-2">Managing Cookies</h3>
              <p className="text-muted-foreground">
                You can control and delete cookies through your browser settings. However, disabling cookies may affect the functionality of our website. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
            </Card>

            {/* Third-Party Services */}
            <Card className="p-6 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Third-Party Services</h2>
              </div>
              
              <p className="text-muted-foreground mb-6">
                We use the following third-party services that may collect and process your data:
              </p>

              <div className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Google AdSense</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites. This includes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Personalized advertising based on your interests</li>
                    <li>Collection of browsing data across websites</li>
                    <li>Use of DoubleClick cookies for ad serving</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>Opt-out:</strong> Visit{" "}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google's Ads Settings
                    </a>
                    {" "}or{" "}
                    <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      aboutads.info
                    </a>
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Yoco Payment Processing</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    For donations, we use Yoco as our payment processor. When you make a donation:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Payment card details are processed directly by Yoco — we never store your card information</li>
                    <li>Yoco may collect information necessary to process your payment</li>
                    <li>Transaction records are kept for tax and accounting purposes</li>
                  </ul>
                  <p className="text-sm mt-3">
                    <strong>Yoco Privacy Policy:</strong>{" "}
                    <a href="https://www.yoco.com/za/legal/privacy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      www.yoco.com/za/legal/privacy
                    </a>
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Google Analytics</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    We use Google Analytics to understand how visitors use our website. This includes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Pages visited and time spent on each page</li>
                    <li>Geographic location (country/city level)</li>
                    <li>Device and browser information</li>
                    <li>Traffic sources and user journeys</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* How We Use Your Information */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide and improve our job search, bursary, and career services</li>
                <li>Respond to your inquiries and contact form submissions</li>
                <li>Send you relevant job alerts if you've subscribed</li>
                <li>Process donations and provide tax receipts</li>
                <li>Analyze website usage to improve user experience</li>
                <li>Display relevant advertisements to support our free services</li>
                <li>Detect and prevent fraudulent activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </Card>

            {/* Data Sharing */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">When We Share Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell your personal information. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Service Providers:</strong> Third-party services that help us operate our website (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of JobFinder SA, our users, or the public</li>
                <li><strong>Consent:</strong> With your explicit consent for any other purpose</li>
              </ul>
            </Card>

            {/* Data Security */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Data Security</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>SSL/TLS encryption for all data transmission</li>
                <li>Secure server infrastructure</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </Card>

            {/* Your Rights (POPIA) */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Your Rights Under POPIA</h2>
              <p className="text-muted-foreground mb-4">
                Under the Protection of Personal Information Act (POPIA), you have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal retention requirements)</li>
                <li><strong>Object:</strong> Object to the processing of your personal information for direct marketing</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, please contact us using the details below.
              </p>
            </Card>

            {/* Data Retention */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Contact form submissions are retained for 2 years. Analytics data is aggregated and anonymized after 26 months. Donation records are retained for 5 years for tax purposes.
              </p>
            </Card>

            {/* Children's Privacy */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us, and we will take steps to delete such information.
              </p>
            </Card>

            {/* Changes to Policy */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
              </p>
            </Card>

            {/* Contact Information */}
            <Card className="p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Contact Us</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacy@jobfinder.co.za</p>
                <p><strong>Phone:</strong> +27 11 123 4567</p>
                <p><strong>Address:</strong> 123 Business Street, Sandton, Johannesburg, 2196, South Africa</p>
              </div>
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Information Regulator (South Africa):</strong><br />
                  Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.justice.gov.za/inforeg</a><br />
                  Email: inforeg@justice.gov.za
                </p>
              </div>
            </Card>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

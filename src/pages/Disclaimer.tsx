import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Info, Scale, FileWarning, ExternalLink, Shield } from "lucide-react";

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Disclaimer
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Important information about the use of CareerGate services and content
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last updated: December 2024
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* General Disclaimer */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">General Disclaimer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The information provided on CareerGate (careergate.co.za) is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website for any purpose.
                  </p>
                  <p>
                    Any reliance you place on such information is therefore strictly at your own risk. In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Job Listings Disclaimer */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <FileWarning className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Job Listings Disclaimer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CareerGate aggregates job listings from various sources including the Department of Public Service and Administration (DPSA) and other public job boards. We do not directly employ or represent any employers listed on our platform.
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Job listings are provided "as is" from their original sources</li>
                    <li>We do not guarantee the accuracy of job details, salaries, or application deadlines</li>
                    <li>Application processes are handled directly by the respective employers</li>
                    <li>We are not responsible for the hiring decisions of any employer</li>
                    <li>Job availability may change without notice</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Always verify job details directly with the employer before applying.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Bursary Information Disclaimer */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Info className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Bursary Information Disclaimer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Bursary information provided on CareerGate is aggregated from publicly available sources and is intended to assist students in finding funding opportunities. However:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We do not administer or fund any bursaries listed on our platform</li>
                    <li>Eligibility criteria may change without our knowledge</li>
                    <li>Application deadlines are subject to change by the bursary providers</li>
                    <li>We cannot guarantee the availability or continued existence of any bursary program</li>
                    <li>Selection decisions are made solely by the bursary providers</li>
                  </ul>
                  <p className="font-medium text-foreground">
                    Always verify bursary details directly with the provider before applying.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* External Links Disclaimer */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <ExternalLink className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">External Links Disclaimer</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    CareerGate may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                  </p>
                  <p>
                    The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them. We have no control over the nature, content, and availability of those sites.
                  </p>
                  <p className="font-medium text-foreground">
                    External links are followed at your own risk. We encourage users to review the privacy policies and terms of use of any external websites.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* No Professional Advice */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Scale className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">No Professional Advice</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The content on CareerGate is for informational purposes only and should not be considered as:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Legal advice</li>
                    <li>Financial advice</li>
                    <li>Career counseling or professional guidance</li>
                    <li>Educational advice</li>
                  </ul>
                  <p>
                    For specific advice regarding your situation, please consult with qualified professionals in the relevant field.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Scam Warning */}
          <Card className="p-6 md:p-8 mb-8 border-amber-500/50 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Scam Warning</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Be aware of job and bursary scams. Legitimate employers and bursary providers will NEVER:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Ask you to pay money to apply for a job or bursary</li>
                    <li>Request your banking details before employment</li>
                    <li>Ask for payment for training or equipment before you start working</li>
                    <li>Offer unrealistic salaries or benefits</li>
                    <li>Conduct interviews via SMS or WhatsApp only</li>
                  </ul>
                  <p>
                    If you encounter a suspicious listing on CareerGate, please report it to us immediately at info@careergate.co.za.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  To the maximum extent permitted by applicable law, CareerGate and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your access to or use of or inability to access or use the service</li>
                  <li>Any conduct or content of any third party on the service</li>
                  <li>Any content obtained from the service</li>
                  <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                  <li>Any employment or bursary decisions made based on information from our platform</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* South African Law */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This disclaimer shall be governed by and construed in accordance with the laws of the Republic of South Africa, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising out of or in connection with this disclaimer shall be subject to the exclusive jurisdiction of the courts of South Africa.
                </p>
              </div>
            </div>
          </Card>

          {/* Changes to Disclaimer */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Changes to This Disclaimer</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We reserve the right to update or change this disclaimer at any time. Any changes will be effective immediately upon posting on this page. Your continued use of CareerGate after any modifications indicates your acceptance of the updated disclaimer.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 md:p-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  If you have any questions about this disclaimer, please contact us:
                </p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> info@careergate.co.za</li>
                  <li><strong>Address:</strong> Johannesburg, South Africa</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Disclaimer;

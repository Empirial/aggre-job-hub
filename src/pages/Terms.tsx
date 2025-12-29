import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText, Users, Shield, AlertCircle, Scale, Ban, RefreshCw, Mail } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Terms and Conditions
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using CareerGate
            </p>
            <p className="text-sm text-white/70 mt-4">
              Last updated: December 2024
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Introduction */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <FileText className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Welcome to CareerGate ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our website at careergate.co.za and any related services (collectively, the "Service").
                  </p>
                  <p>
                    By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
                  </p>
                  <p>
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Eligibility */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    To use CareerGate, you must:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Be at least 16 years of age (or 18 for certain services)</li>
                    <li>Provide accurate and truthful information</li>
                    <li>Agree to comply with all applicable laws and regulations</li>
                    <li>Not use the Service for any unlawful purposes</li>
                  </ul>
                  <p>
                    If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Services Description */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">3. Description of Services</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  CareerGate provides the following services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Job Listings:</strong> Aggregated job postings from various sources including government portals and private employers</li>
                  <li><strong>Bursary Information:</strong> Information about available bursaries and funding opportunities for students</li>
                  <li><strong>STEM Career Resources:</strong> Information and resources about careers in Science, Technology, Engineering, and Mathematics</li>
                  <li><strong>Career Guidance:</strong> General information to assist with career planning and job searching</li>
                </ul>
                <p className="font-medium text-foreground mt-4">
                  CareerGate is an information aggregator and does not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Employ anyone or make hiring decisions</li>
                  <li>Provide or administer bursaries</li>
                  <li>Guarantee employment or funding</li>
                  <li>Provide professional career counseling</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* User Conduct */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    When using CareerGate, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate information in any applications or registrations</li>
                    <li>Respect the intellectual property rights of CareerGate and third parties</li>
                    <li>Not attempt to gain unauthorized access to any part of the Service</li>
                    <li>Not use automated tools to scrape or collect data without permission</li>
                    <li>Not post or transmit any harmful, threatening, or unlawful content</li>
                    <li>Not impersonate any person or entity</li>
                    <li>Not interfere with the proper functioning of the Service</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Prohibited Activities */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Ban className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The following activities are strictly prohibited:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting fake job listings or bursary opportunities</li>
                    <li>Using the Service to conduct any fraudulent activities</li>
                    <li>Harvesting user data for spam or marketing purposes</li>
                    <li>Distributing malware or other harmful software</li>
                    <li>Attempting to reverse engineer the Service</li>
                    <li>Violating any applicable laws or regulations</li>
                    <li>Engaging in any activity that could harm CareerGate's reputation</li>
                  </ul>
                  <p className="font-medium text-foreground mt-4">
                    Violation of these prohibitions may result in immediate termination of access and potential legal action.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Intellectual Property */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The CareerGate name, logo, and all related trademarks, service marks, and logos are the property of CareerGate. You may not use these marks without our prior written consent.
                </p>
                <p>
                  The content on CareerGate, including but not limited to text, graphics, images, and software, is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without permission.
                </p>
                <p>
                  Job listings and bursary information displayed on our platform remain the property of their respective sources. CareerGate provides this information for informational purposes only.
                </p>
              </div>
            </div>
          </Card>

          {/* Disclaimer of Warranties */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">7. Disclaimer of Warranties</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="uppercase font-medium text-foreground">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                  </p>
                  <p>
                    We do not warrant that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The Service will be uninterrupted or error-free</li>
                    <li>The information provided is accurate, complete, or current</li>
                    <li>Any job listing or bursary opportunity will be available or suitable</li>
                    <li>The Service will meet your specific requirements</li>
                    <li>Any errors or defects will be corrected</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* Limitation of Liability */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <Scale className="w-8 h-8 text-secondary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    To the fullest extent permitted by applicable law, CareerGate shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
                  </p>
                  <p>
                    This includes, but is not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Loss of income or employment opportunities</li>
                    <li>Failed bursary applications</li>
                    <li>Data loss or corruption</li>
                    <li>Costs of substitute services</li>
                    <li>Any other commercial damages or losses</li>
                  </ul>
                  <p>
                    Our total liability shall not exceed the amount you paid to CareerGate, if any, in the twelve (12) months preceding the claim.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Indemnification */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">9. Indemnification</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  You agree to indemnify, defend, and hold harmless CareerGate and its officers, directors, employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or in any way connected with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Any content you submit or transmit through the Service</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Third-Party Links */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">10. Third-Party Links and Content</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  The Service may contain links to third-party websites or services that are not owned or controlled by CareerGate. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
                </p>
                <p>
                  You acknowledge and agree that CareerGate shall not be responsible or liable for any damage or loss caused by or in connection with the use of or reliance on any such third-party content, goods, or services.
                </p>
              </div>
            </div>
          </Card>

          {/* Termination */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">11. Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
              </div>
            </div>
          </Card>

          {/* Changes to Terms */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex items-start gap-4">
              <RefreshCw className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                  </p>
                  <p>
                    What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Governing Law */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the Republic of South Africa, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts located in Johannesburg, South Africa.
                </p>
                <p>
                  The Consumer Protection Act 68 of 2008 and the Protection of Personal Information Act 4 of 2013 (POPIA) shall apply to your use of the Service where applicable.
                </p>
              </div>
            </div>
          </Card>

          {/* Severability */}
          <Card className="p-6 md:p-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">14. Severability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be modified to the minimum extent necessary to make it valid and enforceable.
                </p>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <Mail className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold mb-4">15. Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have any questions about these Terms and Conditions, please contact us:
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

export default Terms;

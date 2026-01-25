import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const SAJobMarketGuide2026 = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/resources" className="text-muted-foreground hover:text-primary flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Career Resources
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">SA Job Market Guide 2026</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">Career Guide</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-4 h-4" />
                12 min read
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                January 2026
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              The Ultimate Guide to the South African Job Market in 2026
            </h1>

            {/* Intro */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              South Africa's job market is evolving rapidly, shaped by technological advances, economic pressures, and shifting global trends. This comprehensive guide analyzes current employment patterns, identifies the most in-demand skills, and provides actionable strategies for job seekers across all nine provinces.
            </p>

            {/* Featured Image Placeholder */}
            <div className="w-full h-64 md:h-80 bg-gradient-hero rounded-xl mb-10 flex items-center justify-center">
              <TrendingUp className="w-20 h-20 text-white/50" />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              
              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Overview: The State of Employment in South Africa
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                As of late 2025, South Africa's unemployment rate hovers around 32%, one of the highest globally. However, this statistic masks significant regional and sectoral variations. While traditional industries like mining and manufacturing have shed jobs, the digital economy, renewable energy sector, and healthcare industries are experiencing robust growth. Understanding these dynamics is crucial for positioning yourself effectively in the job market.
              </p>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                The South African government's infrastructure investment programmes, combined with private sector initiatives in green energy and technology, are creating new employment opportunities. The key for job seekers is to align their skills with these emerging sectors while remaining adaptable to changing market conditions.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                Provincial Job Market Analysis
              </h2>

              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3">Gauteng Province</h3>
                <p className="text-muted-foreground mb-4">
                  As South Africa's economic hub, Gauteng accounts for approximately 35% of the national GDP. Johannesburg remains the financial services capital, with significant opportunities in banking, insurance, and fintech. Pretoria, as the administrative capital, offers numerous government positions, while the Midrand corridor has emerged as a technology and logistics hub.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Average Salary: R25,000 - R45,000</Badge>
                  <Badge variant="outline">Top Sectors: Finance, Tech, Government</Badge>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3">Western Cape</h3>
                <p className="text-muted-foreground mb-4">
                  Cape Town has established itself as Africa's tech startup capital, with a thriving ecosystem of technology companies, venture capital firms, and innovation hubs. The province also benefits from strong tourism, agriculture, and film industries. The Western Cape generally offers better quality of life metrics but higher living costs than other provinces.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Average Salary: R22,000 - R40,000</Badge>
                  <Badge variant="outline">Top Sectors: Tech, Tourism, Agriculture</Badge>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3">KwaZulu-Natal</h3>
                <p className="text-muted-foreground mb-4">
                  Durban serves as South Africa's primary port city, driving significant logistics and maritime industry employment. The province also has a strong manufacturing base, particularly in automotive and textiles. Healthcare and education sectors provide stable employment, while tourism along the coast creates seasonal opportunities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Average Salary: R18,000 - R35,000</Badge>
                  <Badge variant="outline">Top Sectors: Logistics, Manufacturing, Tourism</Badge>
                </div>
              </Card>

              <Card className="p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3">Other Provinces</h3>
                <p className="text-muted-foreground mb-4">
                  <strong>Eastern Cape:</strong> Automotive manufacturing (Port Elizabeth/Gqeberha), agriculture, and renewable energy projects are primary employers.<br/>
                  <strong>Limpopo & Mpumalanga:</strong> Mining, agriculture, and eco-tourism dominate, with growing opportunities in renewable energy.<br/>
                  <strong>Free State:</strong> Agriculture, mining, and logistics provide core employment.<br/>
                  <strong>North West:</strong> Platinum mining remains significant, alongside emerging green energy projects.<br/>
                  <strong>Northern Cape:</strong> Mining and large-scale solar energy projects offer specialized opportunities.
                </p>
              </Card>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Most In-Demand Skills for 2026
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Based on analysis of job postings, employer surveys, and economic forecasts, the following skills are most sought after by South African employers:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Card className="p-5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Technical Skills
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Software Development (Python, JavaScript, Java)</li>
                    <li>• Data Analytics and Data Science</li>
                    <li>• Cybersecurity and Information Security</li>
                    <li>• Cloud Computing (AWS, Azure, Google Cloud)</li>
                    <li>• Artificial Intelligence and Machine Learning</li>
                    <li>• Renewable Energy Systems (Solar, Wind)</li>
                    <li>• Project Management (Agile, Scrum)</li>
                  </ul>
                </Card>

                <Card className="p-5">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Soft Skills
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Critical Thinking and Problem Solving</li>
                    <li>• Communication and Presentation</li>
                    <li>• Adaptability and Resilience</li>
                    <li>• Emotional Intelligence</li>
                    <li>• Cross-cultural Competence</li>
                    <li>• Leadership and Team Management</li>
                    <li>• Time Management and Organization</li>
                  </ul>
                </Card>
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                Salary Expectations by Sector
              </h2>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Salary expectations vary significantly by industry, experience level, and location. Here are general ranges for entry to mid-level positions in key sectors:
              </p>

              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border p-3 text-left font-semibold">Sector</th>
                      <th className="border p-3 text-left font-semibold">Entry Level</th>
                      <th className="border p-3 text-left font-semibold">Mid-Level</th>
                      <th className="border p-3 text-left font-semibold">Senior</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border p-3">Information Technology</td>
                      <td className="border p-3">R15,000 - R25,000</td>
                      <td className="border p-3">R35,000 - R55,000</td>
                      <td className="border p-3">R65,000 - R120,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Financial Services</td>
                      <td className="border p-3">R18,000 - R28,000</td>
                      <td className="border p-3">R40,000 - R60,000</td>
                      <td className="border p-3">R70,000 - R150,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Healthcare</td>
                      <td className="border p-3">R12,000 - R20,000</td>
                      <td className="border p-3">R25,000 - R45,000</td>
                      <td className="border p-3">R50,000 - R100,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Engineering</td>
                      <td className="border p-3">R20,000 - R30,000</td>
                      <td className="border p-3">R40,000 - R60,000</td>
                      <td className="border p-3">R70,000 - R130,000</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Government</td>
                      <td className="border p-3">R12,000 - R18,000</td>
                      <td className="border p-3">R22,000 - R35,000</td>
                      <td className="border p-3">R40,000 - R80,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Card className="p-6 bg-primary/5 border-primary/20 mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Key Takeaways for Job Seekers
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li>• <strong>Invest in Digital Skills:</strong> Even non-tech roles increasingly require digital literacy. Consider online courses in data analysis, digital marketing, or basic coding.</li>
                  <li>• <strong>Be Geographically Flexible:</strong> While Gauteng and Western Cape offer the most opportunities, consider emerging markets in other provinces where competition may be lower.</li>
                  <li>• <strong>Network Actively:</strong> Up to 70% of jobs in South Africa are filled through networks and referrals. Build your LinkedIn presence and attend industry events.</li>
                  <li>• <strong>Consider Learnerships and Internships:</strong> These programmes provide valuable experience and often lead to permanent employment.</li>
                  <li>• <strong>Stay Informed:</strong> Follow industry news and CareerGate's resources to stay updated on market trends and opportunities.</li>
                </ul>
              </Card>

              <div className="bg-gradient-hero rounded-xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Job Search?</h3>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Browse thousands of verified job listings across South Africa, including government positions, learnerships, and graduate programmes.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/jobs">
                    <Button size="lg" variant="secondary">
                      Browse All Jobs
                    </Button>
                  </Link>
                  <Link to="/jobs?category=government">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Government Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default SAJobMarketGuide2026;

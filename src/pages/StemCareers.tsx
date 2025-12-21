import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Cpu, 
  Microscope, 
  Calculator, 
  Wrench,
  TrendingUp,
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
  Building2,
  GraduationCap
} from "lucide-react";

const StemCareers = () => {
  const categories = [
    { id: "technology", name: "Technology", icon: Code },
    { id: "engineering", name: "Engineering", icon: Wrench },
    { id: "science", name: "Science", icon: Microscope },
    { id: "mathematics", name: "Mathematics", icon: Calculator },
  ];

  const careers = {
    technology: [
      {
        title: "Software Developer",
        salary: { entry: "R250,000", mid: "R550,000", senior: "R900,000+" },
        demand: "Very High",
        skills: ["JavaScript/TypeScript", "Python", "React/Angular", "SQL", "Git", "Problem-solving", "Teamwork"],
        dailyTasks: [
          "Writing and reviewing code",
          "Debugging and fixing software issues",
          "Attending team stand-ups and planning meetings",
          "Collaborating with designers and product managers",
          "Testing and deploying applications",
          "Learning new technologies and frameworks",
        ],
        education: "BSc Computer Science, Software Engineering, or relevant diploma. Self-taught paths are increasingly accepted.",
        growth: "Junior Developer → Mid-Level → Senior → Lead/Architect → Engineering Manager or CTO",
        companies: ["FNB", "Takealot", "Amazon AWS", "Microsoft", "Capitec", "Discovery"],
      },
      {
        title: "Data Scientist",
        salary: { entry: "R350,000", mid: "R650,000", senior: "R1,200,000+" },
        demand: "Very High",
        skills: ["Python/R", "Machine Learning", "SQL", "Statistics", "TensorFlow/PyTorch", "Data Visualization", "Communication"],
        dailyTasks: [
          "Analyzing large datasets for insights",
          "Building and training machine learning models",
          "Creating dashboards and data visualizations",
          "Presenting findings to stakeholders",
          "Cleaning and preprocessing data",
          "Collaborating with business teams on data strategy",
        ],
        education: "BSc/MSc in Data Science, Statistics, Mathematics, or Computer Science",
        growth: "Junior Data Scientist → Senior → Lead Data Scientist → Head of Data/Chief Data Officer",
        companies: ["Standard Bank", "Woolworths", "Vodacom", "Netflix SA", "Meta", "BCX"],
      },
      {
        title: "Cybersecurity Analyst",
        salary: { entry: "R300,000", mid: "R550,000", senior: "R850,000+" },
        demand: "Very High",
        skills: ["Network Security", "Ethical Hacking", "SIEM Tools", "Risk Assessment", "Python", "Security Certifications (CISSP, CEH)"],
        dailyTasks: [
          "Monitoring security systems and alerts",
          "Investigating security incidents",
          "Conducting vulnerability assessments",
          "Implementing security policies",
          "Training staff on security awareness",
          "Writing security reports and recommendations",
        ],
        education: "BSc Cybersecurity, Computer Science with security focus, or industry certifications",
        growth: "Security Analyst → Senior Analyst → Security Engineer → CISO",
        companies: ["Absa", "Deloitte", "PWC", "KPMG", "Dimension Data", "MTN"],
      },
      {
        title: "Cloud Engineer",
        salary: { entry: "R400,000", mid: "R700,000", senior: "R1,100,000+" },
        demand: "Very High",
        skills: ["AWS/Azure/GCP", "Docker", "Kubernetes", "Terraform", "Linux", "Networking", "Scripting"],
        dailyTasks: [
          "Designing cloud infrastructure",
          "Deploying and managing cloud services",
          "Automating infrastructure provisioning",
          "Monitoring system performance",
          "Optimizing cloud costs",
          "Ensuring security and compliance",
        ],
        education: "BSc Computer Science or IT with cloud certifications (AWS Solutions Architect, Azure Administrator)",
        growth: "Cloud Engineer → Senior Cloud Engineer → Cloud Architect → Head of Cloud",
        companies: ["Microsoft", "AWS", "Google", "Accenture", "EOH", "BCG"],
      },
      {
        title: "UX/UI Designer",
        salary: { entry: "R220,000", mid: "R450,000", senior: "R700,000+" },
        demand: "High",
        skills: ["Figma/Sketch", "User Research", "Prototyping", "Design Systems", "HTML/CSS", "Communication", "Empathy"],
        dailyTasks: [
          "Conducting user research and interviews",
          "Creating wireframes and prototypes",
          "Designing user interfaces",
          "Testing designs with users",
          "Collaborating with developers",
          "Maintaining design systems",
        ],
        education: "Diploma/Degree in Design, Human-Computer Interaction, or relevant bootcamp with portfolio",
        growth: "Junior Designer → Senior Designer → Lead Designer → Head of Design/Design Director",
        companies: ["Takealot", "Showmax", "Luno", "Standard Bank", "Discovery", "Yoco"],
      },
    ],
    engineering: [
      {
        title: "Civil Engineer",
        salary: { entry: "R320,000", mid: "R550,000", senior: "R850,000+" },
        demand: "High",
        skills: ["AutoCAD", "Structural Analysis", "Project Management", "Geotechnical Knowledge", "Construction Materials", "Building Codes"],
        dailyTasks: [
          "Designing infrastructure projects",
          "Reviewing technical drawings",
          "Conducting site inspections",
          "Managing project timelines and budgets",
          "Liaising with contractors and clients",
          "Ensuring compliance with safety regulations",
        ],
        education: "BSc/BEng Civil Engineering (4 years) + ECSA registration",
        growth: "Graduate Engineer → Professional Engineer → Project Manager → Director/Partner",
        companies: ["AECOM", "Aurecon", "Murray & Roberts", "WBHO", "Stefanutti Stocks"],
      },
      {
        title: "Electrical Engineer",
        salary: { entry: "R300,000", mid: "R520,000", senior: "R800,000+" },
        demand: "High",
        skills: ["Circuit Design", "Power Systems", "PLC Programming", "AutoCAD Electrical", "Renewable Energy", "Project Management"],
        dailyTasks: [
          "Designing electrical systems",
          "Testing equipment and components",
          "Troubleshooting electrical issues",
          "Creating technical documentation",
          "Supervising installations",
          "Ensuring safety compliance",
        ],
        education: "BSc/BEng Electrical Engineering (4 years) + ECSA registration",
        growth: "Graduate Engineer → Professional Engineer → Senior Engineer → Technical Director",
        companies: ["Eskom", "ABB", "Siemens", "Schneider Electric", "City Power"],
      },
      {
        title: "Mechanical Engineer",
        salary: { entry: "R320,000", mid: "R500,000", senior: "R780,000+" },
        demand: "High",
        skills: ["CAD/CAM", "Thermodynamics", "Materials Science", "Manufacturing Processes", "HVAC", "Project Management"],
        dailyTasks: [
          "Designing mechanical systems and components",
          "Conducting stress and thermal analysis",
          "Overseeing manufacturing processes",
          "Testing prototypes",
          "Optimizing equipment performance",
          "Managing maintenance schedules",
        ],
        education: "BSc/BEng Mechanical Engineering (4 years) + ECSA registration",
        growth: "Graduate Engineer → Professional Engineer → Senior Engineer → Engineering Manager",
        companies: ["Toyota SA", "Sasol", "ArcelorMittal", "Denel", "Bell Equipment"],
      },
      {
        title: "Chemical Engineer",
        salary: { entry: "R380,000", mid: "R600,000", senior: "R950,000+" },
        demand: "Medium-High",
        skills: ["Process Design", "Chemical Reactions", "Simulation Software", "Safety Management", "Quality Control", "Environmental Compliance"],
        dailyTasks: [
          "Designing chemical processes",
          "Optimizing production efficiency",
          "Ensuring safety and environmental compliance",
          "Troubleshooting process issues",
          "Managing production teams",
          "Conducting laboratory tests",
        ],
        education: "BSc/BEng Chemical Engineering (4 years) + ECSA registration",
        growth: "Graduate Engineer → Process Engineer → Senior Engineer → Plant Manager",
        companies: ["Sasol", "PetroSA", "AECI", "Omnia", "Sappi"],
      },
      {
        title: "Mining Engineer",
        salary: { entry: "R400,000", mid: "R700,000", senior: "R1,200,000+" },
        demand: "High",
        skills: ["Mine Planning", "Rock Mechanics", "Ventilation Systems", "Safety Management", "Geology", "Equipment Operation"],
        dailyTasks: [
          "Planning and designing mine layouts",
          "Ensuring worker safety underground",
          "Managing extraction operations",
          "Analyzing ore samples and production",
          "Supervising mining teams",
          "Implementing environmental protocols",
        ],
        education: "BSc/BEng Mining Engineering (4 years) + ECSA registration + Mine Manager's Certificate",
        growth: "Graduate Engineer → Section Manager → Mine Captain → Mine Manager → General Manager",
        companies: ["Anglo American", "Sibanye-Stillwater", "Harmony Gold", "Impala Platinum", "Kumba Iron Ore"],
      },
    ],
    science: [
      {
        title: "Biomedical Scientist",
        salary: { entry: "R280,000", mid: "R450,000", senior: "R650,000+" },
        demand: "Medium-High",
        skills: ["Laboratory Techniques", "Molecular Biology", "Data Analysis", "Research Methods", "Quality Assurance", "Scientific Writing"],
        dailyTasks: [
          "Conducting laboratory experiments",
          "Analyzing biological samples",
          "Maintaining lab equipment",
          "Writing research reports",
          "Collaborating on research projects",
          "Ensuring compliance with lab protocols",
        ],
        education: "BSc Biomedical Science or Biotechnology + HPCSA registration",
        growth: "Junior Scientist → Senior Scientist → Lab Manager → Research Director",
        companies: ["NHLS", "Lancet Laboratories", "PathCare", "CSIR", "Pharmaceutical companies"],
      },
      {
        title: "Environmental Scientist",
        salary: { entry: "R250,000", mid: "R420,000", senior: "R600,000+" },
        demand: "Growing",
        skills: ["Environmental Assessment", "GIS", "Water Quality Analysis", "Ecology", "Report Writing", "Environmental Law"],
        dailyTasks: [
          "Conducting environmental impact assessments",
          "Collecting and analyzing field samples",
          "Writing environmental reports",
          "Advising on environmental regulations",
          "Monitoring pollution levels",
          "Developing sustainability strategies",
        ],
        education: "BSc Environmental Science or related field + SACNASP registration",
        growth: "Junior Scientist → Environmental Consultant → Senior Consultant → Director",
        companies: ["SRK Consulting", "WSP", "ERM", "Golder", "DEA"],
      },
      {
        title: "Research Scientist",
        salary: { entry: "R300,000", mid: "R500,000", senior: "R750,000+" },
        demand: "Medium",
        skills: ["Research Methodology", "Data Analysis", "Scientific Writing", "Grant Writing", "Presentation Skills", "Critical Thinking"],
        dailyTasks: [
          "Designing and conducting experiments",
          "Analyzing research data",
          "Writing papers for publication",
          "Presenting at conferences",
          "Applying for research grants",
          "Mentoring junior researchers",
        ],
        education: "MSc or PhD in relevant scientific field",
        growth: "Postdoctoral Researcher → Senior Researcher → Principal Scientist → Research Director",
        companies: ["CSIR", "ARC", "Universities", "MRC", "NRF"],
      },
      {
        title: "Pharmacist",
        salary: { entry: "R350,000", mid: "R500,000", senior: "R750,000+" },
        demand: "High",
        skills: ["Pharmacology", "Patient Care", "Drug Interactions", "Compounding", "Regulatory Compliance", "Communication"],
        dailyTasks: [
          "Dispensing medications",
          "Advising patients on medication use",
          "Checking prescriptions for accuracy",
          "Managing inventory",
          "Collaborating with healthcare providers",
          "Ensuring regulatory compliance",
        ],
        education: "BPharm (4 years) + SAPC registration + internship",
        growth: "Pharmacist → Senior Pharmacist → Pharmacy Manager → District Manager → Clinical Director",
        companies: ["Dis-Chem", "Clicks", "Hospitals", "Pharmaceutical companies"],
      },
    ],
    mathematics: [
      {
        title: "Actuary",
        salary: { entry: "R500,000", mid: "R900,000", senior: "R2,000,000+" },
        demand: "High",
        skills: ["Statistical Analysis", "Risk Assessment", "Financial Modeling", "Programming (R/Python)", "Communication", "Business Acumen"],
        dailyTasks: [
          "Building financial models",
          "Analyzing risk and uncertainty",
          "Pricing insurance products",
          "Preparing regulatory reports",
          "Advising on business strategy",
          "Presenting to stakeholders",
        ],
        education: "BSc Actuarial Science + ASSA/FASSA qualification (typically 8-10 years total)",
        growth: "Student Actuary → Nearly Qualified → Qualified Actuary → Senior Manager → Chief Actuary",
        companies: ["Discovery", "Old Mutual", "Sanlam", "Liberty", "Hollard"],
      },
      {
        title: "Statistician",
        salary: { entry: "R320,000", mid: "R520,000", senior: "R750,000+" },
        demand: "Medium-High",
        skills: ["Statistical Software (R, SAS, SPSS)", "Data Analysis", "Research Design", "Report Writing", "Survey Methodology", "Mathematics"],
        dailyTasks: [
          "Designing surveys and experiments",
          "Analyzing statistical data",
          "Creating statistical models",
          "Writing technical reports",
          "Presenting findings to non-technical audiences",
          "Quality assurance of data",
        ],
        education: "BSc/MSc Statistics or Mathematical Statistics",
        growth: "Junior Statistician → Senior Statistician → Lead Statistician → Head of Statistics",
        companies: ["Stats SA", "Banks", "Research organizations", "SAMRC", "Consulting firms"],
      },
      {
        title: "Quantitative Analyst (Quant)",
        salary: { entry: "R480,000", mid: "R850,000", senior: "R1,500,000+" },
        demand: "High",
        skills: ["Mathematical Modeling", "Programming (Python, C++)", "Financial Markets", "Stochastic Calculus", "Machine Learning", "Risk Management"],
        dailyTasks: [
          "Developing trading algorithms",
          "Building risk models",
          "Analyzing market data",
          "Backtesting strategies",
          "Collaborating with traders",
          "Researching new modeling techniques",
        ],
        education: "MSc/PhD in Mathematics, Physics, Financial Mathematics, or related quantitative field",
        growth: "Junior Quant → Senior Quant → Lead Quant → Head of Quant Research",
        companies: ["Goldman Sachs", "Morgan Stanley", "Investec", "Rand Merchant Bank", "Hedge funds"],
      },
      {
        title: "Operations Research Analyst",
        salary: { entry: "R350,000", mid: "R550,000", senior: "R800,000+" },
        demand: "Medium",
        skills: ["Optimization", "Simulation", "Linear Programming", "Data Analysis", "Problem Solving", "Business Understanding"],
        dailyTasks: [
          "Analyzing business problems",
          "Building optimization models",
          "Running simulations",
          "Recommending operational improvements",
          "Presenting findings to management",
          "Implementing solutions",
        ],
        education: "BSc/MSc Operations Research, Industrial Engineering, or Applied Mathematics",
        growth: "Analyst → Senior Analyst → Manager → Director of Operations Research",
        companies: ["Consulting firms", "Airlines", "Logistics companies", "Banks", "Retailers"],
      },
    ],
  };

  const whyStem = [
    {
      icon: TrendingUp,
      title: "High Demand",
      description: "South Africa faces a critical shortage of STEM professionals, meaning job security and competitive salaries.",
    },
    {
      icon: DollarSign,
      title: "Above-Average Pay",
      description: "STEM careers consistently offer salaries 40-100% higher than the national average.",
    },
    {
      icon: GraduationCap,
      title: "Bursary Opportunities",
      description: "More bursaries are available for STEM fields than any other discipline in South Africa.",
    },
    {
      icon: Building2,
      title: "Global Opportunities",
      description: "STEM skills are universally valued, opening doors to international careers and remote work.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <Cpu className="w-16 h-16 mx-auto mb-6 text-white" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              STEM Careers in South Africa
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              Explore detailed career information including realistic salaries, required skills, daily tasks, and growth paths for Science, Technology, Engineering, and Mathematics careers.
            </p>
          </div>
        </section>

        {/* Why STEM */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose a STEM Career?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              STEM careers offer unparalleled opportunities for growth, impact, and financial success in South Africa's evolving economy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyStem.map((reason) => (
              <Card key={reason.title} className="p-6 text-center hover:shadow-lg transition-shadow">
                <reason.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold text-lg mb-2">{reason.title}</h3>
                <p className="text-sm text-muted-foreground">{reason.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Career Explorer */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Explore STEM Careers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Click on each category to discover detailed career information.
              </p>
            </div>

            <Tabs defaultValue="technology" className="max-w-6xl mx-auto">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto mb-8">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 py-3"
                  >
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(careers).map(([categoryId, categoryCards]) => (
                <TabsContent key={categoryId} value={categoryId} className="space-y-6">
                  {categoryCards.map((career) => (
                    <Card key={career.title} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">{career.title}</h3>
                          <Badge variant={career.demand === "Very High" ? "default" : career.demand === "High" ? "secondary" : "outline"}>
                            {career.demand} Demand
                          </Badge>
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-primary" />
                          Salary Range (Annual)
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Entry Level</p>
                            <p className="font-bold text-lg">{career.salary.entry}</p>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Mid-Level</p>
                            <p className="font-bold text-lg">{career.salary.mid}</p>
                          </div>
                          <div className="bg-primary/10 p-4 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Senior Level</p>
                            <p className="font-bold text-lg text-primary">{career.salary.senior}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* Skills */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {career.skills.map((skill) => (
                              <Badge key={skill} variant="outline">{skill}</Badge>
                            ))}
                          </div>
                        </div>

                        {/* Daily Tasks */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            A Day in the Life
                          </h4>
                          <ul className="space-y-1">
                            {career.dailyTasks.slice(0, 4).map((task, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Education */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          Education Path
                        </h4>
                        <p className="text-sm text-muted-foreground">{career.education}</p>
                      </div>

                      {/* Career Growth */}
                      <div className="mb-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          Career Progression
                        </h4>
                        <p className="text-sm text-muted-foreground">{career.growth}</p>
                      </div>

                      {/* Companies */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-primary" />
                          Top Employers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {career.companies.map((company) => (
                            <Badge key={company} variant="secondary">{company}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Skills Development */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Start Your STEM Journey</h2>
              <p className="text-muted-foreground">
                Resources to help you build the skills needed for a successful STEM career.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Free Online Courses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Platforms like Coursera, edX, and Khan Academy offer free STEM courses.
                </p>
                <a href="/bursaries" className="text-primary text-sm font-medium hover:underline">
                  Find Bursaries →
                </a>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Code className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Coding Bootcamps</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Intensive programs like WeThinkCode and Umuzi offer free tech training.
                </p>
                <a href="/jobs" className="text-primary text-sm font-medium hover:underline">
                  Browse Tech Jobs →
                </a>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Internships</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Gain practical experience through internships and learnerships.
                </p>
                <a href="/jobs?type=internship" className="text-primary text-sm font-medium hover:underline">
                  Find Internships →
                </a>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-hero py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your STEM Career?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto mb-8">
              Browse our latest job listings and bursary opportunities in STEM fields.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/jobs" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-primary hover:bg-white/90 h-10 px-6">
                Browse STEM Jobs
              </a>
              <a href="/bursaries" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-white text-white hover:bg-white/10 h-10 px-6">
                STEM Bursaries
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StemCareers;

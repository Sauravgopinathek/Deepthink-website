import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Target, 
  TrendingUp, 
  Code, 
  Database, 
  Smartphone, 
  Globe, 
  Shield, 
  Brain, 
  Cpu, 
  ChevronRight, 
  ChevronDown,
  Star,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Award,
  Briefcase,
  Lightbulb,
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  GraduationCap,
  Palette,
  BarChart3,
  Megaphone,
  Building,
  Wrench,
  Camera,
  Gamepad2,
  Microscope,
  Stethoscope,
  Calculator,
  Plane,
  Factory,
  Truck,
  Wifi,
  Radio,
  Cog,
  Layers,
  Monitor,
  Server,
  Cloud,
  Lock,
  Search,
  PieChart,
  TrendingDown,
  Headphones,
  Video,
  Edit,
  FileText,
  Settings,
  Rocket,
  Atom,
  Beaker,
  Zap as Lightning,
  Wind,
  Sun,
  Leaf,
  Home,
  Car,
  Ship,
  Satellite
} from 'lucide-react';

interface CareerPath {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  averageSalary: string;
  jobGrowth: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToMaster: string;
  skills: string[];
  roadmap: RoadmapStep[];
  companies: string[];
  jobTitles: string[];
  prerequisites: string[];
  certifications: string[];
  projects: string[];
  resources: Resource[];
  category: string;
  trending?: boolean;
  remote?: boolean;
}

interface RoadmapStep {
  phase: string;
  duration: string;
  title: string;
  description: string;
  skills: string[];
  projects: string[];
  milestones: string[];
  courses?: string[];
  books?: string[];
}

interface Resource {
  type: 'course' | 'book' | 'website' | 'certification' | 'youtube' | 'bootcamp';
  title: string;
  provider: string;
  url?: string;
  free: boolean;
  rating?: number;
}

const CareerRoadmap: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'resources'>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const careerPaths: CareerPath[] = [
    // Software Development & Engineering
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      icon: Code,
      category: 'Software Development',
      description: 'Build applications, websites, and software systems that power the digital world.',
      averageSalary: '₹8-25 LPA',
      jobGrowth: '+22%',
      difficulty: 'Intermediate',
      timeToMaster: '2-3 years',
      trending: true,
      remote: true,
      skills: ['Programming Languages', 'Data Structures', 'Algorithms', 'System Design', 'Version Control', 'Testing', 'Debugging'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Flipkart', 'Zomato', 'Paytm', 'BYJU\'S'],
      jobTitles: ['Software Developer', 'Full Stack Developer', 'Backend Engineer', 'Frontend Engineer', 'Senior Software Engineer', 'Tech Lead'],
      prerequisites: ['Basic Programming Knowledge', 'Problem-Solving Skills', 'Mathematics Fundamentals', 'Computer Science Basics'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional', 'Microsoft Azure Developer', 'Oracle Java Certification'],
      projects: ['E-commerce Website', 'Chat Application', 'Task Management System', 'API Development', 'Social Media Clone'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '3-6 months',
          title: 'Programming Fundamentals',
          description: 'Master core programming concepts and your first language',
          skills: ['Python/Java/JavaScript', 'Basic Data Structures', 'Problem Solving', 'Git/GitHub', 'IDE Usage'],
          projects: ['Calculator App', 'To-Do List', 'Simple Games', 'Basic CRUD App'],
          milestones: ['Complete 100 coding problems', 'Build 3 basic projects', 'Learn Git basics', 'Understand OOP concepts'],
          courses: ['CS50 Introduction to Computer Science', 'Python for Everybody', 'Java Programming Masterclass'],
          books: ['Clean Code', 'Code Complete', 'The Pragmatic Programmer']
        },
        {
          phase: 'Intermediate',
          duration: '6-12 months',
          title: 'Advanced Programming & Web Development',
          description: 'Learn advanced concepts and web technologies',
          skills: ['Advanced Data Structures', 'Algorithms', 'Web Development', 'Databases', 'APIs', 'Frameworks'],
          projects: ['Personal Portfolio', 'Blog Website', 'REST API', 'Database-driven App', 'Real-time Chat App'],
          milestones: ['Master algorithms', 'Build full-stack application', 'Deploy projects online', 'Contribute to open source'],
          courses: ['The Complete Web Developer Course', 'Data Structures and Algorithms', 'Database Design'],
          books: ['Introduction to Algorithms', 'Designing Data-Intensive Applications', 'You Don\'t Know JS']
        },
        {
          phase: 'Advanced',
          duration: '6-12 months',
          title: 'System Design & Specialization',
          description: 'Learn system design and choose your specialization',
          skills: ['System Design', 'Cloud Platforms', 'DevOps Basics', 'Testing', 'Security', 'Performance Optimization'],
          projects: ['Scalable Web App', 'Microservices Project', 'Cloud Deployment', 'Load Testing'],
          milestones: ['Design scalable systems', 'Master cloud platforms', 'Implement CI/CD', 'Handle high traffic'],
          courses: ['System Design Interview', 'AWS Solutions Architect', 'Microservices Architecture'],
          books: ['Designing Distributed Systems', 'Building Microservices', 'Site Reliability Engineering']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry Experience & Growth',
          description: 'Gain professional experience and advance your career',
          skills: ['Leadership', 'Mentoring', 'Architecture', 'Business Understanding', 'Project Management'],
          projects: ['Enterprise Applications', 'Team Leadership', 'Technical Architecture', 'Open Source Contributions'],
          milestones: ['Land first job', 'Lead a project', 'Mentor junior developers', 'Become tech lead'],
          courses: ['Technical Leadership', 'Software Architecture', 'Engineering Management'],
          books: ['The Manager\'s Path', 'Staff Engineer', 'The Phoenix Project']
        }
      ],
      resources: [
        { type: 'course', title: 'Complete Web Development Bootcamp', provider: 'Udemy', free: false, rating: 4.7 },
        { type: 'website', title: 'FreeCodeCamp', provider: 'FreeCodeCamp', free: true, rating: 4.8 },
        { type: 'book', title: 'Clean Code', provider: 'Robert C. Martin', free: false, rating: 4.6 },
        { type: 'certification', title: 'AWS Certified Developer', provider: 'Amazon', free: false, rating: 4.5 },
        { type: 'youtube', title: 'Programming with Mosh', provider: 'YouTube', free: true, rating: 4.9 }
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      icon: Database,
      category: 'Data & Analytics',
      description: 'Extract insights from data to drive business decisions and solve complex problems.',
      averageSalary: '₹10-30 LPA',
      jobGrowth: '+35%',
      difficulty: 'Advanced',
      timeToMaster: '3-4 years',
      trending: true,
      remote: true,
      skills: ['Python/R', 'Statistics', 'Machine Learning', 'Data Visualization', 'SQL', 'Big Data', 'Deep Learning'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Uber', 'Airbnb', 'Flipkart', 'Ola', 'Swiggy', 'PhonePe'],
      jobTitles: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'Research Scientist', 'AI Engineer', 'Data Engineer'],
      prerequisites: ['Strong Mathematics', 'Statistics Knowledge', 'Programming Basics', 'Analytical Thinking'],
      certifications: ['Google Data Analytics', 'IBM Data Science', 'Microsoft Azure Data Scientist', 'Coursera ML Specialization'],
      projects: ['Predictive Analytics', 'Recommendation System', 'NLP Project', 'Computer Vision', 'Time Series Analysis'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '4-6 months',
          title: 'Mathematics & Programming',
          description: 'Build strong foundation in math, statistics, and programming',
          skills: ['Python', 'Statistics', 'Linear Algebra', 'Calculus', 'Probability', 'SQL', 'Excel'],
          projects: ['Statistical Analysis', 'Data Cleaning Project', 'Basic Visualizations', 'SQL Queries'],
          milestones: ['Master Python basics', 'Complete statistics course', 'Analyze real datasets', 'Build first dashboard'],
          courses: ['Python for Data Science', 'Statistics for Data Science', 'SQL for Data Analysis'],
          books: ['Think Stats', 'Python for Data Analysis', 'The Elements of Statistical Learning']
        },
        {
          phase: 'Intermediate',
          duration: '6-9 months',
          title: 'Machine Learning & Data Analysis',
          description: 'Learn ML algorithms and data analysis techniques',
          skills: ['Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Data Visualization', 'Feature Engineering'],
          projects: ['Prediction Model', 'Classification Project', 'Clustering Analysis', 'A/B Testing'],
          milestones: ['Build ML models', 'Master data manipulation', 'Create compelling visualizations', 'Deploy first model'],
          courses: ['Machine Learning Course by Andrew Ng', 'Data Visualization with Python', 'Feature Engineering'],
          books: ['Hands-On Machine Learning', 'Pattern Recognition and Machine Learning', 'The Art of Statistics']
        },
        {
          phase: 'Advanced',
          duration: '6-12 months',
          title: 'Deep Learning & Specialization',
          description: 'Advanced ML techniques and domain specialization',
          skills: ['Deep Learning', 'TensorFlow/PyTorch', 'NLP', 'Computer Vision', 'Big Data', 'MLOps'],
          projects: ['Neural Network Project', 'NLP Application', 'Computer Vision System', 'Big Data Pipeline'],
          milestones: ['Master deep learning', 'Specialize in domain', 'Publish research/blog', 'Build production system'],
          courses: ['Deep Learning Specialization', 'Natural Language Processing', 'Computer Vision', 'MLOps'],
          books: ['Deep Learning', 'Natural Language Processing with Python', 'Computer Vision: Algorithms and Applications']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry Application & Leadership',
          description: 'Apply skills in industry and grow into leadership roles',
          skills: ['Business Acumen', 'Communication', 'Project Management', 'Team Leadership', 'Strategy'],
          projects: ['Business Impact Projects', 'Cross-functional Collaboration', 'Data Strategy', 'Team Management'],
          milestones: ['Land data science role', 'Drive business decisions', 'Lead data team', 'Become domain expert'],
          courses: ['Data Science for Business', 'Leadership in Tech', 'Strategic Thinking'],
          books: ['Lean Analytics', 'Data Science for Business', 'The Signal and the Noise']
        }
      ],
      resources: [
        { type: 'course', title: 'Machine Learning Course', provider: 'Andrew Ng - Coursera', free: false, rating: 4.9 },
        { type: 'book', title: 'Hands-On Machine Learning', provider: "Aurélien Géron", free: false, rating: 4.7 },
        { type: 'website', title: 'Kaggle Learn', provider: 'Kaggle', free: true, rating: 4.6 },
        { type: 'certification', title: 'Google Data Analytics Certificate', provider: 'Google', free: false, rating: 4.5 },
        { type: 'bootcamp', title: 'Data Science Bootcamp', provider: 'Springboard', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      icon: Target,
      category: 'Product & Strategy',
      description: 'Drive product strategy, roadmap, and execution to deliver user-centric solutions.',
      averageSalary: '₹12-35 LPA',
      jobGrowth: '+28%',
      difficulty: 'Advanced',
      timeToMaster: '3-5 years',
      trending: true,
      remote: true,
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Roadmapping', 'Stakeholder Management', 'Agile/Scrum'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Airbnb', 'Flipkart', 'Zomato', 'Razorpay'],
      jobTitles: ['Product Manager', 'Senior Product Manager', 'Principal PM', 'VP Product', 'Chief Product Officer'],
      prerequisites: ['Business Understanding', 'Analytical Thinking', 'Communication Skills', 'Technical Awareness'],
      certifications: ['Google PM Certificate', 'Product Management by Duke', 'Certified Scrum Product Owner'],
      projects: ['Product Launch', 'Feature Development', 'User Research Study', 'Product Roadmap', 'A/B Testing'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '3-4 months',
          title: 'Product Management Basics',
          description: 'Learn fundamental PM concepts and frameworks',
          skills: ['Product Thinking', 'User Research', 'Market Analysis', 'Basic Analytics', 'Communication'],
          projects: ['Product Analysis', 'User Interview', 'Competitive Research', 'Feature Proposal'],
          milestones: ['Understand PM role', 'Complete user research', 'Analyze competitor products', 'Present insights'],
          courses: ['Introduction to Product Management', 'User Experience Research', 'Product Analytics'],
          books: ['Inspired', 'The Lean Startup', 'Hooked']
        },
        {
          phase: 'Intermediate',
          duration: '6-8 months',
          title: 'Strategy & Execution',
          description: 'Develop strategic thinking and execution skills',
          skills: ['Product Strategy', 'Roadmapping', 'Prioritization', 'Agile/Scrum', 'Data Analysis', 'Stakeholder Management'],
          projects: ['Product Roadmap', 'Feature Prioritization', 'Go-to-Market Strategy', 'Metrics Dashboard'],
          milestones: ['Create product strategy', 'Lead feature development', 'Manage stakeholders', 'Drive product metrics'],
          courses: ['Product Strategy', 'Agile Product Management', 'Data-Driven Product Management'],
          books: ['Good Strategy Bad Strategy', 'Escaping the Build Trap', 'Lean Analytics']
        },
        {
          phase: 'Advanced',
          duration: '8-12 months',
          title: 'Leadership & Growth',
          description: 'Develop leadership skills and growth expertise',
          skills: ['Product Leadership', 'Growth Strategy', 'Team Management', 'Business Strategy', 'Innovation'],
          projects: ['Product Growth Initiative', 'Team Leadership', 'Strategic Planning', 'Innovation Project'],
          milestones: ['Lead product team', 'Drive significant growth', 'Influence company strategy', 'Mentor other PMs'],
          courses: ['Product Leadership', 'Growth Product Management', 'Strategic Product Management'],
          books: ['The Product Manager\'s Survival Guide', 'Crossing the Chasm', 'Zero to One']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Senior Leadership & Vision',
          description: 'Become a senior product leader and visionary',
          skills: ['Vision Setting', 'Organizational Leadership', 'Strategic Partnerships', 'Industry Expertise'],
          projects: ['Product Vision', 'Organizational Change', 'Strategic Partnerships', 'Industry Leadership'],
          milestones: ['Become senior PM', 'Set product vision', 'Lead organization', 'Industry recognition'],
          courses: ['Executive Product Management', 'Strategic Leadership', 'Innovation Management'],
          books: ['The Innovator\'s Dilemma', 'Good to Great', 'The Hard Thing About Hard Things']
        }
      ],
      resources: [
        { type: 'course', title: 'Google Product Management Certificate', provider: 'Google', free: false, rating: 4.6 },
        { type: 'book', title: 'Inspired', provider: 'Marty Cagan', free: false, rating: 4.8 },
        { type: 'website', title: 'Product School', provider: 'Product School', free: true, rating: 4.5 },
        { type: 'certification', title: 'Certified Scrum Product Owner', provider: 'Scrum Alliance', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      icon: Palette,
      category: 'Design',
      description: 'Create intuitive and beautiful user experiences for digital products.',
      averageSalary: '₹6-20 LPA',
      jobGrowth: '+18%',
      difficulty: 'Intermediate',
      timeToMaster: '2-3 years',
      trending: true,
      remote: true,
      skills: ['User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Interaction Design', 'Usability Testing'],
      companies: ['Google', 'Microsoft', 'Adobe', 'Figma', 'Uber', 'Airbnb', 'Flipkart', 'Zomato', 'BYJU\'S', 'Razorpay'],
      jobTitles: ['UI Designer', 'UX Designer', 'Product Designer', 'Design Lead', 'Creative Director'],
      prerequisites: ['Design Sense', 'Creativity', 'Empathy', 'Problem-Solving', 'Basic Computer Skills'],
      certifications: ['Google UX Design Certificate', 'Adobe Certified Expert', 'Interaction Design Foundation'],
      projects: ['Mobile App Design', 'Website Redesign', 'Design System', 'User Research Study', 'Prototype'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          title: 'Design Fundamentals',
          description: 'Learn basic design principles and tools',
          skills: ['Design Principles', 'Color Theory', 'Typography', 'Figma/Sketch', 'Adobe Creative Suite'],
          projects: ['Logo Design', 'Poster Design', 'Basic UI Elements', 'Style Guide'],
          milestones: ['Master design tools', 'Understand design principles', 'Create first designs', 'Build portfolio'],
          courses: ['Graphic Design Basics', 'Introduction to UI/UX', 'Figma Masterclass'],
          books: ['The Design of Everyday Things', 'Don\'t Make Me Think', 'About Face']
        },
        {
          phase: 'Intermediate',
          duration: '4-6 months',
          title: 'UX Research & Design',
          description: 'Learn user research and experience design',
          skills: ['User Research', 'Wireframing', 'Prototyping', 'Information Architecture', 'Usability Testing'],
          projects: ['User Research Study', 'Wireframe Creation', 'Interactive Prototype', 'Usability Test'],
          milestones: ['Conduct user research', 'Create wireframes', 'Build prototypes', 'Test with users'],
          courses: ['UX Research Methods', 'Wireframing and Prototyping', 'Usability Testing'],
          books: ['Observing the User Experience', 'Rocket Surgery Made Easy', 'The Elements of User Experience']
        },
        {
          phase: 'Advanced',
          duration: '6-8 months',
          title: 'Advanced Design & Systems',
          description: 'Master advanced design concepts and systems thinking',
          skills: ['Design Systems', 'Advanced Prototyping', 'Motion Design', 'Accessibility', 'Design Leadership'],
          projects: ['Design System Creation', 'Advanced Prototype', 'Motion Graphics', 'Accessibility Audit'],
          milestones: ['Build design system', 'Create complex prototypes', 'Lead design projects', 'Ensure accessibility'],
          courses: ['Design Systems', 'Advanced Prototyping', 'Motion Design', 'Accessibility in Design'],
          books: ['Atomic Design', 'Design Systems', 'Universal Principles of Design']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Design Leadership & Strategy',
          description: 'Become a design leader and strategic thinker',
          skills: ['Design Strategy', 'Team Leadership', 'Business Understanding', 'Design Thinking', 'Innovation'],
          projects: ['Design Strategy', 'Team Management', 'Design Workshops', 'Innovation Projects'],
          milestones: ['Lead design team', 'Influence product strategy', 'Drive design culture', 'Industry recognition'],
          courses: ['Design Leadership', 'Design Strategy', 'Design Thinking', 'Innovation Management'],
          books: ['The Design of Business', 'Change by Design', 'Creative Confidence']
        }
      ],
      resources: [
        { type: 'course', title: 'Google UX Design Certificate', provider: 'Google', free: false, rating: 4.7 },
        { type: 'book', title: 'The Design of Everyday Things', provider: 'Don Norman', free: false, rating: 4.6 },
        { type: 'website', title: 'Interaction Design Foundation', provider: 'IxDF', free: false, rating: 4.5 },
        { type: 'youtube', title: 'AJ&Smart', provider: 'YouTube', free: true, rating: 4.8 }
      ]
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Specialist',
      icon: Megaphone,
      category: 'Marketing & Sales',
      description: 'Drive brand awareness and customer acquisition through digital channels.',
      averageSalary: '₹4-15 LPA',
      jobGrowth: '+25%',
      difficulty: 'Beginner',
      timeToMaster: '1-2 years',
      trending: true,
      remote: true,
      skills: ['SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Analytics', 'PPC'],
      companies: ['Google', 'Meta', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy', 'BYJU\'S', 'Unacademy', 'Paytm', 'PhonePe'],
      jobTitles: ['Digital Marketing Executive', 'SEO Specialist', 'Social Media Manager', 'Content Marketer', 'Growth Marketer'],
      prerequisites: ['Communication Skills', 'Creativity', 'Analytical Thinking', 'Basic Computer Skills'],
      certifications: ['Google Ads Certification', 'Google Analytics', 'Facebook Blueprint', 'HubSpot Content Marketing'],
      projects: ['SEO Campaign', 'Social Media Strategy', 'Content Calendar', 'Email Campaign', 'PPC Campaign'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          title: 'Digital Marketing Basics',
          description: 'Learn fundamental digital marketing concepts',
          skills: ['Marketing Fundamentals', 'Digital Channels', 'Analytics Basics', 'Content Creation'],
          projects: ['Blog Writing', 'Social Media Posts', 'Basic SEO', 'Email Newsletter'],
          milestones: ['Understand digital landscape', 'Create content', 'Set up analytics', 'Run first campaign'],
          courses: ['Digital Marketing Fundamentals', 'Google Analytics Beginner', 'Content Marketing'],
          books: ['Digital Marketing for Dummies', 'Content Inc.', 'Jab, Jab, Jab, Right Hook']
        },
        {
          phase: 'Intermediate',
          duration: '4-6 months',
          title: 'Specialized Channels',
          description: 'Master specific digital marketing channels',
          skills: ['SEO/SEM', 'Social Media Advertising', 'Email Marketing', 'Content Strategy', 'Conversion Optimization'],
          projects: ['SEO Optimization', 'Facebook Ads Campaign', 'Email Automation', 'Landing Page Optimization'],
          milestones: ['Rank on Google', 'Generate leads', 'Build email list', 'Optimize conversions'],
          courses: ['Advanced SEO', 'Facebook Advertising', 'Email Marketing Mastery', 'Conversion Optimization'],
          books: ['The Art of SEO', 'Facebook Advertising', 'Email Marketing Rules']
        },
        {
          phase: 'Advanced',
          duration: '6-8 months',
          title: 'Strategy & Analytics',
          description: 'Develop strategic thinking and advanced analytics',
          skills: ['Marketing Strategy', 'Advanced Analytics', 'Marketing Automation', 'Growth Hacking', 'ROI Optimization'],
          projects: ['Integrated Campaign', 'Marketing Automation', 'Growth Experiment', 'Attribution Modeling'],
          milestones: ['Create marketing strategy', 'Automate processes', 'Drive significant growth', 'Prove ROI'],
          courses: ['Marketing Strategy', 'Advanced Analytics', 'Marketing Automation', 'Growth Hacking'],
          books: ['Traction', 'Growth Hacker Marketing', 'Marketing Metrics']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Leadership & Innovation',
          description: 'Lead marketing teams and drive innovation',
          skills: ['Team Leadership', 'Budget Management', 'Strategic Planning', 'Innovation', 'Industry Expertise'],
          projects: ['Team Management', 'Budget Planning', 'Strategic Initiatives', 'Innovation Projects'],
          milestones: ['Lead marketing team', 'Manage large budgets', 'Drive company growth', 'Industry recognition'],
          courses: ['Marketing Leadership', 'Strategic Marketing', 'Innovation in Marketing'],
          books: ['Marketing Management', 'The Lean Startup', 'Blue Ocean Strategy']
        }
      ],
      resources: [
        { type: 'certification', title: 'Google Ads Certification', provider: 'Google', free: true, rating: 4.5 },
        { type: 'course', title: 'Digital Marketing Specialization', provider: 'University of Illinois', free: false, rating: 4.6 },
        { type: 'website', title: 'HubSpot Academy', provider: 'HubSpot', free: true, rating: 4.7 },
        { type: 'book', title: 'Digital Marketing for Dummies', provider: 'Ryan Deiss', free: false, rating: 4.3 }
      ]
    },
    {
      id: 'business-analyst',
      title: 'Business Analyst',
      icon: BarChart3,
      category: 'Business & Finance',
      description: 'Bridge business needs and technology solutions through data-driven insights.',
      averageSalary: '₹6-18 LPA',
      jobGrowth: '+20%',
      difficulty: 'Intermediate',
      timeToMaster: '2-3 years',
      remote: true,
      skills: ['Business Analysis', 'Requirements Gathering', 'Process Modeling', 'Data Analysis', 'Stakeholder Management'],
      companies: ['Accenture', 'Deloitte', 'TCS', 'Infosys', 'Wipro', 'Capgemini', 'IBM', 'Cognizant', 'EY', 'KPMG'],
      jobTitles: ['Business Analyst', 'Senior Business Analyst', 'Lead Business Analyst', 'Business Consultant'],
      prerequisites: ['Analytical Thinking', 'Communication Skills', 'Business Understanding', 'Problem-Solving'],
      certifications: ['CBAP', 'PMI-PBA', 'IIBA Certification', 'Agile Analysis Certification'],
      projects: ['Process Improvement', 'Requirements Documentation', 'Business Case Development', 'System Analysis'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          title: 'Business Analysis Fundamentals',
          description: 'Learn core business analysis concepts and techniques',
          skills: ['Business Analysis Basics', 'Requirements Gathering', 'Documentation', 'Stakeholder Analysis'],
          projects: ['Requirements Document', 'Process Map', 'Stakeholder Analysis', 'Business Case'],
          milestones: ['Understand BA role', 'Gather requirements', 'Document processes', 'Analyze stakeholders'],
          courses: ['Business Analysis Fundamentals', 'Requirements Engineering', 'Process Modeling'],
          books: ['Business Analysis Body of Knowledge', 'Requirements Engineering', 'The Business Analyst\'s Handbook']
        },
        {
          phase: 'Intermediate',
          duration: '4-6 months',
          title: 'Advanced Analysis & Tools',
          description: 'Master advanced analysis techniques and tools',
          skills: ['Advanced Modeling', 'Data Analysis', 'SQL', 'Agile/Scrum', 'Project Management'],
          projects: ['Data Analysis Project', 'Process Optimization', 'Agile User Stories', 'Dashboard Creation'],
          milestones: ['Master analysis tools', 'Work in agile teams', 'Create insights', 'Optimize processes'],
          courses: ['Advanced Business Analysis', 'SQL for Business Analysts', 'Agile Business Analysis'],
          books: ['Agile Extension to BABOK', 'Data Analysis for Business Analysts', 'The Agile Business Analyst']
        },
        {
          phase: 'Advanced',
          duration: '6-8 months',
          title: 'Strategic Analysis & Leadership',
          description: 'Develop strategic thinking and leadership skills',
          skills: ['Strategic Analysis', 'Change Management', 'Team Leadership', 'Business Strategy', 'Innovation'],
          projects: ['Strategic Initiative', 'Change Management', 'Team Leadership', 'Innovation Project'],
          milestones: ['Lead strategic projects', 'Manage change', 'Lead teams', 'Drive innovation'],
          courses: ['Strategic Business Analysis', 'Change Management', 'Leadership for Business Analysts'],
          books: ['Strategic Analysis and Action', 'Leading Change', 'The Innovator\'s Dilemma']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Senior Leadership & Consulting',
          description: 'Become a senior business leader and consultant',
          skills: ['Executive Communication', 'Consulting Skills', 'Industry Expertise', 'Thought Leadership'],
          projects: ['Executive Consulting', 'Industry Analysis', 'Thought Leadership', 'Mentoring'],
          milestones: ['Become senior BA', 'Consult executives', 'Industry expertise', 'Thought leadership'],
          courses: ['Executive Business Analysis', 'Consulting Skills', 'Industry Analysis'],
          books: ['The McKinsey Way', 'The Pyramid Principle', 'Flawless Consulting']
        }
      ],
      resources: [
        { type: 'certification', title: 'CBAP Certification', provider: 'IIBA', free: false, rating: 4.5 },
        { type: 'book', title: 'Business Analysis Body of Knowledge', provider: 'IIBA', free: false, rating: 4.4 },
        { type: 'course', title: 'Business Analysis Fundamentals', provider: 'Coursera', free: false, rating: 4.3 }
      ]
    },
    {
      id: 'cloud-architect',
      title: 'Cloud Architect',
      icon: Cloud,
      category: 'Cloud & Infrastructure',
      description: 'Design and implement scalable cloud infrastructure and solutions.',
      averageSalary: '₹15-40 LPA',
      jobGrowth: '+30%',
      difficulty: 'Advanced',
      timeToMaster: '4-5 years',
      trending: true,
      remote: true,
      skills: ['Cloud Platforms', 'System Architecture', 'DevOps', 'Security', 'Networking', 'Automation'],
      companies: ['Amazon', 'Microsoft', 'Google', 'IBM', 'Oracle', 'Salesforce', 'VMware', 'Red Hat', 'Accenture', 'TCS'],
      jobTitles: ['Cloud Architect', 'Solutions Architect', 'Principal Architect', 'Cloud Consultant', 'Infrastructure Architect'],
      prerequisites: ['System Administration', 'Networking', 'Programming', 'Linux/Unix', 'Database Knowledge'],
      certifications: ['AWS Solutions Architect', 'Azure Solutions Architect', 'Google Cloud Architect', 'TOGAF'],
      projects: ['Cloud Migration', 'Multi-Cloud Architecture', 'Disaster Recovery', 'Auto-scaling System', 'Security Implementation'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '4-6 months',
          title: 'Cloud Fundamentals',
          description: 'Learn cloud computing basics and core services',
          skills: ['Cloud Computing Basics', 'AWS/Azure/GCP Fundamentals', 'Networking', 'Security Basics', 'Linux'],
          projects: ['Basic Cloud Deployment', 'Virtual Network Setup', 'Storage Configuration', 'Security Groups'],
          milestones: ['Understand cloud concepts', 'Deploy first application', 'Configure networking', 'Implement security'],
          courses: ['AWS Cloud Practitioner', 'Azure Fundamentals', 'Google Cloud Basics', 'Cloud Computing Concepts'],
          books: ['Cloud Computing: Concepts, Technology & Architecture', 'AWS Certified Solutions Architect Study Guide']
        },
        {
          phase: 'Intermediate',
          duration: '6-9 months',
          title: 'Architecture & Design',
          description: 'Learn to design scalable and resilient cloud architectures',
          skills: ['Solution Architecture', 'High Availability', 'Scalability', 'Cost Optimization', 'Monitoring'],
          projects: ['Scalable Web Application', 'High Availability Setup', 'Cost Optimization', 'Monitoring Dashboard'],
          milestones: ['Design scalable systems', 'Implement HA/DR', 'Optimize costs', 'Monitor performance'],
          courses: ['AWS Solutions Architect Associate', 'Azure Solutions Architect', 'System Design'],
          books: ['Designing Distributed Systems', 'Building Scalable Web Sites', 'Site Reliability Engineering']
        },
        {
          phase: 'Advanced',
          duration: '8-12 months',
          title: 'Enterprise & Multi-Cloud',
          description: 'Master enterprise-grade and multi-cloud architectures',
          skills: ['Enterprise Architecture', 'Multi-Cloud', 'Hybrid Cloud', 'Governance', 'Compliance'],
          projects: ['Enterprise Migration', 'Multi-Cloud Strategy', 'Governance Framework', 'Compliance Implementation'],
          milestones: ['Lead enterprise projects', 'Design multi-cloud', 'Implement governance', 'Ensure compliance'],
          courses: ['AWS Solutions Architect Professional', 'Azure Solutions Architect Expert', 'Enterprise Architecture'],
          books: ['Enterprise Architecture as Strategy', 'The Practice of Cloud System Administration']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Strategic Leadership',
          description: 'Become a strategic cloud leader and advisor',
          skills: ['Strategic Planning', 'Team Leadership', 'Business Alignment', 'Innovation', 'Thought Leadership'],
          projects: ['Cloud Strategy', 'Team Leadership', 'Innovation Initiatives', 'Industry Speaking'],
          milestones: ['Define cloud strategy', 'Lead architecture teams', 'Drive innovation', 'Industry recognition'],
          courses: ['Strategic Cloud Leadership', 'Technology Strategy', 'Innovation Management'],
          books: ['The Cloud at Your Service', 'Leading Digital Transformation', 'The Technology Fallacy']
        }
      ],
      resources: [
        { type: 'certification', title: 'AWS Solutions Architect', provider: 'Amazon', free: false, rating: 4.6 },
        { type: 'course', title: 'Cloud Architecture with Google Cloud', provider: 'Google Cloud', free: false, rating: 4.5 },
        { type: 'book', title: 'Cloud Computing: Concepts, Technology & Architecture', provider: 'Thomas Erl', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'game-developer',
      title: 'Game Developer',
      icon: Gamepad2,
      category: 'Gaming & Entertainment',
      description: 'Create engaging and immersive gaming experiences across platforms.',
      averageSalary: '₹5-18 LPA',
      jobGrowth: '+15%',
      difficulty: 'Intermediate',
      timeToMaster: '2-4 years',
      trending: true,
      skills: ['Game Programming', 'Game Engines', '3D Graphics', 'Physics', 'AI Programming', 'Game Design'],
      companies: ['Ubisoft', 'EA', 'Rockstar', 'Supercell', 'King', 'Zynga', 'Dream11', 'MPL', 'WinZO', 'Nazara'],
      jobTitles: ['Game Developer', 'Game Programmer', 'Unity Developer', 'Unreal Developer', 'Mobile Game Developer'],
      prerequisites: ['Programming Skills', 'Mathematics', 'Problem-Solving', 'Creativity', 'Patience'],
      certifications: ['Unity Certified Developer', 'Unreal Engine Certification', 'C# Programming Certification'],
      projects: ['2D Platformer', '3D Adventure Game', 'Mobile Puzzle Game', 'Multiplayer Game', 'VR Experience'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '3-4 months',
          title: 'Game Development Basics',
          description: 'Learn programming and basic game development concepts',
          skills: ['C# Programming', 'Game Development Concepts', 'Unity Basics', 'Basic Math', '2D Graphics'],
          projects: ['Simple 2D Game', 'Pong Clone', 'Platformer Game', 'Puzzle Game'],
          milestones: ['Learn C# programming', 'Create first game', 'Understand game loops', 'Publish simple game'],
          courses: ['Unity Game Development', 'C# Programming', 'Game Development Fundamentals'],
          books: ['Unity in Action', 'Game Programming Patterns', 'The Art of Game Design']
        },
        {
          phase: 'Intermediate',
          duration: '6-8 months',
          title: '3D Games & Advanced Concepts',
          description: 'Master 3D game development and advanced programming',
          skills: ['3D Programming', 'Physics Systems', 'AI Programming', 'Shaders', 'Optimization'],
          projects: ['3D Action Game', 'Racing Game', 'RPG System', 'AI Behavior'],
          milestones: ['Create 3D games', 'Implement physics', 'Program game AI', 'Optimize performance'],
          courses: ['Advanced Unity Development', '3D Game Programming', 'Game AI Programming'],
          books: ['Real-Time Rendering', 'AI for Games', 'Game Engine Architecture']
        },
        {
          phase: 'Advanced',
          duration: '8-12 months',
          title: 'Specialized Development',
          description: 'Specialize in specific platforms or technologies',
          skills: ['Mobile Game Development', 'VR/AR Development', 'Multiplayer Programming', 'Advanced Graphics'],
          projects: ['Mobile Game', 'VR Experience', 'Multiplayer Game', 'Advanced Graphics Demo'],
          milestones: ['Master platform development', 'Create VR/AR experience', 'Implement multiplayer', 'Advanced graphics'],
          courses: ['Mobile Game Development', 'VR Development', 'Multiplayer Game Programming'],
          books: ['Mobile Game Development', 'Virtual Reality Programming', 'Multiplayer Game Programming']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry & Leadership',
          description: 'Work in game industry and lead development teams',
          skills: ['Team Leadership', 'Project Management', 'Game Design', 'Business Understanding', 'Innovation'],
          projects: ['Commercial Game', 'Team Leadership', 'Game Design', 'Innovation Projects'],
          milestones: ['Join game studio', 'Lead development team', 'Ship commercial game', 'Industry recognition'],
          courses: ['Game Industry Business', 'Team Leadership', 'Game Design'],
          books: ['The Game Industry', 'Blood, Sweat, and Pixels', 'Masters of Doom']
        }
      ],
      resources: [
        { type: 'course', title: 'Complete Unity Developer', provider: 'GameDev.tv', free: false, rating: 4.7 },
        { type: 'certification', title: 'Unity Certified Developer', provider: 'Unity', free: false, rating: 4.5 },
        { type: 'website', title: 'Unity Learn', provider: 'Unity', free: true, rating: 4.6 },
        { type: 'book', title: 'Unity in Action', provider: 'Joe Hocking', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'blockchain-developer',
      title: 'Blockchain Developer',
      icon: Layers,
      category: 'Emerging Technologies',
      description: 'Build decentralized applications and smart contracts on blockchain platforms.',
      averageSalary: '₹8-25 LPA',
      jobGrowth: '+40%',
      difficulty: 'Advanced',
      timeToMaster: '2-3 years',
      trending: true,
      remote: true,
      skills: ['Blockchain Technology', 'Smart Contracts', 'Solidity', 'Web3', 'Cryptography', 'DeFi'],
      companies: ['Coinbase', 'Binance', 'Polygon', 'ConsenSys', 'ChainSafe', 'WazirX', 'CoinDCX', 'Zebpay'],
      jobTitles: ['Blockchain Developer', 'Smart Contract Developer', 'DApp Developer', 'Web3 Developer', 'Blockchain Engineer'],
      prerequisites: ['Programming Skills', 'Cryptography Basics', 'Distributed Systems', 'Web Development'],
      certifications: ['Certified Blockchain Developer', 'Ethereum Developer Certification', 'Hyperledger Certification'],
      projects: ['Smart Contract', 'DeFi Protocol', 'NFT Marketplace', 'DAO Implementation', 'Cross-chain Bridge'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '2-3 months',
          title: 'Blockchain Fundamentals',
          description: 'Understand blockchain technology and cryptocurrency basics',
          skills: ['Blockchain Concepts', 'Cryptocurrency', 'Bitcoin', 'Ethereum', 'Cryptography Basics'],
          projects: ['Blockchain Analysis', 'Cryptocurrency Wallet', 'Simple Transaction', 'Hash Functions'],
          milestones: ['Understand blockchain', 'Use cryptocurrency', 'Analyze transactions', 'Basic cryptography'],
          courses: ['Blockchain Basics', 'Bitcoin and Cryptocurrency Technologies', 'Cryptography'],
          books: ['Mastering Bitcoin', 'Blockchain Basics', 'The Internet of Money']
        },
        {
          phase: 'Intermediate',
          duration: '4-6 months',
          title: 'Smart Contract Development',
          description: 'Learn to develop and deploy smart contracts',
          skills: ['Solidity Programming', 'Smart Contracts', 'Ethereum Development', 'Web3.js', 'Truffle/Hardhat'],
          projects: ['Token Contract', 'Voting System', 'Escrow Contract', 'Multi-sig Wallet'],
          milestones: ['Write smart contracts', 'Deploy on testnet', 'Interact with contracts', 'Test thoroughly'],
          courses: ['Ethereum and Solidity', 'Smart Contract Development', 'DApp Development'],
          books: ['Mastering Ethereum', 'Hands-On Smart Contract Development', 'Building Ethereum DApps']
        },
        {
          phase: 'Advanced',
          duration: '6-8 months',
          title: 'DeFi & Advanced Applications',
          description: 'Build complex decentralized applications and DeFi protocols',
          skills: ['DeFi Protocols', 'Advanced Solidity', 'Layer 2 Solutions', 'Cross-chain Development', 'Security'],
          projects: ['DEX Protocol', 'Lending Platform', 'Yield Farming', 'NFT Marketplace'],
          milestones: ['Build DeFi protocol', 'Implement Layer 2', 'Cross-chain integration', 'Security audit'],
          courses: ['DeFi Development', 'Advanced Blockchain', 'Blockchain Security'],
          books: ['DeFi and the Future of Finance', 'Blockchain Security', 'Programming Bitcoin']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Enterprise & Innovation',
          description: 'Work on enterprise blockchain solutions and drive innovation',
          skills: ['Enterprise Blockchain', 'Hyperledger', 'Blockchain Architecture', 'Team Leadership', 'Innovation'],
          projects: ['Enterprise Solution', 'Blockchain Architecture', 'Innovation Projects', 'Team Leadership'],
          milestones: ['Enterprise deployment', 'Lead blockchain team', 'Drive innovation', 'Industry expertise'],
          courses: ['Enterprise Blockchain', 'Blockchain Architecture', 'Innovation in Blockchain'],
          books: ['Enterprise Blockchain', 'Blockchain Revolution', 'The Technology of Trust']
        }
      ],
      resources: [
        { type: 'course', title: 'Ethereum and Solidity Complete Developer Course', provider: 'Udemy', free: false, rating: 4.6 },
        { type: 'website', title: 'CryptoZombies', provider: 'Loom Network', free: true, rating: 4.8 },
        { type: 'book', title: 'Mastering Ethereum', provider: 'Andreas Antonopoulos', free: false, rating: 4.7 },
        { type: 'certification', title: 'Certified Blockchain Developer', provider: 'Blockchain Council', free: false, rating: 4.3 }
      ]
    },
    {
      id: 'robotics-engineer',
      title: 'Robotics Engineer',
      icon: Cog,
      category: 'Robotics & Automation',
      description: 'Design and develop robotic systems for various applications and industries.',
      averageSalary: '₹6-22 LPA',
      jobGrowth: '+18%',
      difficulty: 'Advanced',
      timeToMaster: '3-4 years',
      trending: true,
      skills: ['Robotics Programming', 'Control Systems', 'Computer Vision', 'Mechanical Design', 'AI/ML', 'Sensors'],
      companies: ['Boston Dynamics', 'ABB', 'KUKA', 'Fanuc', 'Tesla', 'Amazon Robotics', 'Tata Elxsi', 'L&T Technology'],
      jobTitles: ['Robotics Engineer', 'Automation Engineer', 'Control Systems Engineer', 'Robotics Software Engineer'],
      prerequisites: ['Engineering Background', 'Programming Skills', 'Mathematics', 'Physics', 'Problem-Solving'],
      certifications: ['ROS Certification', 'Automation Certification', 'Control Systems Certification'],
      projects: ['Autonomous Robot', 'Robotic Arm', 'Drone System', 'Industrial Automation', 'Computer Vision System'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '4-6 months',
          title: 'Robotics Fundamentals',
          description: 'Learn basic robotics concepts and programming',
          skills: ['Robotics Basics', 'Programming (Python/C++)', 'Electronics', 'Sensors', 'Actuators'],
          projects: ['Simple Robot', 'Sensor Integration', 'Motor Control', 'Basic Automation'],
          milestones: ['Build first robot', 'Program microcontroller', 'Integrate sensors', 'Control motors'],
          courses: ['Introduction to Robotics', 'Arduino Programming', 'Electronics for Robotics'],
          books: ['Introduction to Robotics', 'Programming Robots with ROS', 'Robotics: Modelling, Planning and Control']
        },
        {
          phase: 'Intermediate',
          duration: '6-9 months',
          title: 'Advanced Robotics & ROS',
          description: 'Master ROS and advanced robotics concepts',
          skills: ['ROS (Robot Operating System)', 'Computer Vision', 'Path Planning', 'SLAM', 'Control Theory'],
          projects: ['ROS Robot', 'Computer Vision System', 'Navigation Robot', 'SLAM Implementation'],
          milestones: ['Master ROS', 'Implement computer vision', 'Autonomous navigation', 'SLAM mapping'],
          courses: ['ROS for Beginners', 'Computer Vision for Robotics', 'Robot Navigation'],
          books: ['Learning ROS for Robotics Programming', 'Computer Vision: Algorithms and Applications', 'Probabilistic Robotics']
        },
        {
          phase: 'Advanced',
          duration: '8-12 months',
          title: 'AI & Specialized Applications',
          description: 'Integrate AI/ML and specialize in specific robotics domains',
          skills: ['Machine Learning for Robotics', 'Deep Learning', 'Reinforcement Learning', 'Industrial Automation'],
          projects: ['AI-powered Robot', 'Industrial Automation', 'Reinforcement Learning Robot', 'Specialized Application'],
          milestones: ['Integrate AI/ML', 'Industrial application', 'Reinforcement learning', 'Specialized expertise'],
          courses: ['AI for Robotics', 'Deep Learning for Robotics', 'Industrial Automation'],
          books: ['Artificial Intelligence for Robotics', 'Deep Learning for Robotics', 'Industrial Robotics']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry & Research',
          description: 'Work in robotics industry or pursue research',
          skills: ['Research & Development', 'Team Leadership', 'Project Management', 'Innovation', 'Industry Knowledge'],
          projects: ['Commercial Robot', 'Research Project', 'Team Leadership', 'Innovation Initiative'],
          milestones: ['Join robotics company', 'Lead R&D projects', 'Publish research', 'Industry recognition'],
          courses: ['Robotics Research Methods', 'Innovation in Robotics', 'Project Management'],
          books: ['Robotics Research', 'Innovation in Robotics', 'The Robotics Primer']
        }
      ],
      resources: [
        { type: 'course', title: 'Modern Robotics Specialization', provider: 'Northwestern University', free: false, rating: 4.7 },
        { type: 'website', title: 'ROS Tutorials', provider: 'ROS.org', free: true, rating: 4.6 },
        { type: 'book', title: 'Introduction to Robotics', provider: 'John J. Craig', free: false, rating: 4.5 },
        { type: 'certification', title: 'ROS Developer Certification', provider: 'The Construct', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'biomedical-engineer',
      title: 'Biomedical Engineer',
      icon: Stethoscope,
      category: 'Healthcare & Biotech',
      description: 'Apply engineering principles to solve problems in medicine and healthcare.',
      averageSalary: '₹4-15 LPA',
      jobGrowth: '+12%',
      difficulty: 'Advanced',
      timeToMaster: '4-5 years',
      skills: ['Medical Device Design', 'Biomaterials', 'Signal Processing', 'Regulatory Affairs', 'Clinical Research'],
      companies: ['Medtronic', 'Johnson & Johnson', 'GE Healthcare', 'Philips Healthcare', 'Siemens Healthineers', 'Wipro GE'],
      jobTitles: ['Biomedical Engineer', 'Clinical Engineer', 'Medical Device Engineer', 'Research Engineer'],
      prerequisites: ['Engineering Background', 'Biology/Physiology', 'Mathematics', 'Physics', 'Problem-Solving'],
      certifications: ['Clinical Engineering Certification', 'Medical Device Certification', 'FDA Regulatory Certification'],
      projects: ['Medical Device Prototype', 'Biosignal Analysis', 'Imaging System', 'Rehabilitation Device'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '6-8 months',
          title: 'Biomedical Fundamentals',
          description: 'Learn biology, physiology, and basic biomedical engineering',
          skills: ['Human Physiology', 'Anatomy', 'Biomedical Instrumentation', 'Signal Processing', 'Programming'],
          projects: ['ECG Analysis', 'Blood Pressure Monitor', 'Basic Medical Device', 'Biosignal Processing'],
          milestones: ['Understand human physiology', 'Analyze biosignals', 'Build medical device', 'Process medical data'],
          courses: ['Introduction to Biomedical Engineering', 'Human Physiology', 'Biomedical Instrumentation'],
          books: ['Introduction to Biomedical Engineering', 'Biomedical Signal Analysis', 'Medical Instrumentation']
        },
        {
          phase: 'Intermediate',
          duration: '8-12 months',
          title: 'Medical Device Development',
          description: 'Learn medical device design and development processes',
          skills: ['Medical Device Design', 'Biomaterials', 'Regulatory Affairs', 'Quality Systems', 'Clinical Trials'],
          projects: ['Medical Device Design', 'Biomaterial Testing', 'Regulatory Submission', 'Clinical Study'],
          milestones: ['Design medical device', 'Test biomaterials', 'Navigate regulations', 'Conduct clinical study'],
          courses: ['Medical Device Design', 'Biomaterials', 'FDA Regulations', 'Clinical Research'],
          books: ['Medical Device Design', 'Biomaterials Science', 'FDA Regulatory Affairs']
        },
        {
          phase: 'Advanced',
          duration: '10-15 months',
          title: 'Specialized Applications',
          description: 'Specialize in specific biomedical engineering domains',
          skills: ['Medical Imaging', 'Tissue Engineering', 'Rehabilitation Engineering', 'Artificial Organs'],
          projects: ['Imaging System', 'Tissue Engineering', 'Prosthetic Device', 'Artificial Organ'],
          milestones: ['Master imaging techniques', 'Engineer tissues', 'Design prosthetics', 'Develop artificial organs'],
          courses: ['Medical Imaging', 'Tissue Engineering', 'Rehabilitation Engineering', 'Artificial Organs'],
          books: ['Medical Imaging Systems', 'Tissue Engineering', 'Rehabilitation Engineering']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry & Research Leadership',
          description: 'Lead biomedical engineering projects and research',
          skills: ['Project Leadership', 'Research Management', 'Innovation', 'Commercialization', 'Industry Knowledge'],
          projects: ['Commercial Product', 'Research Leadership', 'Innovation Project', 'Technology Transfer'],
          milestones: ['Lead product development', 'Manage research team', 'Commercialize technology', 'Industry expertise'],
          courses: ['Biomedical Innovation', 'Technology Commercialization', 'Research Management'],
          books: ['Biomedical Innovation', 'Technology Transfer', 'Medical Device Commercialization']
        }
      ],
      resources: [
        { type: 'course', title: 'Introduction to Biomedical Engineering', provider: 'Duke University', free: false, rating: 4.6 },
        { type: 'book', title: 'Introduction to Biomedical Engineering', provider: 'John Enderle', free: false, rating: 4.5 },
        { type: 'certification', title: 'Clinical Engineering Certification', provider: 'ACCE', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'renewable-energy-engineer',
      title: 'Renewable Energy Engineer',
      icon: Sun,
      category: 'Energy & Environment',
      description: 'Design and develop sustainable energy solutions for a greener future.',
      averageSalary: '₹5-18 LPA',
      jobGrowth: '+25%',
      difficulty: 'Intermediate',
      timeToMaster: '3-4 years',
      trending: true,
      skills: ['Solar Energy', 'Wind Energy', 'Energy Storage', 'Grid Integration', 'Energy Modeling', 'Sustainability'],
      companies: ['Tata Power Solar', 'Adani Green Energy', 'ReNew Power', 'Azure Power', 'Suzlon', 'Vestas', 'GE Renewable'],
      jobTitles: ['Renewable Energy Engineer', 'Solar Engineer', 'Wind Energy Engineer', 'Energy Analyst', 'Sustainability Engineer'],
      prerequisites: ['Engineering Background', 'Physics', 'Mathematics', 'Environmental Awareness', 'Problem-Solving'],
      certifications: ['NABCEP Solar Certification', 'Wind Energy Certification', 'Energy Management Certification'],
      projects: ['Solar System Design', 'Wind Farm Analysis', 'Energy Storage System', 'Grid Integration Study'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '3-4 months',
          title: 'Energy Fundamentals',
          description: 'Learn basic energy concepts and renewable technologies',
          skills: ['Energy Basics', 'Solar Energy', 'Wind Energy', 'Energy Efficiency', 'Environmental Impact'],
          projects: ['Solar Calculator', 'Wind Assessment', 'Energy Audit', 'Efficiency Analysis'],
          milestones: ['Understand energy systems', 'Analyze solar potential', 'Assess wind resources', 'Conduct energy audit'],
          courses: ['Introduction to Renewable Energy', 'Solar Energy Basics', 'Wind Energy Fundamentals'],
          books: ['Renewable Energy Systems', 'Solar Engineering', 'Wind Energy Handbook']
        },
        {
          phase: 'Intermediate',
          duration: '6-8 months',
          title: 'System Design & Analysis',
          description: 'Learn to design and analyze renewable energy systems',
          skills: ['System Design', 'Energy Modeling', 'Economic Analysis', 'Grid Integration', 'Energy Storage'],
          projects: ['Solar PV System', 'Wind Farm Design', 'Hybrid System', 'Grid-tie System'],
          milestones: ['Design solar systems', 'Model wind farms', 'Integrate storage', 'Connect to grid'],
          courses: ['Solar System Design', 'Wind Farm Development', 'Energy Storage Systems', 'Grid Integration'],
          books: ['Solar Power Engineering', 'Wind Energy Systems', 'Energy Storage Technologies']
        },
        {
          phase: 'Advanced',
          duration: '8-10 months',
          title: 'Advanced Technologies & Management',
          description: 'Master advanced technologies and project management',
          skills: ['Advanced Technologies', 'Project Management', 'Policy & Regulations', 'Smart Grids', 'Innovation'],
          projects: ['Advanced Technology Project', 'Large-scale Development', 'Smart Grid Integration', 'Innovation Project'],
          milestones: ['Master new technologies', 'Manage large projects', 'Navigate regulations', 'Drive innovation'],
          courses: ['Advanced Renewable Technologies', 'Energy Project Management', 'Energy Policy', 'Smart Grids'],
          books: ['Advanced Renewable Energy Systems', 'Energy Project Management', 'Smart Grid Technology']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry Leadership & Innovation',
          description: 'Lead renewable energy projects and drive industry innovation',
          skills: ['Strategic Planning', 'Team Leadership', 'Business Development', 'Innovation', 'Industry Expertise'],
          projects: ['Strategic Planning', 'Team Leadership', 'Business Development', 'Innovation Initiative'],
          milestones: ['Lead energy projects', 'Develop business', 'Drive innovation', 'Industry recognition'],
          courses: ['Energy Business Strategy', 'Innovation in Energy', 'Leadership in Sustainability'],
          books: ['Energy Strategy', 'Clean Energy Business', 'Sustainable Energy Leadership']
        }
      ],
      resources: [
        { type: 'course', title: 'Solar Energy Basics', provider: 'State University of New York', free: false, rating: 4.5 },
        { type: 'certification', title: 'NABCEP Solar Certification', provider: 'NABCEP', free: false, rating: 4.6 },
        { type: 'book', title: 'Renewable Energy Systems', provider: 'Bent Sorensen', free: false, rating: 4.4 }
      ]
    },
    {
      id: 'aerospace-engineer',
      title: 'Aerospace Engineer',
      icon: Rocket,
      category: 'Aerospace & Defense',
      description: 'Design and develop aircraft, spacecraft, and aerospace systems.',
      averageSalary: '₹6-20 LPA',
      jobGrowth: '+8%',
      difficulty: 'Advanced',
      timeToMaster: '4-5 years',
      skills: ['Aerodynamics', 'Propulsion', 'Flight Mechanics', 'Structural Analysis', 'Control Systems', 'CAD Design'],
      companies: ['ISRO', 'HAL', 'DRDO', 'Boeing', 'Airbus', 'Lockheed Martin', 'SpaceX', 'Blue Origin', 'Tata Advanced Systems'],
      jobTitles: ['Aerospace Engineer', 'Flight Test Engineer', 'Propulsion Engineer', 'Systems Engineer', 'Design Engineer'],
      prerequisites: ['Strong Mathematics', 'Physics', 'Engineering Background', 'Problem-Solving', 'Attention to Detail'],
      certifications: ['FAA Certification', 'EASA Certification', 'Project Management Certification'],
      projects: ['Aircraft Design', 'Rocket Propulsion', 'Flight Simulation', 'Structural Analysis', 'Control System'],
      roadmap: [
        {
          phase: 'Foundation',
          duration: '6-8 months',
          title: 'Aerospace Fundamentals',
          description: 'Learn basic aerospace engineering principles',
          skills: ['Aerodynamics', 'Flight Mechanics', 'Aircraft Structures', 'Propulsion Basics', 'CAD Design'],
          projects: ['Airfoil Analysis', 'Simple Aircraft Design', 'Propulsion Study', 'Structural Model'],
          milestones: ['Understand flight principles', 'Analyze airfoils', 'Design basic aircraft', 'Model structures'],
          courses: ['Introduction to Aerospace Engineering', 'Aerodynamics', 'Aircraft Structures'],
          books: ['Introduction to Flight', 'Fundamentals of Aerodynamics', 'Aircraft Structures']
        },
        {
          phase: 'Intermediate',
          duration: '8-12 months',
          title: 'Advanced Design & Analysis',
          description: 'Master advanced aerospace design and analysis techniques',
          skills: ['Advanced Aerodynamics', 'Propulsion Systems', 'Flight Control', 'Avionics', 'Testing'],
          projects: ['Advanced Aircraft Design', 'Propulsion System', 'Flight Control System', 'Wind Tunnel Testing'],
          milestones: ['Design complex aircraft', 'Develop propulsion', 'Control flight systems', 'Conduct testing'],
          courses: ['Advanced Aerodynamics', 'Propulsion Systems', 'Flight Control Systems', 'Aerospace Testing'],
          books: ['Aircraft Design', 'Gas Turbine Theory', 'Flight Control Systems']
        },
        {
          phase: 'Advanced',
          duration: '10-15 months',
          title: 'Specialized Systems & Innovation',
          description: 'Specialize in specific aerospace domains and drive innovation',
          skills: ['Space Systems', 'Advanced Materials', 'Autonomous Systems', 'Innovation', 'Research'],
          projects: ['Spacecraft Design', 'Advanced Materials', 'Autonomous Flight', 'Research Project'],
          milestones: ['Design spacecraft', 'Use advanced materials', 'Develop autonomous systems', 'Conduct research'],
          courses: ['Spacecraft Design', 'Advanced Materials', 'Autonomous Aerospace Systems', 'Aerospace Research'],
          books: ['Spacecraft Systems Engineering', 'Advanced Materials in Aerospace', 'Autonomous Flight Systems']
        },
        {
          phase: 'Professional',
          duration: 'Ongoing',
          title: 'Industry Leadership & Innovation',
          description: 'Lead aerospace projects and drive industry innovation',
          skills: ['Project Leadership', 'Systems Engineering', 'Innovation Management', 'Industry Knowledge', 'Strategic Planning'],
          projects: ['Major Aerospace Project', 'Systems Integration', 'Innovation Initiative', 'Strategic Planning'],
          milestones: ['Lead major projects', 'Integrate complex systems', 'Drive innovation', 'Industry expertise'],
          courses: ['Aerospace Project Management', 'Systems Engineering', 'Innovation in Aerospace'],
          books: ['Aerospace Project Management', 'Systems Engineering', 'Innovation in Aerospace']
        }
      ],
      resources: [
        { type: 'course', title: 'Introduction to Aerospace Engineering', provider: 'MIT', free: false, rating: 4.7 },
        { type: 'book', title: 'Introduction to Flight', provider: 'John Anderson', free: false, rating: 4.6 },
        { type: 'certification', title: 'Project Management for Aerospace', provider: 'PMI', free: false, rating: 4.4 }
      ]
    }
  ];

  const categories = Array.from(new Set(careerPaths.map(path => path.category)));

  const filteredPaths = careerPaths.filter(path => {
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'book': return BookOpen;
      case 'website': return Globe;
      case 'certification': return Award;
      case 'youtube': return Video;
      case 'bootcamp': return GraduationCap;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BTech Career Roadmap</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive career paths for BTech students. Choose your path, follow the roadmap, and build the skills needed for your dream career in tech and beyond.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search career paths..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Career Paths Grid */}
        {!selectedPath && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPaths.map((path, index) => {
              const Icon = path.icon;
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105"
                  onClick={() => setSelectedPath(path)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      {path.trending && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          🔥 Trending
                        </span>
                      )}
                      {path.remote && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full font-medium">
                          🏠 Remote
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{path.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-green-600">{path.averageSalary}</div>
                      <div className="text-xs text-gray-600">Average Salary</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-sm font-semibold text-blue-600">{path.jobGrowth}</div>
                      <div className="text-xs text-gray-600">Job Growth</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{path.timeToMaster}</span>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                      <span>View Roadmap</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Detailed Career Path View */}
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Back Button */}
            <button
              onClick={() => setSelectedPath(null)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              <span>Back to Career Paths</span>
            </button>

            {/* Career Path Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg">
                  {React.createElement(selectedPath.icon, { className: "h-8 w-8 text-white" })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{selectedPath.title}</h1>
                    {selectedPath.trending && (
                      <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-full font-medium">
                        🔥 Trending
                      </span>
                    )}
                    {selectedPath.remote && (
                      <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full font-medium">
                        🏠 Remote Friendly
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 mb-4">{selectedPath.description}</p>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-600">{selectedPath.averageSalary}</div>
                      <div className="text-sm text-gray-600">Average Salary</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-600">{selectedPath.jobGrowth}</div>
                      <div className="text-sm text-gray-600">Job Growth</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-600">{selectedPath.timeToMaster}</div>
                      <div className="text-sm text-gray-600">Time to Master</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <div className={`text-lg font-bold px-2 py-1 rounded ${getDifficultyColor(selectedPath.difficulty)}`}>
                        {selectedPath.difficulty}
                      </div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Overview', icon: Target },
                    { id: 'roadmap', label: 'Learning Roadmap', icon: MapPin },
                    { id: 'resources', label: 'Resources', icon: BookOpen }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <tab.icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Skills Required */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span>Key Skills Required</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPath.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Top Companies */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-blue-500" />
                        <span>Top Companies Hiring</span>
                      </h3>
                      <div className="grid md:grid-cols-5 gap-3">
                        {selectedPath.companies.map((company, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors"
                          >
                            <span className="font-medium text-gray-900">{company}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Job Titles */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Users className="h-5 w-5 text-green-500" />
                        <span>Possible Job Titles</span>
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        {selectedPath.jobTitles.map((title, index) => (
                          <div
                            key={index}
                            className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <span className="font-medium text-green-800">{title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-purple-500" />
                        <span>Prerequisites</span>
                      </h3>
                      <div className="space-y-2">
                        {selectedPath.prerequisites.map((prereq, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-purple-600" />
                            <span className="text-purple-800">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span>Recommended Certifications</span>
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedPath.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className="p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                          >
                            <span className="font-medium text-yellow-800">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Roadmap Tab */}
                {activeTab === 'roadmap' && (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Roadmap</h3>
                      <p className="text-gray-600">Follow this step-by-step guide to master {selectedPath.title}</p>
                    </div>

                    {selectedPath.roadmap.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline Line */}
                        {index < selectedPath.roadmap.length - 1 && (
                          <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200"></div>
                        )}

                        <div className="flex items-start space-x-4">
                          {/* Phase Number */}
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>

                          {/* Phase Content */}
                          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900">{step.title}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {step.phase}
                                  </span>
                                  <span className="flex items-center space-x-1 text-sm text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>{step.duration}</span>
                                  </span>
                                </div>
                              </div>
                              <button
                                onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                {expandedStep === index ? (
                                  <ChevronDown className="h-5 w-5 text-gray-600" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-600" />
                                )}
                              </button>
                            </div>

                            <p className="text-gray-600 mb-4">{step.description}</p>

                            <AnimatePresence>
                              {expandedStep === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4"
                                >
                                  {/* Skills to Learn */}
                                  <div>
                                    <h5 className="font-semibold text-gray-900 mb-2">Skills to Learn</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {step.skills.map((skill, skillIndex) => (
                                        <span
                                          key={skillIndex}
                                          className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Projects */}
                                  <div>
                                    <h5 className="font-semibold text-gray-900 mb-2">Recommended Projects</h5>
                                    <div className="space-y-2">
                                      {step.projects.map((project, projectIndex) => (
                                        <div
                                          key={projectIndex}
                                          className="flex items-center space-x-2 p-2 bg-orange-50 rounded"
                                        >
                                          <Lightbulb className="h-4 w-4 text-orange-600" />
                                          <span className="text-orange-800">{project}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Milestones */}
                                  <div>
                                    <h5 className="font-semibold text-gray-900 mb-2">Key Milestones</h5>
                                    <div className="space-y-2">
                                      {step.milestones.map((milestone, milestoneIndex) => (
                                        <div
                                          key={milestoneIndex}
                                          className="flex items-center space-x-2 p-2 bg-purple-50 rounded"
                                        >
                                          <Star className="h-4 w-4 text-purple-600" />
                                          <span className="text-purple-800">{milestone}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Courses */}
                                  {step.courses && (
                                    <div>
                                      <h5 className="font-semibold text-gray-900 mb-2">Recommended Courses</h5>
                                      <div className="space-y-2">
                                        {step.courses.map((course, courseIndex) => (
                                          <div
                                            key={courseIndex}
                                            className="flex items-center space-x-2 p-2 bg-blue-50 rounded"
                                          >
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                            <span className="text-blue-800">{course}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Books */}
                                  {step.books && (
                                    <div>
                                      <h5 className="font-semibold text-gray-900 mb-2">Essential Books</h5>
                                      <div className="space-y-2">
                                        {step.books.map((book, bookIndex) => (
                                          <div
                                            key={bookIndex}
                                            className="flex items-center space-x-2 p-2 bg-indigo-50 rounded"
                                          >
                                            <BookOpen className="h-4 w-4 text-indigo-600" />
                                            <span className="text-indigo-800">{book}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                  <div className="space-y-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h3>
                      <p className="text-gray-600">Curated resources to help you master {selectedPath.title}</p>
                    </div>

                    {/* Learning Resources */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <span>Learning Resources</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedPath.resources.map((resource, index) => {
                          const Icon = getResourceIcon(resource.type);
                          return (
                            <div
                              key={index}
                              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start space-x-3">
                                <Icon className="h-5 w-5 text-blue-600 mt-1" />
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{resource.title}</h5>
                                  <p className="text-sm text-gray-600">{resource.provider}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                      resource.free 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-blue-100 text-blue-800'
                                    }`}>
                                      {resource.free ? 'Free' : 'Paid'}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                      {resource.type}
                                    </span>
                                    {resource.rating && (
                                      <div className="flex items-center space-x-1">
                                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                        <span className="text-xs text-gray-600">{resource.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Project Ideas */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-orange-500" />
                        <span>Project Ideas</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedPath.projects.map((project, index) => (
                          <div
                            key={index}
                            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <Lightbulb className="h-5 w-5 text-orange-600" />
                              <span className="font-medium text-orange-800">{project}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
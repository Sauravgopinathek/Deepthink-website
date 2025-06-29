import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Award, 
  Clock, 
  Users, 
  Building, 
  ExternalLink, 
  CheckCircle, 
  Star,
  Briefcase,
  GraduationCap,
  Code,
  Palette,
  BarChart3,
  Zap,
  Globe,
  ArrowRight,
  Calendar,
  DollarSign,
  MapIcon,
  Play,
  Download,
  Heart,
  Eye,
  Filter,
  Search
} from 'lucide-react';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  averageSalary: string;
  jobGrowth: string;
  skills: string[];
  steps: CareerStep[];
  certifications: Certification[];
  internships: Internship[];
  companies: string[];
  relatedPaths: string[];
}

interface CareerStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'education' | 'experience' | 'certification' | 'project';
  resources: Resource[];
  completed?: boolean;
}

interface Certification {
  id: string;
  name: string;
  provider: string;
  cost: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  url: string;
  description: string;
  skills: string[];
  popularity: number;
}

interface Internship {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  type: 'Remote' | 'On-site' | 'Hybrid';
  paid: boolean;
  requirements: string[];
  description: string;
  applicationUrl: string;
  deadline?: string;
  logo?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'article' | 'video' | 'tool';
  provider: string;
  cost: 'Free' | 'Paid' | 'Freemium';
  rating: number;
  url: string;
  description: string;
}

const CareerRoadmap: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showInternships, setShowInternships] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const careerPaths: CareerPath[] = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Build applications, websites, and systems that power the digital world',
      icon: Code,
      difficulty: 'Intermediate',
      duration: '6-12 months',
      averageSalary: '$95,000 - $180,000',
      jobGrowth: '+22% (Much faster than average)',
      skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS'],
      companies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Spotify'],
      relatedPaths: ['data-scientist', 'product-manager', 'devops-engineer'],
      steps: [
        {
          id: 'step1',
          title: 'Learn Programming Fundamentals',
          description: 'Master the basics of programming with a focus on problem-solving and algorithms',
          duration: '2-3 months',
          type: 'education',
          resources: [
            {
              id: 'r1',
              title: 'CS50: Introduction to Computer Science',
              type: 'course',
              provider: 'Harvard (edX)',
              cost: 'Free',
              rating: 4.9,
              url: 'https://cs50.harvard.edu/x/',
              description: 'Harvard\'s comprehensive introduction to computer science and programming'
            },
            {
              id: 'r2',
              title: 'JavaScript: The Complete Guide',
              type: 'course',
              provider: 'Udemy',
              cost: 'Paid',
              rating: 4.7,
              url: 'https://udemy.com/javascript-complete',
              description: 'Complete JavaScript course from basics to advanced concepts'
            }
          ]
        },
        {
          id: 'step2',
          title: 'Build Your First Projects',
          description: 'Create portfolio projects to demonstrate your skills',
          duration: '1-2 months',
          type: 'project',
          resources: [
            {
              id: 'r3',
              title: 'FreeCodeCamp Projects',
              type: 'course',
              provider: 'FreeCodeCamp',
              cost: 'Free',
              rating: 4.8,
              url: 'https://freecodecamp.org',
              description: 'Hands-on coding projects with certifications'
            }
          ]
        },
        {
          id: 'step3',
          title: 'Learn Web Development',
          description: 'Master frontend and backend web development technologies',
          duration: '3-4 months',
          type: 'education',
          resources: [
            {
              id: 'r4',
              title: 'The Complete Web Developer Bootcamp',
              type: 'course',
              provider: 'Udemy',
              cost: 'Paid',
              rating: 4.6,
              url: 'https://udemy.com/web-developer-bootcamp',
              description: 'Full-stack web development course covering HTML, CSS, JavaScript, Node.js, and more'
            }
          ]
        },
        {
          id: 'step4',
          title: 'Gain Professional Experience',
          description: 'Apply for internships or entry-level positions',
          duration: '3-6 months',
          type: 'experience',
          resources: []
        }
      ],
      certifications: [
        {
          id: 'cert1',
          name: 'AWS Certified Developer',
          provider: 'Amazon Web Services',
          cost: '$150',
          duration: '2-3 months prep',
          difficulty: 'Intermediate',
          url: 'https://aws.amazon.com/certification/certified-developer-associate/',
          description: 'Validates expertise in developing applications on AWS platform',
          skills: ['AWS', 'Cloud Computing', 'Lambda', 'DynamoDB'],
          popularity: 95
        },
        {
          id: 'cert2',
          name: 'Google Cloud Professional Developer',
          provider: 'Google Cloud',
          cost: '$200',
          duration: '2-3 months prep',
          difficulty: 'Advanced',
          url: 'https://cloud.google.com/certification/cloud-developer',
          description: 'Demonstrates ability to build scalable applications on Google Cloud',
          skills: ['Google Cloud', 'Kubernetes', 'App Engine', 'Cloud Functions'],
          popularity: 88
        },
        {
          id: 'cert3',
          name: 'Microsoft Azure Developer Associate',
          provider: 'Microsoft',
          cost: '$165',
          duration: '2-3 months prep',
          difficulty: 'Intermediate',
          url: 'https://docs.microsoft.com/en-us/learn/certifications/azure-developer/',
          description: 'Validates skills in developing cloud solutions on Azure',
          skills: ['Azure', 'C#', '.NET', 'Azure Functions'],
          popularity: 82
        }
      ],
      internships: [
        {
          id: 'int1',
          company: 'Google',
          position: 'Software Engineering Intern',
          location: 'Mountain View, CA',
          duration: '12 weeks',
          type: 'On-site',
          paid: true,
          requirements: ['CS degree in progress', 'Programming experience', 'Strong problem-solving skills'],
          description: 'Work on real Google products with mentorship from senior engineers',
          applicationUrl: 'https://careers.google.com/students/',
          deadline: 'March 15, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: 'int2',
          company: 'Microsoft',
          position: 'Software Engineering Intern',
          location: 'Redmond, WA',
          duration: '12 weeks',
          type: 'Hybrid',
          paid: true,
          requirements: ['Programming experience', 'CS fundamentals', 'Collaborative mindset'],
          description: 'Contribute to Microsoft products while learning from industry experts',
          applicationUrl: 'https://careers.microsoft.com/students/',
          deadline: 'February 28, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: 'int3',
          company: 'Stripe',
          position: 'Software Engineering Intern',
          location: 'San Francisco, CA',
          duration: '12 weeks',
          type: 'On-site',
          paid: true,
          requirements: ['Programming experience', 'Interest in fintech', 'Strong communication'],
          description: 'Build payment infrastructure used by millions of businesses worldwide',
          applicationUrl: 'https://stripe.com/jobs/university',
          deadline: 'April 1, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Drive product strategy and work with cross-functional teams to build user-centric products',
      icon: Target,
      difficulty: 'Advanced',
      duration: '8-15 months',
      averageSalary: '$110,000 - $200,000',
      jobGrowth: '+19% (Much faster than average)',
      skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Agile', 'Wireframing', 'SQL'],
      companies: ['Apple', 'Google', 'Meta', 'Airbnb', 'Uber', 'Spotify'],
      relatedPaths: ['ux-designer', 'data-analyst', 'marketing-manager'],
      steps: [
        {
          id: 'pm-step1',
          title: 'Learn Product Management Fundamentals',
          description: 'Understand product lifecycle, user research, and market analysis',
          duration: '2-3 months',
          type: 'education',
          resources: [
            {
              id: 'pm-r1',
              title: 'Product Management Fundamentals',
              type: 'course',
              provider: 'Coursera (University of Virginia)',
              cost: 'Free',
              rating: 4.7,
              url: 'https://coursera.org/learn/product-management',
              description: 'Comprehensive introduction to product management principles'
            }
          ]
        }
      ],
      certifications: [
        {
          id: 'pm-cert1',
          name: 'Certified Product Manager',
          provider: 'Product School',
          cost: '$2,500',
          duration: '8 weeks',
          difficulty: 'Intermediate',
          url: 'https://productschool.com/product-management-certification/',
          description: 'Industry-recognized certification for product management skills',
          skills: ['Product Strategy', 'User Research', 'Analytics', 'Roadmapping'],
          popularity: 92
        }
      ],
      internships: [
        {
          id: 'pm-int1',
          company: 'Meta',
          position: 'Product Manager Intern',
          location: 'Menlo Park, CA',
          duration: '12 weeks',
          type: 'On-site',
          paid: true,
          requirements: ['MBA or relevant experience', 'Analytical skills', 'Leadership experience'],
          description: 'Work on Meta\'s core products with billions of users',
          applicationUrl: 'https://careers.meta.com/students/',
          deadline: 'January 31, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    },
    {
      id: 'ux-designer',
      title: 'UX Designer',
      description: 'Create intuitive and delightful user experiences through research and design',
      icon: Palette,
      difficulty: 'Intermediate',
      duration: '6-10 months',
      averageSalary: '$85,000 - $150,000',
      jobGrowth: '+13% (Faster than average)',
      skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Adobe Creative Suite', 'Usability Testing'],
      companies: ['Apple', 'Google', 'Airbnb', 'Spotify', 'Netflix', 'Adobe'],
      relatedPaths: ['product-manager', 'frontend-developer', 'graphic-designer'],
      steps: [
        {
          id: 'ux-step1',
          title: 'Learn UX Design Fundamentals',
          description: 'Master design thinking, user research, and design principles',
          duration: '2-3 months',
          type: 'education',
          resources: [
            {
              id: 'ux-r1',
              title: 'Google UX Design Certificate',
              type: 'course',
              provider: 'Coursera (Google)',
              cost: 'Paid',
              rating: 4.8,
              url: 'https://coursera.org/google-ux-design',
              description: 'Comprehensive UX design program by Google'
            }
          ]
        }
      ],
      certifications: [
        {
          id: 'ux-cert1',
          name: 'Google UX Design Certificate',
          provider: 'Google',
          cost: '$49/month',
          duration: '3-6 months',
          difficulty: 'Beginner',
          url: 'https://coursera.org/google-ux-design',
          description: 'Industry-recognized certificate for UX design fundamentals',
          skills: ['User Research', 'Wireframing', 'Prototyping', 'Figma'],
          popularity: 96
        }
      ],
      internships: [
        {
          id: 'ux-int1',
          company: 'Airbnb',
          position: 'UX Design Intern',
          location: 'San Francisco, CA',
          duration: '12 weeks',
          type: 'Hybrid',
          paid: true,
          requirements: ['Design portfolio', 'Figma proficiency', 'User research experience'],
          description: 'Design experiences for millions of travelers worldwide',
          applicationUrl: 'https://careers.airbnb.com/university/',
          deadline: 'March 1, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Extract insights from data to drive business decisions and build predictive models',
      icon: BarChart3,
      difficulty: 'Advanced',
      duration: '8-12 months',
      averageSalary: '$100,000 - $190,000',
      jobGrowth: '+35% (Much faster than average)',
      skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
      companies: ['Netflix', 'Uber', 'Spotify', 'LinkedIn', 'Tesla', 'Palantir'],
      relatedPaths: ['software-engineer', 'data-analyst', 'ml-engineer'],
      steps: [
        {
          id: 'ds-step1',
          title: 'Learn Statistics and Programming',
          description: 'Master statistical concepts and programming languages for data science',
          duration: '3-4 months',
          type: 'education',
          resources: [
            {
              id: 'ds-r1',
              title: 'Python for Data Science',
              type: 'course',
              provider: 'DataCamp',
              cost: 'Paid',
              rating: 4.6,
              url: 'https://datacamp.com/python-data-science',
              description: 'Comprehensive Python course for data science applications'
            }
          ]
        }
      ],
      certifications: [
        {
          id: 'ds-cert1',
          name: 'IBM Data Science Professional Certificate',
          provider: 'IBM',
          cost: '$49/month',
          duration: '6-10 months',
          difficulty: 'Intermediate',
          url: 'https://coursera.org/ibm-data-science',
          description: 'Comprehensive data science program with hands-on projects',
          skills: ['Python', 'SQL', 'Machine Learning', 'Data Visualization'],
          popularity: 89
        }
      ],
      internships: [
        {
          id: 'ds-int1',
          company: 'Netflix',
          position: 'Data Science Intern',
          location: 'Los Gatos, CA',
          duration: '12 weeks',
          type: 'On-site',
          paid: true,
          requirements: ['Statistics background', 'Python/R proficiency', 'ML experience'],
          description: 'Work on recommendation algorithms and content analytics',
          applicationUrl: 'https://jobs.netflix.com/students',
          deadline: 'February 15, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    },
    {
      id: 'digital-marketer',
      title: 'Digital Marketing Manager',
      description: 'Drive growth through digital channels and data-driven marketing strategies',
      icon: Zap,
      difficulty: 'Intermediate',
      duration: '4-8 months',
      averageSalary: '$70,000 - $130,000',
      jobGrowth: '+10% (Faster than average)',
      skills: ['SEO/SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Email Marketing', 'PPC'],
      companies: ['HubSpot', 'Salesforce', 'Adobe', 'Shopify', 'Buffer', 'Mailchimp'],
      relatedPaths: ['content-creator', 'product-manager', 'growth-hacker'],
      steps: [
        {
          id: 'dm-step1',
          title: 'Learn Digital Marketing Fundamentals',
          description: 'Master the core concepts of digital marketing and analytics',
          duration: '2-3 months',
          type: 'education',
          resources: [
            {
              id: 'dm-r1',
              title: 'Google Digital Marketing Course',
              type: 'course',
              provider: 'Google',
              cost: 'Free',
              rating: 4.5,
              url: 'https://learndigital.withgoogle.com/',
              description: 'Comprehensive digital marketing course by Google'
            }
          ]
        }
      ],
      certifications: [
        {
          id: 'dm-cert1',
          name: 'Google Ads Certification',
          provider: 'Google',
          cost: 'Free',
          duration: '1-2 months',
          difficulty: 'Beginner',
          url: 'https://skillshop.exceedlms.com/student/catalog',
          description: 'Official Google certification for advertising expertise',
          skills: ['Google Ads', 'PPC', 'Campaign Management', 'Analytics'],
          popularity: 94
        }
      ],
      internships: [
        {
          id: 'dm-int1',
          company: 'HubSpot',
          position: 'Digital Marketing Intern',
          location: 'Cambridge, MA',
          duration: '12 weeks',
          type: 'Hybrid',
          paid: true,
          requirements: ['Marketing coursework', 'Analytics experience', 'Creative thinking'],
          description: 'Work on inbound marketing campaigns and growth strategies',
          applicationUrl: 'https://hubspot.com/careers/students',
          deadline: 'March 31, 2024',
          logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    }
  ];

  const filteredPaths = careerPaths.filter(path => {
    const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         path.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = filterDifficulty === 'all' || path.difficulty === filterDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const toggleFavorite = (pathId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(pathId)) {
      newFavorites.delete(pathId);
    } else {
      newFavorites.add(pathId);
    }
    setFavorites(newFavorites);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'education': return 'text-blue-600 bg-blue-100';
      case 'experience': return 'text-green-600 bg-green-100';
      case 'certification': return 'text-purple-600 bg-purple-100';
      case 'project': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <MapIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Career Roadmaps</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover structured learning paths with certifications, internships, and real-world projects 
            to launch your dream career in tech.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search career paths, skills, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {!selectedPath ? (
          <>
            {/* Career Paths Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPaths.map((path, index) => {
                const Icon = path.icon;
                const isFavorite = favorites.has(path.id);
                
                return (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 group relative"
                    onClick={() => setSelectedPath(path)}
                  >
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(path.id);
                        }}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          isFavorite 
                            ? 'text-red-500 bg-red-50' 
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className={`bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {path.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{path.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                          {path.difficulty}
                        </span>
                        <span className="text-sm text-gray-500">• {path.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">{path.averageSalary}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{path.jobGrowth}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">
                          {path.companies.slice(0, 3).join(', ')}
                          {path.companies.length > 3 && ` +${path.companies.length - 3} more`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex flex-wrap gap-1">
                        {path.skills.slice(0, 4).map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {path.skills.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{path.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Award className="h-4 w-4" />
                        <span>{path.certifications.length} certifications</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Briefcase className="h-4 w-4" />
                        <span>{path.internships.length} internships</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        ) : (
          /* Selected Path Detail View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Path Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <button
                onClick={() => setSelectedPath(null)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>Back to Career Paths</span>
              </button>

              <div className="flex items-start space-x-6">
                <div className={`bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg`}>
                  <selectedPath.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPath.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">{selectedPath.description}</p>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-medium">{selectedPath.duration}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm text-gray-500">Salary Range</div>
                        <div className="font-medium">{selectedPath.averageSalary}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="text-sm text-gray-500">Job Growth</div>
                        <div className="font-medium">{selectedPath.jobGrowth}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      <div>
                        <div className="text-sm text-gray-500">Difficulty</div>
                        <div className="font-medium">{selectedPath.difficulty}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowCertifications(!showCertifications)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        showCertifications 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Award className="h-4 w-4" />
                      <span>Certifications ({selectedPath.certifications.length})</span>
                    </button>
                    
                    <button
                      onClick={() => setShowInternships(!showInternships)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        showInternships 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Internships ({selectedPath.internships.length})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Required */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills You'll Learn</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPath.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/*  Certifications Section */}
            <AnimatePresence>
              {showCertifications && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span>Recommended Certifications</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedPath.certifications.map((cert) => (
                      <div key={cert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{cert.name}</h4>
                            <p className="text-blue-600 font-medium">{cert.provider}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{cert.popularity}%</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{cert.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-xs text-gray-500">Cost</div>
                            <div className="font-medium text-green-600">{cert.cost}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Duration</div>
                            <div className="font-medium">{cert.duration}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {cert.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(cert.difficulty)}`}>
                            {cert.difficulty}
                          </span>
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span className="text-sm font-medium">Learn More</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Internships Section */}
            <AnimatePresence>
              {showInternships && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-green-600" />
                    <span>Available Internships</span>
                  </h3>
                  
                  <div className="space-y-6">
                    {selectedPath.internships.map((internship) => (
                      <div key={internship.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <img
                            src={internship.logo || 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=100'}
                            alt={internship.company}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold text-gray-900">{internship.position}</h4>
                                <p className="text-blue-600 font-medium">{internship.company}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {internship.paid && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Paid
                                  </span>
                                )}
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  {internship.type}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4">{internship.description}</p>
                            
                            <div className="grid md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{internship.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{internship.duration}</span>
                              </div>
                              {internship.deadline && (
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-red-400" />
                                  <span className="text-sm text-red-600">Due: {internship.deadline}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-sm font-medium text-gray-900 mb-2">Requirements:</div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {internship.requirements.map((req, index) => (
                                  <li key={index} className="flex items-start space-x-2">
                                    <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <a
                              href={internship.applicationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <span>Apply Now</span>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Learning Path Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Learning Path</h3>
              
              <div className="space-y-6">
                {selectedPath.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    {index < selectedPath.steps.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(step.type)}`}>
                            {step.type}
                          </span>
                          <span className="text-sm text-gray-500">• {step.duration}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        
                        {step.resources.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="font-medium text-gray-900">Recommended Resources:</h5>
                            {step.resources.map((resource) => (
                              <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h6 className="font-medium text-gray-900">{resource.title}</h6>
                                    <p className="text-blue-600 text-sm">{resource.provider}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      resource.cost === 'Free' ? 'bg-green-100 text-green-800' :
                                      resource.cost === 'Paid' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {resource.cost}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                      <span className="text-xs text-gray-600">{resource.rating}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                                
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  <span className="text-sm font-medium">Start Learning</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Companies */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Hiring Companies</h3>
              <div className="flex flex-wrap gap-3">
                {selectedPath.companies.map((company, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
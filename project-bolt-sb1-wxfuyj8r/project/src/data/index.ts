import { CoreValue, Resource, AssessmentResult, Mentor } from '../types';

export const coreValues: CoreValue[] = [
  {
    id: '1',
    name: 'Autonomy',
    description: 'Having control over your work and life decisions',
    importance: 8,
    alignment: 6
  },
  {
    id: '2', 
    name: 'Growth',
    description: 'Continuous learning and personal development',
    importance: 9,
    alignment: 7
  },
  {
    id: '3',
    name: 'Impact',
    description: 'Making a meaningful difference in the world',
    importance: 8,
    alignment: 5
  },
  {
    id: '4',
    name: 'Security',
    description: 'Financial stability and predictable income',
    importance: 7,
    alignment: 8
  },
  {
    id: '5',
    name: 'Creativity',
    description: 'Expressing ideas and solving problems innovatively',
    importance: 6,
    alignment: 4
  },
  {
    id: '6',
    name: 'Balance',
    description: 'Maintaining harmony between work and personal life',
    importance: 9,
    alignment: 6
  }
];

export const assessmentQuestions = [
  {
    id: '1',
    question: 'I prefer working independently rather than in teams',
    category: 'work_style'
  },
  {
    id: '2',
    question: 'I enjoy taking on leadership responsibilities',
    category: 'leadership'
  },
  {
    id: '3',
    question: 'I thrive in fast-paced, changing environments',
    category: 'adaptability'
  },
  {
    id: '4',
    question: 'I prefer detailed, analytical work over creative tasks',
    category: 'thinking_style'
  },
  {
    id: '5',
    question: 'I value financial rewards over job satisfaction',
    category: 'motivation'
  }
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'The Decision Matrix: A Framework for Complex Choices',
    description: 'Learn how to systematically evaluate multiple options using weighted criteria.',
    type: 'article',
    category: 'Decision Making',
    readTime: 8
  },
  {
    id: '2',
    title: 'Values-Based Career Planning Exercise',
    description: 'Interactive worksheet to identify and prioritize your core values.',
    type: 'exercise',
    category: 'Career Planning',
    readTime: 15
  },
  {
    id: '3',
    title: 'SWOT Analysis for Personal Development',
    description: 'Assess your strengths, weaknesses, opportunities, and threats.',
    type: 'tool',
    category: 'Self Assessment',
    readTime: 12
  },
  {
    id: '4',
    title: 'Goal Setting with the SMART Framework',
    description: 'Create specific, measurable, achievable, relevant, and time-bound goals.',
    type: 'article',
    category: 'Goal Setting',
    readTime: 10
  }
];

export const decisionFrameworkSteps = [
  {
    id: 1,
    title: 'Define the Decision',
    description: 'Clearly articulate what you need to decide and why it matters.',
    questions: [
      'What exactly am I trying to decide?',
      'Why is this decision important to me?',
      'What happens if I don\'t make a decision?'
    ]
  },
  {
    id: 2,
    title: 'Identify Your Options',
    description: 'Brainstorm all possible choices, including creative alternatives.',
    questions: [
      'What are the obvious options?',
      'What alternatives haven\'t I considered?',
      'Could I combine options or create new ones?'
    ]
  },
  {
    id: 3,
    title: 'Set Your Criteria',
    description: 'Determine what factors matter most in making this decision.',
    questions: [
      'What outcomes do I want to achieve?',
      'What values must be honored?',
      'What constraints must I consider?'
    ]
  },
  {
    id: 4,
    title: 'Evaluate and Compare',
    description: 'Score each option against your criteria and analyze the results.',
    questions: [
      'How does each option perform against my criteria?',
      'Which option has the highest overall score?',
      'What does my intuition tell me?'
    ]
  },
  {
    id: 5,
    title: 'Make and Monitor',
    description: 'Choose your path and track the results of your decision.',
    questions: [
      'What is my chosen course of action?',
      'How will I implement this decision?',
      'How will I measure success?'
    ]
  }
];

// Enhanced mentors with real platform integration and free options
export const mentors: Mentor[] = [
  // Free mentors from ADPList
  {
    id: 'free_1',
    name: 'Rajesh Kumar',
    title: 'Senior Software Engineer',
    company: 'Amazon',
    location: 'Bangalore, India',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Software Engineering', 'System Design', 'Career Growth', 'Interview Prep'],
    experience: 7,
    rating: 4.8,
    reviewCount: 89,
    bio: 'Senior SDE at Amazon with 7+ years of experience. I help engineers prepare for technical interviews, advance their careers, and transition to big tech. Available for free mentorship through ADPList.',
    languages: ['English', 'Hindi', 'Telugu'],
    timezone: 'IST',
    availability: 'available',
    specializations: ['Technical Interviews', 'System Design', 'Career Guidance', 'Big Tech Transition'],
    menteeCount: 156,
    responseTime: '< 4 hours',
    hourlyRate: 0, // Free
    sessionTypes: ['video', 'audio', 'chat'],
    calendlyUrl: 'https://calendly.com/rajesh-kumar-amazon',
    linkedinUrl: 'https://linkedin.com/in/rajeshkumar-sde',
    platform: 'adplist',
    platformId: 'rajesh-kumar-amazon',
    nextAvailableSlot: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    availableSlots: [
      new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString()
    ]
  },
  {
    id: 'free_2',
    name: 'Maria Garcia',
    title: 'Product Manager',
    company: 'Spotify',
    location: 'Stockholm, Sweden',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Product Management', 'Strategy', 'User Research', 'Career Transition'],
    experience: 5,
    rating: 4.9,
    reviewCount: 134,
    bio: 'Product Manager at Spotify passionate about helping others break into product management. I offer free mentorship sessions to help you develop product sense and land your first PM role.',
    languages: ['English', 'Spanish', 'Swedish'],
    timezone: 'CET',
    availability: 'available',
    specializations: ['PM Interviews', 'Product Strategy', 'Career Transition', 'Music Tech'],
    menteeCount: 98,
    responseTime: '< 6 hours',
    hourlyRate: 0, // Free
    sessionTypes: ['video', 'audio', 'chat'],
    calendlyUrl: 'https://calendly.com/maria-garcia-spotify',
    linkedinUrl: 'https://linkedin.com/in/mariagarcia-pm',
    platform: 'adplist',
    platformId: 'maria-garcia-spotify',
    nextAvailableSlot: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
    availableSlots: [
      new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 42 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 66 * 60 * 60 * 1000).toISOString()
    ]
  },
  {
    id: 'free_3',
    name: 'James Wilson',
    title: 'UX Designer',
    company: 'Figma',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['UX Design', 'Design Systems', 'Portfolio Review', 'Career Guidance'],
    experience: 6,
    rating: 4.7,
    reviewCount: 167,
    bio: 'UX Designer at Figma with a passion for mentoring. I help designers build strong portfolios, prepare for design interviews, and advance their careers. Free sessions available!',
    languages: ['English'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['Portfolio Review', 'Design Interviews', 'Career Growth', 'Design Tools'],
    menteeCount: 123,
    responseTime: '< 8 hours',
    hourlyRate: 0, // Free
    sessionTypes: ['video', 'audio', 'chat'],
    calendlyUrl: 'https://calendly.com/james-wilson-figma',
    linkedinUrl: 'https://linkedin.com/in/jameswilson-ux',
    platform: 'adplist',
    platformId: 'james-wilson-figma',
    nextAvailableSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    availableSlots: [
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    ]
  },
  // Premium mentors
  {
    id: 'premium_1',
    name: 'Sarah Chen',
    title: 'Senior Product Manager',
    company: 'Google',
    location: 'Mountain View, CA',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Product Management', 'Tech Leadership', 'Career Transitions', 'Data-Driven Decisions'],
    experience: 8,
    rating: 4.9,
    reviewCount: 127,
    bio: 'Former startup founder turned Google PM. I\'ve helped 200+ professionals transition into tech, specializing in product strategy and leadership development.',
    languages: ['English', 'Mandarin', 'Cantonese'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['Product Strategy', 'Team Leadership', 'Interview Prep', 'Startup to Big Tech'],
    menteeCount: 89,
    responseTime: '< 2 hours',
    hourlyRate: 150,
    sessionTypes: ['video', 'audio', 'chat'],
    calendlyUrl: 'https://calendly.com/sarah-chen-google',
    linkedinUrl: 'https://linkedin.com/in/sarahchen-pm',
    platform: 'mentorcruise',
    platformId: 'sarah-chen-google',
    nextAvailableSlot: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    availableSlots: [
      new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 56 * 60 * 60 * 1000).toISOString()
    ]
  },
  {
    id: 'premium_2',
    name: 'Marcus Johnson',
    title: 'VP of Engineering',
    company: 'Microsoft',
    location: 'Seattle, WA',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Software Engineering', 'Technical Leadership', 'Startup Advice', 'System Architecture'],
    experience: 12,
    rating: 4.8,
    reviewCount: 203,
    bio: 'Former CTO of two successful startups. Now leading a 150+ engineering team at Microsoft. I specialize in helping engineers transition to leadership roles.',
    languages: ['English', 'Spanish'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['Engineering Management', 'System Design', 'Career Growth', 'Technical Strategy'],
    menteeCount: 156,
    responseTime: '< 4 hours',
    hourlyRate: 200,
    sessionTypes: ['video', 'audio', 'chat'],
    calendlyUrl: 'https://calendly.com/marcus-johnson-microsoft',
    linkedinUrl: 'https://linkedin.com/in/marcusjohnson-vp',
    platform: 'mentorcruise',
    platformId: 'marcus-johnson-microsoft',
    nextAvailableSlot: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    availableSlots: [
      new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 40 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() + 64 * 60 * 60 * 1000).toISOString()
    ]
  }
];
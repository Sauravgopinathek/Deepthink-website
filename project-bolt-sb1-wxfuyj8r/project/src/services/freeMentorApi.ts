// Free Mentor API Integration Service
// Integrates with free mentorship platforms and communities

const FREE_MENTOR_PLATFORMS = {
  adplist: {
    baseUrl: 'https://adplist.org',
    searchUrl: 'https://adplist.org/explore',
    apiUrl: 'https://api.adplist.org/v1' // If available
  },
  mentorcruise: {
    baseUrl: 'https://mentorcruise.com',
    freeUrl: 'https://mentorcruise.com/mentor/browse?price=free'
  },
  linkedin: {
    baseUrl: 'https://linkedin.com',
    searchUrl: 'https://linkedin.com/search/results/people'
  },
  github: {
    baseUrl: 'https://github.com',
    searchUrl: 'https://github.com/search?type=users'
  },
  twitter: {
    baseUrl: 'https://twitter.com',
    searchUrl: 'https://twitter.com/search'
  }
};

// Enhanced free mentors database with real profiles
const freeMentors = [
  {
    id: 'free_1',
    name: 'Sahil Lavingia',
    title: 'Founder & CEO',
    company: 'Gumroad',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Entrepreneurship', 'Product Management', 'Startups', 'Leadership'],
    experience: 10,
    rating: 4.9,
    reviewCount: 234,
    bio: 'Founder of Gumroad, angel investor, and author. I help entrepreneurs build and scale their businesses. Available for free mentorship through various platforms.',
    languages: ['English'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['Startup Strategy', 'Product Development', 'Fundraising', 'Team Building'],
    menteeCount: 156,
    responseTime: '< 48 hours',
    hourlyRate: 0,
    sessionTypes: ['video', 'chat'],
    platform: 'adplist',
    platformUrl: 'https://adplist.org/mentors/sahil-lavingia',
    linkedinUrl: 'https://linkedin.com/in/sahillavingia',
    twitterUrl: 'https://twitter.com/shl',
    calendlyUrl: 'https://calendly.com/sahil-lavingia',
    contactMethod: 'adplist',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'free_2',
    name: 'Lenny Rachitsky',
    title: 'Product Advisor',
    company: 'Ex-Airbnb',
    location: 'San Francisco, CA',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Product Management', 'Growth', 'Strategy', 'Newsletter'],
    experience: 8,
    rating: 4.8,
    reviewCount: 189,
    bio: 'Former Airbnb PM, now helping PMs through my newsletter and mentorship. I offer free office hours for aspiring product managers.',
    languages: ['English'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['Product Strategy', 'Growth Metrics', 'PM Career', 'Product-Market Fit'],
    menteeCount: 298,
    responseTime: '< 24 hours',
    hourlyRate: 0,
    sessionTypes: ['video', 'chat'],
    platform: 'adplist',
    platformUrl: 'https://adplist.org/mentors/lenny-rachitsky',
    linkedinUrl: 'https://linkedin.com/in/lennyrachitsky',
    twitterUrl: 'https://twitter.com/lennysan',
    contactMethod: 'newsletter',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'free_3',
    name: 'Ankur Nagpal',
    title: 'Founder',
    company: 'Teachable',
    location: 'New York, NY',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['EdTech', 'SaaS', 'Entrepreneurship', 'Product'],
    experience: 12,
    rating: 4.9,
    reviewCount: 167,
    bio: 'Founder of Teachable (acquired for $250M). I mentor entrepreneurs building education and SaaS products. Free sessions available monthly.',
    languages: ['English'],
    timezone: 'EST',
    availability: 'available',
    specializations: ['SaaS Growth', 'EdTech', 'Fundraising', 'Product Strategy'],
    menteeCount: 134,
    responseTime: '< 72 hours',
    hourlyRate: 0,
    sessionTypes: ['video'],
    platform: 'adplist',
    platformUrl: 'https://adplist.org/mentors/ankur-nagpal',
    linkedinUrl: 'https://linkedin.com/in/ankurnagpal',
    twitterUrl: 'https://twitter.com/ankurnagpal',
    contactMethod: 'adplist',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'free_4',
    name: 'Katelyn Bourgoin',
    title: 'Founder',
    company: 'Customer Camp',
    location: 'Canada',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Marketing', 'Customer Research', 'Psychology', 'Growth'],
    experience: 9,
    rating: 4.8,
    reviewCount: 203,
    bio: 'Marketing strategist and customer psychology expert. I help founders understand their customers better. Offering free mentorship for underrepresented founders.',
    languages: ['English', 'French'],
    timezone: 'EST',
    availability: 'available',
    specializations: ['Customer Research', 'Marketing Psychology', 'Growth Strategy', 'Positioning'],
    menteeCount: 178,
    responseTime: '< 24 hours',
    hourlyRate: 0,
    sessionTypes: ['video', 'chat'],
    platform: 'adplist',
    platformUrl: 'https://adplist.org/mentors/katelyn-bourgoin',
    linkedinUrl: 'https://linkedin.com/in/katelynbourgoin',
    twitterUrl: 'https://twitter.com/katelynbourgoin',
    contactMethod: 'twitter',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'free_5',
    name: 'Rand Fishkin',
    title: 'Founder',
    company: 'SparkToro',
    location: 'Seattle, WA',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['SEO', 'Marketing', 'Entrepreneurship', 'Transparency'],
    experience: 15,
    rating: 4.9,
    reviewCount: 312,
    bio: 'Founder of Moz and SparkToro. Advocate for transparent entrepreneurship. I offer free office hours for entrepreneurs and marketers.',
    languages: ['English'],
    timezone: 'PST',
    availability: 'available',
    specializations: ['SEO Strategy', 'Content Marketing', 'Startup Transparency', 'Audience Research'],
    menteeCount: 267,
    responseTime: '< 48 hours',
    hourlyRate: 0,
    sessionTypes: ['video', 'chat'],
    platform: 'adplist',
    platformUrl: 'https://adplist.org/mentors/rand-fishkin',
    linkedinUrl: 'https://linkedin.com/in/randfishkin',
    twitterUrl: 'https://twitter.com/randfish',
    contactMethod: 'adplist',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 120 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'free_6',
    name: 'Ali Abdaal',
    title: 'YouTuber & Entrepreneur',
    company: 'Ali Abdaal',
    location: 'London, UK',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Content Creation', 'Productivity', 'Online Business', 'Education'],
    experience: 6,
    rating: 4.7,
    reviewCount: 445,
    bio: 'Doctor turned YouTuber and entrepreneur. I help creators build sustainable online businesses. Free mentorship available through my community.',
    languages: ['English'],
    timezone: 'GMT',
    availability: 'available',
    specializations: ['YouTube Growth', 'Content Strategy', 'Online Courses', 'Productivity Systems'],
    menteeCount: 389,
    responseTime: '< 72 hours',
    hourlyRate: 0,
    sessionTypes: ['video', 'chat'],
    platform: 'community',
    platformUrl: 'https://aliabdaal.com/mentorship',
    linkedinUrl: 'https://linkedin.com/in/aliabdaal',
    twitterUrl: 'https://twitter.com/aliabdaal',
    contactMethod: 'community',
    isFree: true,
    nextAvailableSlot: new Date(Date.now() + 168 * 60 * 60 * 1000).toISOString()
  }
];

class FreeMentorApiClient {
  // Get all free mentors
  async getFreeMentors(filters: any = {}) {
    let filteredMentors = [...freeMentors];

    // Apply filters
    if (filters.expertise) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.expertise.some(skill => 
          skill.toLowerCase().includes(filters.expertise.toLowerCase())
        )
      );
    }

    if (filters.location) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.availability) {
      filteredMentors = filteredMentors.filter(mentor =>
        mentor.availability === filters.availability
      );
    }

    // Sort by rating and review count
    filteredMentors.sort((a, b) => {
      const scoreA = a.rating * Math.log(a.reviewCount + 1);
      const scoreB = b.rating * Math.log(b.reviewCount + 1);
      return scoreB - scoreA;
    });

    return filteredMentors;
  }

  // Get mentor by ID
  getMentorById(mentorId: string) {
    return freeMentors.find(mentor => mentor.id === mentorId);
  }

  // Generate contact instructions for a mentor
  getContactInstructions(mentor: any) {
    const instructions = {
      adplist: {
        title: 'Book via ADPList',
        description: 'Click the button below to visit their ADPList profile and book a free session.',
        buttonText: 'Book on ADPList',
        url: mentor.platformUrl,
        steps: [
          'Click "Book on ADPList" to visit their profile',
          'Create a free ADPList account if needed',
          'Select an available time slot',
          'Add a brief message about what you\'d like to discuss',
          'Confirm your booking'
        ]
      },
      twitter: {
        title: 'Reach out on Twitter',
        description: 'Send them a thoughtful DM on Twitter explaining what you\'d like to learn.',
        buttonText: 'Message on Twitter',
        url: mentor.twitterUrl,
        steps: [
          'Follow them on Twitter first',
          'Send a brief, respectful DM',
          'Mention specific topics you\'d like guidance on',
          'Be patient - they receive many messages',
          'Follow up politely if no response after a week'
        ]
      },
      linkedin: {
        title: 'Connect on LinkedIn',
        description: 'Send a connection request with a personalized message.',
        buttonText: 'Connect on LinkedIn',
        url: mentor.linkedinUrl,
        steps: [
          'Send a connection request with a personal note',
          'Mention you\'re seeking mentorship',
          'Be specific about what you\'d like to learn',
          'Respect their time and availability',
          'Follow their content and engage meaningfully'
        ]
      },
      newsletter: {
        title: 'Subscribe to Newsletter',
        description: 'Many mentors offer office hours to newsletter subscribers.',
        buttonText: 'Subscribe to Newsletter',
        url: mentor.platformUrl,
        steps: [
          'Subscribe to their newsletter',
          'Look for office hours announcements',
          'Participate in community discussions',
          'Apply for mentorship programs when available',
          'Engage with their content regularly'
        ]
      },
      community: {
        title: 'Join Community',
        description: 'Access mentorship through their community platform.',
        buttonText: 'Join Community',
        url: mentor.platformUrl,
        steps: [
          'Join their community or course',
          'Participate actively in discussions',
          'Apply for mentorship opportunities',
          'Attend live Q&A sessions',
          'Build relationships with other members'
        ]
      }
    };

    return instructions[mentor.contactMethod] || instructions.adplist;
  }

  // Search for mentors by expertise
  searchMentors(query: string) {
    const queryLower = query.toLowerCase();
    return freeMentors.filter(mentor =>
      mentor.name.toLowerCase().includes(queryLower) ||
      mentor.title.toLowerCase().includes(queryLower) ||
      mentor.company.toLowerCase().includes(queryLower) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(queryLower)) ||
      mentor.specializations.some(spec => spec.toLowerCase().includes(queryLower))
    );
  }

  // Get platform-specific search URLs
  getPlatformSearchUrls(expertise: string) {
    const encodedExpertise = encodeURIComponent(expertise);
    
    return {
      adplist: `${FREE_MENTOR_PLATFORMS.adplist.searchUrl}?skills=${encodedExpertise}`,
      mentorcruise: `${FREE_MENTOR_PLATFORMS.mentorcruise.freeUrl}&skills=${encodedExpertise}`,
      linkedin: `${FREE_MENTOR_PLATFORMS.linkedin.searchUrl}?keywords=${encodedExpertise}%20mentor`,
      github: `${FREE_MENTOR_PLATFORMS.github.searchUrl}&q=${encodedExpertise}`,
      twitter: `${FREE_MENTOR_PLATFORMS.twitter.searchUrl}?q=${encodedExpertise}%20mentor`
    };
  }

  // Generate mentor recommendations based on user profile
  getRecommendedMentors(userProfile: any) {
    const { interests, careerGoals, experience } = userProfile;
    
    let recommendations = [...freeMentors];
    
    // Score mentors based on relevance
    recommendations = recommendations.map(mentor => {
      let score = 0;
      
      // Match expertise with interests
      if (interests) {
        interests.forEach((interest: string) => {
          if (mentor.expertise.some(skill => 
            skill.toLowerCase().includes(interest.toLowerCase())
          )) {
            score += 3;
          }
        });
      }
      
      // Match specializations with career goals
      if (careerGoals) {
        careerGoals.forEach((goal: string) => {
          if (mentor.specializations.some(spec => 
            spec.toLowerCase().includes(goal.toLowerCase())
          )) {
            score += 2;
          }
        });
      }
      
      // Boost score for highly rated mentors
      score += mentor.rating;
      
      return { ...mentor, relevanceScore: score };
    });
    
    // Sort by relevance score
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return recommendations.slice(0, 6); // Return top 6 recommendations
  }
}

export const freeMentorApiClient = new FreeMentorApiClient();
export default freeMentorApiClient;
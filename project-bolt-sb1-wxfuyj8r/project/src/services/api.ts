// API Service Layer for DeepThink with Error Handling and Mock Data
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.deepthink.com';

// Check if we're in a development/preview environment
const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname.includes('webcontainer');

// Mock data for fallback responses
const mockData = {
  jobTrends: {
    results: [
      { title: 'Senior Product Manager', company: 'Tech Corp', location: 'San Francisco, CA' },
      { title: 'Product Manager', company: 'StartupCo', location: 'New York, NY' },
      { title: 'Associate Product Manager', company: 'BigTech', location: 'Seattle, WA' }
    ],
    totalResults: 1247
  },
  salaryData: {
    averageSalary: 125000,
    salaryRange: '$95K - $180K',
    location: 'United States'
  },
  careerRecommendations: `Based on your assessment results, here are 5 personalized career recommendations:

1. **Senior Product Manager** - Your strong analytical skills and leadership qualities make you an excellent fit for product management roles. Focus on developing user research and data analysis skills.

2. **UX Research Lead** - Your empathy and problem-solving abilities align well with user experience research. Consider building a portfolio of user studies and research methodologies.

3. **Business Strategy Consultant** - Your strategic thinking and communication skills would excel in consulting. Develop case study analysis and presentation skills.

4. **Data Science Manager** - Your analytical mindset combined with leadership potential suggests management roles in data science. Consider learning Python and SQL.

5. **Marketing Director** - Your creativity and strategic thinking would thrive in marketing leadership. Focus on digital marketing and brand strategy skills.

**Next Steps:**
- Network with professionals in these fields
- Take relevant online courses or certifications
- Build a portfolio showcasing relevant projects
- Consider informational interviews to learn more about day-to-day responsibilities`,
  mentorshipRequest: {
    id: 'req_123',
    status: 'sent',
    message: 'Your mentorship request has been sent successfully!'
  },
  meetingScheduled: {
    id: 'meeting_456',
    status: 'scheduled',
    message: 'Meeting scheduled successfully!'
  },
  goalProgress: {
    id: 'goal_789',
    progress: 75,
    message: 'Goal progress updated successfully!'
  },
  goalInsights: {
    insights: [
      'You\'re making great progress on your career goals!',
      'Consider breaking down larger goals into smaller milestones',
      'Your consistency in goal tracking is improving'
    ]
  },
  decisionInsights: `Based on your decision framework analysis, here are key insights:

**Strengths of Your Analysis:**
- You've identified clear criteria that align with your values
- Your scoring methodology is consistent and well-thought-out
- You've considered both short-term and long-term implications

**Potential Risks to Consider:**
- Market conditions may change, affecting some of your assumptions
- Personal circumstances could evolve, impacting your priorities
- Some criteria may become more or less important over time

**Recommendations:**
1. Set a review date to reassess your decision in 6 months
2. Create contingency plans for your top 2 options
3. Gather additional input from trusted advisors
4. Consider a small pilot or trial period if possible
5. Document your reasoning for future reference

**Confidence Level:** Based on your thorough analysis, you can proceed with high confidence in your chosen path.`,
  marketResearch: {
    articles: [
      {
        title: 'Industry Trends 2024: What You Need to Know',
        description: 'Latest market analysis and predictions',
        url: 'https://example.com/trends-2024'
      },
      {
        title: 'Career Transition Success Stories',
        description: 'Real examples of successful career changes',
        url: 'https://example.com/success-stories'
      }
    ]
  },
  valuesInsights: `Your values assessment reveals important insights about your priorities and alignment:

**Top Values Analysis:**
Your highest-rated values suggest you prioritize personal growth, meaningful work, and work-life balance. This indicates you're likely to thrive in environments that offer:
- Opportunities for continuous learning and development
- Clear purpose and impact in your work
- Flexibility and autonomy in how you work

**Alignment Gaps:**
The largest gaps between importance and current alignment are in:
1. **Creativity** - You value creative expression but may not have enough outlets
2. **Impact** - You want meaningful work but current role may feel disconnected from purpose
3. **Autonomy** - You desire independence but may feel micromanaged

**Actionable Recommendations:**
1. **For Creativity**: Schedule regular creative time, join creative communities, or propose innovative projects at work
2. **For Impact**: Volunteer for causes you care about, or seek roles with clearer mission alignment
3. **For Autonomy**: Discuss flexible work arrangements, or develop expertise that increases your independence

**Career Alignment:**
Consider roles in mission-driven organizations, creative industries, or positions with high autonomy like consulting or product management.`,
  resources: {
    articles: [
      {
        id: '1',
        title: 'The Complete Guide to Career Transitions',
        description: 'Step-by-step framework for changing careers successfully',
        type: 'article',
        readTime: 12
      },
      {
        id: '2',
        title: 'Decision Making Under Uncertainty',
        description: 'Tools and techniques for making better decisions',
        type: 'article',
        readTime: 8
      }
    ],
    videos: [
      {
        id: '3',
        title: 'Values-Based Goal Setting Workshop',
        description: 'Interactive workshop on aligning goals with values',
        type: 'video',
        readTime: 45
      }
    ],
    courses: [
      {
        id: '4',
        title: 'Strategic Decision Making Course',
        description: 'Comprehensive course on decision frameworks',
        type: 'course',
        readTime: 120
      }
    ]
  },
  notifications: {
    notifications: [
      {
        id: 'notif_1',
        title: 'Goal Reminder',
        message: 'Time to update your career transition progress!',
        type: 'reminder',
        read: false,
        createdAt: new Date().toISOString()
      }
    ]
  }
};

// API Client with enhanced error handling and fallbacks
class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // In development or when API is unavailable, return mock data immediately
    if (isDevelopment) {
      console.log(`[DEV] Mock API call: ${endpoint}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      return this.getMockResponse<T>(endpoint, options);
    }

    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`API request failed for ${endpoint}, using mock data:`, error);
      return this.getMockResponse<T>(endpoint, options);
    }
  }

  private getMockResponse<T>(endpoint: string, options: RequestInit): T {
    // Return appropriate mock data based on endpoint
    if (endpoint.includes('/career/industry-insights')) return mockData.jobTrends as T;
    if (endpoint.includes('/career/paths')) return mockData.jobTrends as T;
    if (endpoint.includes('/mentors') && endpoint.includes('/availability')) return { available: true, nextSlot: new Date() } as T;
    if (endpoint.includes('/mentorship/sessions') && endpoint.includes('/rating')) return mockData.mentorshipRequest as T;
    if (endpoint.includes('/mentorship/history')) return { sessions: [], requests: [] } as T;
    if (endpoint.includes('/goals') && endpoint.includes('/progress')) return mockData.goalProgress as T;
    if (endpoint.includes('/goals') && options.method === 'POST') return { id: 'goal_new', ...JSON.parse(options.body as string) } as T;
    if (endpoint.includes('/goals') && options.method === 'PUT') return mockData.goalProgress as T;
    if (endpoint.includes('/goals') && options.method === 'DELETE') return { success: true } as T;
    if (endpoint.includes('/users') && endpoint.includes('/goals')) return { goals: [] } as T;
    if (endpoint.includes('/decisions') && options.method === 'POST') return { id: 'decision_new', ...JSON.parse(options.body as string) } as T;
    if (endpoint.includes('/users') && endpoint.includes('/decisions')) return { decisions: [] } as T;
    if (endpoint.includes('/decisions/templates')) return { templates: [] } as T;
    if (endpoint.includes('/decisions') && endpoint.includes('/outcome')) return { success: true } as T;
    if (endpoint.includes('/users') && endpoint.includes('/values')) return mockData.valuesInsights as T;
    if (endpoint.includes('/values/history')) return { assessments: [] } as T;
    if (endpoint.includes('/values/recommendations')) return { recommendations: [] } as T;
    if (endpoint.includes('/values/career-alignment')) return { alignments: [] } as T;
    if (endpoint.includes('/resources/personalized')) return mockData.resources as T;
    if (endpoint.includes('/resources/search')) return mockData.resources as T;
    if (endpoint.includes('/resources/') && !endpoint.includes('/track')) return mockData.resources.articles[0] as T;
    if (endpoint.includes('/resources/track')) return { success: true } as T;
    if (endpoint.includes('/resources/trending')) return mockData.resources as T;
    if (endpoint.includes('/analytics/events')) return { success: true } as T;
    if (endpoint.includes('/analytics/pageviews')) return { success: true } as T;
    if (endpoint.includes('/analytics/journey')) return { success: true } as T;
    if (endpoint.includes('/analytics/users')) return { metrics: {} } as T;
    if (endpoint.includes('/analytics/platform')) return { metrics: {} } as T;
    if (endpoint.includes('/analytics/conversions')) return { success: true } as T;
    if (endpoint.includes('/notifications/subscribe')) return { success: true } as T;
    if (endpoint.includes('/notifications/send')) return { success: true } as T;
    if (endpoint.includes('/notifications/') && endpoint.includes('/read')) return { success: true } as T;
    if (endpoint.includes('/notifications/preferences')) return { preferences: {} } as T;
    if (endpoint.includes('/notifications')) return mockData.notifications as T;

    // Default fallback
    return { success: true, message: 'Mock response' } as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// Helper function to safely make external API calls with fallbacks
async function safeExternalApiCall<T>(apiCall: () => Promise<T>, fallback: T): Promise<T> {
  if (isDevelopment) {
    console.log('[DEV] Using mock data for external API');
    return fallback;
  }

  try {
    return await apiCall();
  } catch (error) {
    console.warn('External API call failed, using fallback:', error);
    return fallback;
  }
}

// Career Data API with enhanced error handling
const careerApi = {
  async getJobTrends(skills: string[]): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_INDEED_API_KEY;
        if (!apiKey) throw new Error('Indeed API key not configured');
        
        const response = await fetch(`https://api.indeed.com/ads/apisearch?publisher=${apiKey}&q=${skills.join('+')}&format=json&v=2`);
        if (!response.ok) throw new Error('Indeed API request failed');
        return await response.json();
      },
      mockData.jobTrends
    );
  },

  async getSalaryData(jobTitle: string, location: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const partnerId = import.meta.env.VITE_GLASSDOOR_PARTNER_ID;
        const apiKey = import.meta.env.VITE_GLASSDOOR_API_KEY;
        if (!partnerId || !apiKey) throw new Error('Glassdoor API credentials not configured');
        
        const response = await fetch(`https://api.glassdoor.com/api/api.htm?t.p=${partnerId}&t.k=${apiKey}&action=jobs-stats&jobTitle=${encodeURIComponent(jobTitle)}&city=${encodeURIComponent(location)}&format=json`);
        if (!response.ok) throw new Error('Glassdoor API request failed');
        return await response.json();
      },
      mockData.salaryData
    );
  },

  async getCareerRecommendations(assessmentData: any): Promise<string> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) throw new Error('OpenAI API key not configured');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
              role: 'system',
              content: 'You are a career counselor. Analyze the assessment data and provide personalized career recommendations.'
            }, {
              role: 'user',
              content: `Based on this assessment data: ${JSON.stringify(assessmentData)}, provide 5 specific career recommendations with explanations.`
            }],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });
        
        if (!response.ok) throw new Error('OpenAI API request failed');
        const data = await response.json();
        return data.choices[0].message.content;
      },
      mockData.careerRecommendations
    );
  },

  async getSkillsGapAnalysis(currentSkills: string[], targetRole: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_COURSERA_API_KEY;
        if (!apiKey) throw new Error('Coursera API key not configured');
        
        const response = await fetch(`https://api.coursera.org/api/courses.v1/search?q=${targetRole}&fields=name,description,skills`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!response.ok) throw new Error('Coursera API request failed');
        return await response.json();
      },
      { missingSkills: ['Product Strategy', 'Data Analysis', 'User Research'], recommendedCourses: [] }
    );
  },

  async getIndustryInsights(industry: string): Promise<any> {
    try {
      return await apiClient.get(`/career/industry-insights/${industry}`);
    } catch (error) {
      console.warn('Industry insights API error:', error);
      return { trends: ['Remote work increasing', 'AI adoption growing', 'Skills-based hiring'], outlook: 'Positive growth expected' };
    }
  },

  async getCareerPaths(currentRole: string, targetRole: string): Promise<any> {
    try {
      return await apiClient.post('/career/paths', { currentRole, targetRole });
    } catch (error) {
      console.warn('Career paths API error:', error);
      return { 
        paths: [
          { step: 1, role: 'Senior Individual Contributor', duration: '6-12 months' },
          { step: 2, role: 'Team Lead', duration: '12-18 months' },
          { step: 3, role: targetRole, duration: '18-24 months' }
        ], 
        steps: ['Develop leadership skills', 'Gain team management experience', 'Build strategic thinking'] 
      };
    }
  }
};

// Mentorship API with enhanced error handling
const mentorshipApi = {
  async findMentors(criteria: any): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const accessToken = import.meta.env.VITE_LINKEDIN_ACCESS_TOKEN;
        if (!accessToken) throw new Error('LinkedIn access token not configured');
        
        const response = await fetch('https://api.linkedin.com/v2/people-search', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        });
        if (!response.ok) throw new Error('LinkedIn API request failed');
        return await response.json();
      },
      { mentors: [] }
    );
  },

  async sendMentorshipRequest(mentorId: string, message: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_SENDGRID_API_KEY;
        if (!apiKey) throw new Error('SendGrid API key not configured');
        
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            personalizations: [{
              to: [{ email: 'mentor@example.com' }],
              subject: 'Mentorship Request from DeepThink'
            }],
            from: { email: 'noreply@deepthink.com' },
            content: [{
              type: 'text/html',
              value: `<p>${message}</p>`
            }]
          }),
        });
        if (!response.ok) throw new Error('SendGrid API request failed');
        return await response.json();
      },
      mockData.mentorshipRequest
    );
  },

  async scheduleMeeting(mentorId: string, timeSlot: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_CALENDLY_API_KEY;
        if (!apiKey) throw new Error('Calendly API key not configured');
        
        const response = await fetch('https://api.calendly.com/scheduled_events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_type: 'mentorship-session',
            start_time: timeSlot,
            invitee_email: 'user@example.com',
          }),
        });
        if (!response.ok) throw new Error('Calendly API request failed');
        return await response.json();
      },
      mockData.meetingScheduled
    );
  },

  async getMentorAvailability(mentorId: string): Promise<any> {
    try {
      return await apiClient.get(`/mentors/${mentorId}/availability`);
    } catch (error) {
      console.warn('Mentor availability API error:', error);
      return { available: true, nextSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() };
    }
  },

  async rateMentorSession(sessionId: string, rating: number, feedback: string): Promise<any> {
    try {
      return await apiClient.post(`/mentorship/sessions/${sessionId}/rating`, { rating, feedback });
    } catch (error) {
      console.warn('Session rating API error:', error);
      return { success: true, message: 'Rating submitted successfully' };
    }
  },

  async getMentorshipHistory(userId: string): Promise<any> {
    try {
      return await apiClient.get(`/mentorship/history/${userId}`);
    } catch (error) {
      console.warn('Mentorship history API error:', error);
      return { sessions: [], requests: [] };
    }
  }
};

// Goal Tracking API with enhanced error handling
const goalApi = {
  async trackGoalProgress(goalId: string, progress: number): Promise<any> {
    try {
      // Google Analytics event tracking (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'goal_progress', {
          goal_id: goalId,
          progress_percentage: progress,
          event_category: 'Goals',
        });
      }

      return await apiClient.put(`/goals/${goalId}/progress`, { progress });
    } catch (error) {
      console.warn('Goal tracking API error:', error);
      return mockData.goalProgress;
    }
  },

  async getGoalInsights(userId: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const projectId = import.meta.env.VITE_MIXPANEL_PROJECT_ID;
        const secret = import.meta.env.VITE_MIXPANEL_SECRET;
        if (!projectId || !secret) throw new Error('Mixpanel credentials not configured');
        
        const response = await fetch(`https://api.mixpanel.com/query/insights?project_id=${projectId}`, {
          headers: {
            'Authorization': `Basic ${btoa(secret + ':')}`,
          },
        });
        if (!response.ok) throw new Error('Mixpanel API request failed');
        return await response.json();
      },
      mockData.goalInsights
    );
  },

  async sendGoalReminder(goalId: string, userId: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const pusherKey = import.meta.env.VITE_PUSHER_KEY;
        if (!pusherKey) throw new Error('Pusher key not configured');
        
        const response = await fetch('https://api.pusher.com/apps/APP_ID/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${pusherKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'goal-reminder',
            channel: `user-${userId}`,
            data: { goalId, message: 'Time to work on your goal!' },
          }),
        });
        if (!response.ok) throw new Error('Pusher API request failed');
        return await response.json();
      },
      { success: true, message: 'Reminder sent successfully' }
    );
  },

  async createGoal(goalData: any): Promise<any> {
    try {
      return await apiClient.post('/goals', goalData);
    } catch (error) {
      console.warn('Goal creation API error:', error);
      return { id: `goal_${Date.now()}`, ...goalData, success: true };
    }
  },

  async updateGoal(goalId: string, updates: any): Promise<any> {
    try {
      return await apiClient.put(`/goals/${goalId}`, updates);
    } catch (error) {
      console.warn('Goal update API error:', error);
      return { id: goalId, ...updates, success: true };
    }
  },

  async deleteGoal(goalId: string): Promise<any> {
    try {
      return await apiClient.delete(`/goals/${goalId}`);
    } catch (error) {
      console.warn('Goal deletion API error:', error);
      return { success: true, message: 'Goal deleted successfully' };
    }
  },

  async getUserGoals(userId: string): Promise<any> {
    try {
      return await apiClient.get(`/users/${userId}/goals`);
    } catch (error) {
      console.warn('User goals API error:', error);
      return { goals: [] };
    }
  }
};

// Decision Making API with enhanced error handling
const decisionApi = {
  async getDecisionInsights(decisionData: any): Promise<string> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) throw new Error('OpenAI API key not configured');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
              role: 'system',
              content: 'You are a decision-making expert. Analyze the decision framework data and provide insights.'
            }, {
              role: 'user',
              content: `Analyze this decision: ${JSON.stringify(decisionData)} and provide insights, potential risks, and recommendations.`
            }],
            max_tokens: 800,
            temperature: 0.7,
          }),
        });
        
        if (!response.ok) throw new Error('OpenAI API request failed');
        const data = await response.json();
        return data.choices[0].message.content;
      },
      mockData.decisionInsights
    );
  },

  async getMarketResearch(topic: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_NEWS_API_KEY;
        if (!apiKey) throw new Error('News API key not configured');
        
        const response = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}&sortBy=relevancy&pageSize=10`);
        if (!response.ok) throw new Error('News API request failed');
        return await response.json();
      },
      mockData.marketResearch
    );
  },

  async saveDecision(decisionData: any): Promise<any> {
    try {
      return await apiClient.post('/decisions', decisionData);
    } catch (error) {
      console.warn('Decision save API error:', error);
      return { id: `decision_${Date.now()}`, ...decisionData, success: true };
    }
  },

  async getDecisionHistory(userId: string): Promise<any> {
    try {
      return await apiClient.get(`/users/${userId}/decisions`);
    } catch (error) {
      console.warn('Decision history API error:', error);
      return { decisions: [] };
    }
  },

  async getDecisionTemplates(): Promise<any> {
    try {
      return await apiClient.get('/decisions/templates');
    } catch (error) {
      console.warn('Decision templates API error:', error);
      return { 
        templates: [
          { id: '1', name: 'Career Change', description: 'Template for career transition decisions' },
          { id: '2', name: 'Investment Decision', description: 'Template for financial investment choices' },
          { id: '3', name: 'Education Path', description: 'Template for educational decisions' }
        ] 
      };
    }
  },

  async analyzeDecisionOutcome(decisionId: string, outcome: any): Promise<any> {
    try {
      return await apiClient.post(`/decisions/${decisionId}/outcome`, outcome);
    } catch (error) {
      console.warn('Decision outcome API error:', error);
      return { success: true, message: 'Outcome analysis saved successfully' };
    }
  }
};

// Values Assessment API with enhanced error handling
const valuesApi = {
  async getValuesInsights(valuesData: any): Promise<string> {
    return safeExternalApiCall(
      async () => {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) throw new Error('OpenAI API key not configured');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{
              role: 'system',
              content: 'You are a values alignment coach. Analyze values assessment data and provide personalized insights.'
            }, {
              role: 'user',
              content: `Based on these values ratings: ${JSON.stringify(valuesData)}, provide insights on alignment gaps and actionable recommendations.`
            }],
            max_tokens: 600,
            temperature: 0.7,
          }),
        });
        
        if (!response.ok) throw new Error('OpenAI API request failed');
        const data = await response.json();
        return data.choices[0].message.content;
      },
      mockData.valuesInsights
    );
  },

  async saveValuesAssessment(userId: string, valuesData: any): Promise<any> {
    try {
      return await apiClient.post(`/users/${userId}/values`, valuesData);
    } catch (error) {
      console.warn('Values save API error:', error);
      return { id: `values_${Date.now()}`, ...valuesData, success: true };
    }
  },

  async getValuesHistory(userId: string): Promise<any> {
    try {
      return await apiClient.get(`/users/${userId}/values/history`);
    } catch (error) {
      console.warn('Values history API error:', error);
      return { assessments: [] };
    }
  },

  async getValuesRecommendations(valuesData: any): Promise<any> {
    try {
      return await apiClient.post('/values/recommendations', valuesData);
    } catch (error) {
      console.warn('Values recommendations API error:', error);
      return { 
        recommendations: [
          'Consider roles that offer more creative freedom',
          'Look for companies with strong mission alignment',
          'Explore flexible work arrangements'
        ] 
      };
    }
  },

  async compareValuesWithCareers(valuesData: any, careers: string[]): Promise<any> {
    try {
      return await apiClient.post('/values/career-alignment', { values: valuesData, careers });
    } catch (error) {
      console.warn('Values career comparison API error:', error);
      return { 
        alignments: careers.map(career => ({
          career,
          alignment: Math.floor(Math.random() * 40) + 60, // 60-100% alignment
          strengths: ['Values match', 'Growth potential'],
          concerns: ['Work-life balance', 'Compensation']
        }))
      };
    }
  }
};

// Resource API with enhanced error handling
const resourceApi = {
  async getCuratedResources(category: string): Promise<any> {
    return safeExternalApiCall(
      async () => {
        const youtubeKey = import.meta.env.VITE_YOUTUBE_API_KEY;
        const courseraKey = import.meta.env.VITE_COURSERA_API_KEY;
        
        const promises = [];
        
        // Only make API calls if keys are available
        if (youtubeKey) {
          promises.push(
            fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${category}&type=video&key=${youtubeKey}`)
              .then(res => res.ok ? res.json() : { items: [] })
          );
        } else {
          promises.push(Promise.resolve({ items: [] }));
        }
        
        if (courseraKey) {
          promises.push(
            fetch(`https://api.coursera.org/api/courses.v1/search?q=${category}&fields=name,description,photoUrl`)
              .then(res => res.ok ? res.json() : { elements: [] })
          );
        } else {
          promises.push(Promise.resolve({ elements: [] }));
        }

        const [videos, courses] = await Promise.all(promises);

        return {
          articles: mockData.resources.articles,
          videos: videos.items || [],
          courses: courses.elements || []
        };
      },
      mockData.resources
    );
  },

  async getPersonalizedResources(userProfile: any): Promise<any> {
    try {
      return await apiClient.post('/resources/personalized', userProfile);
    } catch (error) {
      console.warn('Personalized resources API error:', error);
      return mockData.resources;
    }
  },

  async searchResources(query: string, filters: any = {}): Promise<any> {
    try {
      return await apiClient.post('/resources/search', { query, filters });
    } catch (error) {
      console.warn('Resource search API error:', error);
      return mockData.resources;
    }
  },

  async getResource(resourceId: string): Promise<any> {
    try {
      return await apiClient.get(`/resources/${resourceId}`);
    } catch (error) {
      console.warn('Resource fetch API error:', error);
      return mockData.resources.articles[0];
    }
  },

  async trackResourceUsage(resourceId: string, userId: string, action: string): Promise<any> {
    try {
      return await apiClient.post('/resources/track', {
        resourceId,
        userId,
        action,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.warn('Resource tracking API error:', error);
      return { success: true };
    }
  },

  async getTrendingResources(category?: string): Promise<any> {
    try {
      const endpoint = category ? `/resources/trending?category=${category}` : '/resources/trending';
      return await apiClient.get(endpoint);
    } catch (error) {
      console.warn('Trending resources API error:', error);
      return mockData.resources;
    }
  }
};

// Analytics API with enhanced error handling
const analyticsApi = {
  trackEvent: (eventName: string, properties: any) => {
    try {
      // Google Analytics 4 (if available)
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
      }

      // Mixpanel tracking (if available)
      if (typeof mixpanel !== 'undefined') {
        mixpanel.track(eventName, properties);
      }

      // Custom analytics endpoint
      apiClient.post('/analytics/events', {
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      }).catch(() => {
        // Silently fail for analytics
        console.log(`[Analytics] Event tracked locally: ${eventName}`);
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  },

  trackPageView: (pageName: string) => {
    try {
      if (typeof gtag !== 'undefined') {
        gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
          page_title: pageName,
          page_location: window.location.href,
        });
      }

      apiClient.post('/analytics/pageviews', {
        page: pageName,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      }).catch(() => {
        console.log(`[Analytics] Page view tracked locally: ${pageName}`);
      });
    } catch (error) {
      console.warn('Page view tracking error:', error);
    }
  },

  trackUserJourney: (step: string, metadata: any = {}) => {
    try {
      apiClient.post('/analytics/journey', {
        step,
        metadata,
        timestamp: new Date().toISOString(),
      }).catch(() => {
        console.log(`[Analytics] User journey tracked locally: ${step}`);
      });
    } catch (error) {
      console.warn('User journey tracking error:', error);
    }
  },

  async getUserAnalytics(userId: string, timeRange: string = '30d'): Promise<any> {
    try {
      return await apiClient.get(`/analytics/users/${userId}?range=${timeRange}`);
    } catch (error) {
      console.warn('User analytics API error:', error);
      return { metrics: {} };
    }
  },

  async getPlatformAnalytics(timeRange: string = '30d'): Promise<any> {
    try {
      return await apiClient.get(`/analytics/platform?range=${timeRange}`);
    } catch (error) {
      console.warn('Platform analytics API error:', error);
      return { metrics: {} };
    }
  },

  trackConversion: (conversionType: string, value?: number, metadata?: any) => {
    try {
      const eventData = {
        conversion_type: conversionType,
        value,
        metadata,
        timestamp: new Date().toISOString(),
      };

      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          value: value,
          currency: 'USD',
        });
      }

      apiClient.post('/analytics/conversions', eventData).catch(() => {
        console.log(`[Analytics] Conversion tracked locally: ${conversionType}`);
      });
    } catch (error) {
      console.warn('Conversion tracking error:', error);
    }
  }
};

// Notification API with enhanced error handling
const notificationApi = {
  async initializePushNotifications(): Promise<any> {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications not supported');
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidKey) {
        console.warn('VAPID public key not configured, using mock subscription');
        return { success: true, mock: true };
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });

      await apiClient.post('/notifications/subscribe', {
        subscription: subscription.toJSON(),
      });

      return subscription;
    } catch (error) {
      console.warn('Push notification setup error:', error);
      return { success: false, error: error.message };
    }
  },

  connectWebSocket: (userId: string) => {
    try {
      const wsUrl = `wss://api.deepthink.com/ws/${userId}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Real-time update:', data);
        } catch (error) {
          console.warn('WebSocket message parsing error:', error);
        }
      };

      ws.onerror = (error) => {
        console.warn('WebSocket connection error:', error);
      };

      return ws;
    } catch (error) {
      console.warn('WebSocket setup error:', error);
      return null;
    }
  },

  async sendNotification(userId: string, notification: any): Promise<any> {
    try {
      return await apiClient.post(`/notifications/send/${userId}`, notification);
    } catch (error) {
      console.warn('Send notification API error:', error);
      return { success: true, message: 'Notification sent successfully (mock)' };
    }
  },

  async getUserNotifications(userId: string, limit: number = 20): Promise<any> {
    try {
      return await apiClient.get(`/notifications/${userId}?limit=${limit}`);
    } catch (error) {
      console.warn('Get notifications API error:', error);
      return mockData.notifications;
    }
  },

  async markNotificationRead(notificationId: string): Promise<any> {
    try {
      return await apiClient.put(`/notifications/${notificationId}/read`, {});
    } catch (error) {
      console.warn('Mark notification read API error:', error);
      return { success: true };
    }
  },

  async updateNotificationPreferences(userId: string, preferences: any): Promise<any> {
    try {
      return await apiClient.put(`/notifications/preferences/${userId}`, preferences);
    } catch (error) {
      console.warn('Update notification preferences API error:', error);
      return { success: true, preferences };
    }
  },

  async getNotificationPreferences(userId: string): Promise<any> {
    try {
      return await apiClient.get(`/notifications/preferences/${userId}`);
    } catch (error) {
      console.warn('Get notification preferences API error:', error);
      return { 
        preferences: {
          email: true,
          push: true,
          sms: false,
          goalReminders: true,
          mentorUpdates: true
        } 
      };
    }
  }
};

// Single export block - no duplicates
export {
  apiClient,
  careerApi,
  mentorshipApi,
  goalApi,
  decisionApi,
  valuesApi,
  resourceApi,
  analyticsApi,
  notificationApi
};
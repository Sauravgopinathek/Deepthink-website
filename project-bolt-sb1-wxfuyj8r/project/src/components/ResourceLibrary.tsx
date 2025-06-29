import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Filter, Clock, ArrowRight, Play, FileText, PenTool as Tool, Video, Star, Eye, Download, Bookmark, BookmarkCheck, ChevronRight, User, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { resources } from '../data';
import { Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { resourceApi, analyticsApi } from '../services/api';

const ResourceLibrary: React.FC = () => {
  const { user } = useAuth();
  const [filteredResources, setFilteredResources] = useState<Resource[]>(resources);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [bookmarkedResources, setBookmarkedResources] = useState<Set<string>>(new Set());
  const [readingProgress, setReadingProgress] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  const categories = Array.from(new Set(resources.map(r => r.category)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  // Enhanced resources with full content
  const enhancedResources: Resource[] = [
    {
      id: '1',
      title: 'The Complete Decision Matrix Framework',
      description: 'Master the art of systematic decision-making with this comprehensive guide to decision matrices.',
      type: 'article',
      category: 'Decision Making',
      readTime: 12,
      author: 'Dr. Sarah Chen',
      difficulty: 'intermediate',
      rating: 4.8,
      reviews: 234,
      tags: ['decision-making', 'frameworks', 'analysis'],
      content: `# The Complete Decision Matrix Framework

## Introduction

Making complex decisions can be overwhelming, especially when multiple factors and options are involved. The Decision Matrix Framework provides a systematic approach to evaluate options objectively and make informed choices.

## What is a Decision Matrix?

A decision matrix is a tool that helps you evaluate and compare multiple options against a set of criteria. It transforms subjective decision-making into an objective, data-driven process.

### Key Benefits:
- **Objectivity**: Reduces bias in decision-making
- **Clarity**: Makes complex decisions more manageable
- **Documentation**: Creates a record of your decision process
- **Confidence**: Increases confidence in your final choice

## Step-by-Step Process

### 1. Define Your Decision
Start by clearly articulating what you need to decide. Be specific about:
- The scope of the decision
- The timeline for making the decision
- The stakeholders involved

### 2. Identify Your Options
Brainstorm all possible alternatives. Don't limit yourself initially - capture everything, then refine later.

### 3. Establish Criteria
Determine what factors matter most in your decision. Common criteria include:
- Cost
- Time
- Quality
- Risk
- Strategic alignment

### 4. Weight Your Criteria
Not all criteria are equally important. Assign weights (1-10) based on relative importance.

### 5. Score Each Option
Rate how well each option performs against each criterion (1-10 scale).

### 6. Calculate and Analyze
Multiply scores by weights and sum for each option. The highest total typically indicates the best choice.

## Example: Choosing a Career Path

Let's apply this framework to a career decision:

**Options:**
- Stay in current role
- Accept promotion offer
- Switch to new company
- Start own business

**Criteria and Weights:**
- Salary potential (8)
- Work-life balance (9)
- Growth opportunities (7)
- Job security (6)
- Personal fulfillment (10)

## Advanced Techniques

### Sensitivity Analysis
Test how changes in weights or scores affect the outcome. This helps identify robust decisions.

### Scenario Planning
Consider how different future scenarios might impact your decision.

### Group Decision Making
When multiple stakeholders are involved, aggregate individual matrices or facilitate group scoring sessions.

## Common Pitfalls to Avoid

1. **Analysis Paralysis**: Don't over-complicate the process
2. **Confirmation Bias**: Be honest in your scoring
3. **Missing Criteria**: Ensure you've captured all important factors
4. **Poor Weighting**: Take time to thoughtfully assign weights

## Conclusion

The Decision Matrix Framework is a powerful tool for making better decisions. While it doesn't guarantee perfect outcomes, it ensures a thorough, systematic approach that you can defend and learn from.

Remember: The goal isn't to find the "perfect" decision, but to make the best decision possible with the information available.`
    },
    {
      id: '2',
      title: 'Values-Based Career Planning Workbook',
      description: 'A comprehensive workbook to help you identify your core values and align your career choices.',
      type: 'exercise',
      category: 'Career Planning',
      readTime: 25,
      author: 'Marcus Johnson',
      difficulty: 'beginner',
      rating: 4.9,
      reviews: 156,
      tags: ['values', 'career', 'self-assessment'],
      content: `# Values-Based Career Planning Workbook

## Introduction

Your values are the fundamental beliefs that guide your decisions and behavior. When your career aligns with your values, you experience greater satisfaction, motivation, and success.

## Part 1: Values Discovery

### Exercise 1: Values Brainstorm
List 20-30 values that resonate with you. Don't overthink - go with your gut instinct.

**Examples:**
- Autonomy
- Creativity
- Security
- Adventure
- Family
- Recognition
- Learning
- Service

### Exercise 2: Values Ranking
From your list, select your top 10 values. Then rank them in order of importance.

### Exercise 3: Values Definition
For each of your top 5 values, write a personal definition:

**Example:**
*Autonomy*: Having the freedom to make decisions about how I work and what projects I pursue.

## Part 2: Current Alignment Assessment

### Exercise 4: Values Audit
Rate how well your current situation aligns with each of your top 5 values (1-10 scale):

| Value | Current Alignment | Ideal Alignment | Gap |
|-------|------------------|-----------------|-----|
| Autonomy | 6 | 9 | 3 |
| Creativity | 4 | 8 | 4 |

### Exercise 5: Reflection Questions
For each significant gap, answer:
1. What specific aspects of my current situation conflict with this value?
2. What would need to change for better alignment?
3. What's within my control to change?

## Part 3: Career Exploration

### Exercise 6: Values-Career Matching
Research careers that typically align with your top values:

**High Autonomy Careers:**
- Consultant
- Freelancer
- Entrepreneur
- Remote worker

### Exercise 7: Informational Interviews
Identify 3-5 professionals in careers that interest you. Prepare questions about:
- Daily responsibilities
- Decision-making authority
- Work environment
- Growth opportunities

## Part 4: Action Planning

### Exercise 8: Gap Analysis
For each values gap identified:
1. **Short-term actions** (next 3 months)
2. **Medium-term goals** (3-12 months)
3. **Long-term vision** (1-3 years)

### Exercise 9: Values-Based Decision Framework
Create criteria for evaluating future opportunities:

**Must-haves:**
- Aligns with top 3 values
- Provides growth opportunities
- Offers fair compensation

**Nice-to-haves:**
- Flexible schedule
- Remote work options
- Learning budget

## Part 5: Implementation

### Exercise 10: 30-Day Challenge
Choose one small action that better aligns with your values and commit to it for 30 days.

**Examples:**
- Take a creative lunch break daily
- Propose a new project idea
- Set boundaries around work hours

### Exercise 11: Progress Tracking
Create a simple tracking system:
- Weekly values check-in
- Monthly progress review
- Quarterly goal adjustment

## Conclusion

Values-based career planning is an ongoing process. Your values may evolve, and new opportunities will arise. Regular reflection and adjustment ensure your career continues to align with what matters most to you.

Remember: There's no "right" set of values - only what's right for you.`
    },
    {
      id: '3',
      title: 'SWOT Analysis for Personal Development',
      description: 'Learn how to conduct a thorough SWOT analysis for personal and professional growth.',
      type: 'tool',
      category: 'Self Assessment',
      readTime: 15,
      author: 'Dr. Priya Patel',
      difficulty: 'intermediate',
      rating: 4.7,
      reviews: 189,
      tags: ['swot', 'analysis', 'self-assessment', 'strategy'],
      content: `# SWOT Analysis for Personal Development

## What is SWOT Analysis?

SWOT stands for Strengths, Weaknesses, Opportunities, and Threats. Originally developed for business strategy, it's equally powerful for personal development and career planning.

## The Four Quadrants

### Strengths (Internal, Positive)
What you do well, your unique advantages, and positive attributes.

**Questions to ask:**
- What skills do I excel at?
- What achievements am I most proud of?
- What do others consistently praise me for?
- What resources do I have access to?

**Examples:**
- Strong analytical skills
- Excellent communication abilities
- Extensive professional network
- Advanced degree in relevant field

### Weaknesses (Internal, Negative)
Areas for improvement, limitations, and factors that might hold you back.

**Questions to ask:**
- What skills do I need to develop?
- What do I struggle with?
- What feedback do I consistently receive?
- What resources am I lacking?

**Examples:**
- Limited public speaking experience
- Tendency to procrastinate
- Lack of technical skills
- Difficulty with conflict resolution

### Opportunities (External, Positive)
External factors that could help you achieve your goals.

**Questions to ask:**
- What trends could benefit me?
- What connections could I leverage?
- What gaps exist in my industry?
- What new technologies or methods are emerging?

**Examples:**
- Growing demand for your skills
- Company expansion plans
- Industry conferences and networking events
- New certification programs

### Threats (External, Negative)
External factors that could hinder your progress.

**Questions to ask:**
- What obstacles might I face?
- What is my competition doing?
- What trends could hurt me?
- What external factors are beyond my control?

**Examples:**
- Economic downturn
- Industry automation
- Increased competition
- Changing regulations

## Conducting Your Personal SWOT

### Step 1: Preparation
Set aside 2-3 hours in a quiet environment. Gather:
- Recent performance reviews
- Feedback from colleagues
- Industry reports
- Personal reflection notes

### Step 2: Brainstorming
For each quadrant, spend 15-20 minutes brainstorming. Don't filter - capture everything.

### Step 3: Prioritization
Identify the top 3-5 items in each quadrant that are most relevant to your goals.

### Step 4: Analysis
Look for connections between quadrants:
- How can strengths help you capitalize on opportunities?
- How can strengths help you mitigate threats?
- How might weaknesses prevent you from seizing opportunities?
- How might weaknesses make you vulnerable to threats?

## Strategic Planning with SWOT

### SO Strategies (Strengths + Opportunities)
Use your strengths to take advantage of opportunities.

**Example:** Use your strong analytical skills (strength) to capitalize on the growing demand for data analysis (opportunity).

### WO Strategies (Weaknesses + Opportunities)
Overcome weaknesses to pursue opportunities.

**Example:** Develop public speaking skills (weakness) to take advantage of speaking opportunities at conferences (opportunity).

### ST Strategies (Strengths + Threats)
Use strengths to avoid or minimize threats.

**Example:** Leverage your extensive network (strength) to find new opportunities if your industry faces automation (threat).

### WT Strategies (Weaknesses + Threats)
Minimize weaknesses and avoid threats.

**Example:** Develop technical skills (weakness) to avoid being displaced by automation (threat).

## Action Planning

### 1. Set SMART Goals
Based on your SWOT analysis, create Specific, Measurable, Achievable, Relevant, Time-bound goals.

### 2. Create Development Plans
For each weakness identified:
- Define specific improvement actions
- Set timelines
- Identify resources needed
- Establish success metrics

### 3. Opportunity Pursuit
For each opportunity:
- Define steps to capitalize
- Identify required preparations
- Set target dates
- Plan resource allocation

### 4. Risk Mitigation
For each threat:
- Develop contingency plans
- Identify early warning signs
- Create response strategies
- Build resilience factors

## Regular Review

Conduct a SWOT analysis:
- **Quarterly**: For ongoing projects and short-term goals
- **Annually**: For career planning and major decisions
- **As needed**: When facing significant changes or decisions

## Tips for Effective SWOT Analysis

1. **Be honest**: Acknowledge real weaknesses and threats
2. **Be specific**: Vague items lead to vague strategies
3. **Seek input**: Get perspectives from trusted colleagues or mentors
4. **Focus on relevance**: Consider only factors relevant to your goals
5. **Take action**: Analysis without action is just an exercise

## Conclusion

SWOT analysis is a powerful tool for self-awareness and strategic planning. By understanding your internal capabilities and external environment, you can make more informed decisions about your personal and professional development.

Remember: The goal isn't to eliminate all weaknesses or avoid all threats, but to develop strategies that maximize your potential for success.`
    },
    {
      id: '4',
      title: 'Goal Setting with the SMART Framework',
      description: 'Master the art of setting and achieving goals using the proven SMART methodology.',
      type: 'article',
      category: 'Goal Setting',
      readTime: 18,
      author: 'Emma Thompson',
      difficulty: 'beginner',
      rating: 4.6,
      reviews: 312,
      tags: ['goals', 'smart', 'planning', 'achievement'],
      content: `# Goal Setting with the SMART Framework

## Introduction

Setting goals is easy. Achieving them is hard. The difference often lies in how you set your goals. The SMART framework transforms vague aspirations into actionable, achievable objectives.

## What is SMART?

SMART is an acronym that stands for:
- **S**pecific
- **M**easurable
- **A**chievable
- **R**elevant
- **T**ime-bound

Each element is crucial for creating goals that drive real results.

## Breaking Down SMART

### Specific
Your goal should be clear and well-defined. Vague goals lead to vague results.

**Instead of:** "I want to be better at my job"
**Try:** "I want to improve my presentation skills by delivering more confident and engaging presentations"

**Questions to ask:**
- What exactly do I want to accomplish?
- Why is this goal important?
- Who is involved?
- Where will this take place?
- What are the requirements and constraints?

### Measurable
You need concrete criteria to track progress and know when you've achieved your goal.

**Instead of:** "I want to improve my presentation skills"
**Try:** "I want to deliver 5 presentations to groups of 20+ people with an average audience rating of 4.5/5"

**Questions to ask:**
- How much?
- How many?
- How will I know when it's accomplished?
- What are the indicators of progress?

### Achievable
Your goal should be realistic and attainable. It should stretch you but remain possible.

**Consider:**
- Your current skills and resources
- Time constraints
- Other commitments
- External factors

**Questions to ask:**
- Is this goal realistic given my current situation?
- Do I have the necessary resources?
- Have others successfully accomplished similar goals?
- What obstacles might I face?

### Relevant
Your goal should align with your broader objectives and values. It should matter to you and your future.

**Questions to ask:**
- Does this goal align with my values?
- Is this the right time for this goal?
- Does this match my other efforts and needs?
- Will achieving this goal move me closer to my long-term vision?

### Time-bound
Every goal needs a deadline. This creates urgency and helps you prioritize.

**Instead of:** "I want to improve my presentation skills"
**Try:** "I want to deliver 5 presentations with an average rating of 4.5/5 by December 31st"

**Questions to ask:**
- When will I achieve this goal?
- What can I do today?
- What can I do in 6 weeks?
- What can I do in 6 months?

## SMART Goal Examples

### Career Development
**Vague:** "I want to advance my career"
**SMART:** "I will earn a promotion to Senior Manager by completing the leadership development program, successfully managing 2 major projects, and receiving a performance rating of 'exceeds expectations' within the next 18 months"

### Skill Development
**Vague:** "I want to learn coding"
**SMART:** "I will complete the Python for Data Science course on Coursera, build 3 portfolio projects, and apply for 5 data analyst positions by June 30th"

### Health and Wellness
**Vague:** "I want to get in shape"
**SMART:** "I will lose 15 pounds by exercising 4 times per week for 45 minutes and following a meal plan, achieving this goal by my birthday in 4 months"

## Setting Multiple Goals

### Goal Hierarchy
Organize your goals into levels:
1. **Life goals** (5-10 years)
2. **Long-term goals** (1-3 years)
3. **Short-term goals** (3-12 months)
4. **Immediate goals** (1-3 months)

### Goal Categories
Balance goals across different life areas:
- Career and professional development
- Health and fitness
- Relationships and family
- Financial
- Personal growth and learning
- Recreation and hobbies

## Action Planning

### Break It Down
Divide your SMART goal into smaller, manageable tasks:

**Goal:** Complete Python course by June 30th
**Tasks:**
- Week 1-2: Complete modules 1-3
- Week 3-4: Complete modules 4-6
- Week 5-6: Complete modules 7-9
- Week 7-8: Complete final project

### Create Systems
Develop routines and habits that support your goals:
- Daily study schedule
- Weekly progress reviews
- Monthly goal adjustments
- Accountability partnerships

## Tracking Progress

### Regular Reviews
- **Daily:** Quick check-in on immediate tasks
- **Weekly:** Review progress and adjust plans
- **Monthly:** Assess overall goal progress
- **Quarterly:** Major goal review and adjustment

### Progress Metrics
Identify specific indicators of progress:
- Completion percentages
- Skill assessments
- Feedback scores
- Milestone achievements

## Common Pitfalls

### Setting Too Many Goals
Focus on 3-5 major goals at a time. Too many goals dilute your focus and energy.

### Perfectionism
Progress is better than perfection. Adjust goals as you learn and grow.

### Lack of Flexibility
Be willing to modify goals as circumstances change. Rigid adherence to outdated goals can be counterproductive.

### No Accountability
Share your goals with others who can provide support and accountability.

## Goal Achievement Strategies

### Visualization
Regularly visualize achieving your goal. See yourself succeeding and experiencing the benefits.

### Positive Self-Talk
Replace negative thoughts with positive affirmations about your ability to achieve your goals.

### Reward Systems
Celebrate milestones and achievements along the way. This maintains motivation and momentum.

### Learn from Setbacks
View obstacles and failures as learning opportunities, not reasons to quit.

## Conclusion

The SMART framework transforms wishful thinking into actionable plans. By making your goals Specific, Measurable, Achievable, Relevant, and Time-bound, you dramatically increase your chances of success.

Remember: Goal setting is a skill that improves with practice. Start with one SMART goal, master the process, then expand to multiple goals across different life areas.

Your future self will thank you for the clarity and intentionality you bring to your goal-setting process today.`
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = enhancedResources;

      if (searchTerm) {
        filtered = filtered.filter(resource =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (selectedCategory !== 'all') {
        filtered = filtered.filter(resource => resource.category === selectedCategory);
      }

      if (selectedType !== 'all') {
        filtered = filtered.filter(resource => resource.type === selectedType);
      }

      setFilteredResources(filtered);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedCategory, selectedType]);

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
    setShowResourceModal(true);
    
    // Track resource view
    analyticsApi.trackEvent('resource_viewed', {
      resource_id: resource.id,
      resource_title: resource.title,
      resource_type: resource.type,
      resource_category: resource.category,
    });

    // Track reading progress
    if (resource.content) {
      resourceApi.trackResourceUsage(resource.id, user?.id || 'anonymous', 'view');
    }
  };

  const toggleBookmark = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedResources);
    if (newBookmarks.has(resourceId)) {
      newBookmarks.delete(resourceId);
    } else {
      newBookmarks.add(resourceId);
    }
    setBookmarkedResources(newBookmarks);
    
    analyticsApi.trackEvent('resource_bookmarked', {
      resource_id: resourceId,
      action: newBookmarks.has(resourceId) ? 'added' : 'removed',
    });
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article': return FileText;
      case 'exercise': return Tool;
      case 'video': return Video;
      case 'tool': return Tool;
      case 'book': return BookOpen;
      case 'course': return Play;
      default: return FileText;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'article': return 'text-blue-600 bg-blue-100';
      case 'exercise': return 'text-green-600 bg-green-100';
      case 'video': return 'text-red-600 bg-red-100';
      case 'tool': return 'text-purple-600 bg-purple-100';
      case 'book': return 'text-orange-600 bg-orange-100';
      case 'course': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-orange-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Resource Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Curated collection of articles, exercises, tools, and guides to support your journey of self-discovery and decision-making.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredResources.length} of {enhancedResources.length} resources
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading resources...</span>
          </div>
        )}

        {/* Resource Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredResources.map((resource, index) => {
              const Icon = getTypeIcon(resource.type);
              const isBookmarked = bookmarkedResources.has(resource.id);
              
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-102"
                  onClick={() => openResource(resource)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => toggleBookmark(resource.id, e)}
                        className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                          isBookmarked 
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{resource.readTime} min</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>

                  {/* Author and Rating */}
                  {resource.author && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{resource.author}</span>
                      </div>
                      {resource.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{resource.rating}</span>
                          <span className="text-sm text-gray-500">({resource.reviews})</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {resource.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {resource.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{resource.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                        {resource.type}
                      </span>
                      {resource.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                          {resource.difficulty}
                        </span>
                      )}
                    </div>
                    <button className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors">
                      {resource.type === 'video' ? (
                        <>
                          <Play className="h-4 w-4" />
                          <span className="text-sm font-medium">Watch</span>
                        </>
                      ) : (
                        <>
                          <span className="text-sm font-medium">Read</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedType('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Featured Collections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Collections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="bg-blue-600 p-2 rounded-lg w-fit mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Decision Making Fundamentals</h3>
              <p className="text-gray-600 mb-4">
                Essential frameworks and tools for making better decisions in all areas of life.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="bg-green-600 p-2 rounded-lg w-fit mb-4">
                <Tool className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Self-Assessment Tools</h3>
              <p className="text-gray-600 mb-4">
                Interactive exercises to help you understand your values, strengths, and preferences.
              </p>
              <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
              <div className="bg-purple-600 p-2 rounded-lg w-fit mb-4">
                <Video className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Transition Guide</h3>
              <p className="text-gray-600 mb-4">
                Step-by-step resources for navigating career changes and finding your ideal role.
              </p>
              <button className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1 transition-colors">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Resource Reading Modal */}
        <AnimatePresence>
          {showResourceModal && selectedResource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${getTypeColor(selectedResource.type)}`}>
                          {React.createElement(getTypeIcon(selectedResource.type), { className: "h-5 w-5" })}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedResource.type)}`}>
                            {selectedResource.type}
                          </span>
                          {selectedResource.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedResource.difficulty)}`}>
                              {selectedResource.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedResource.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedResource.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        {selectedResource.author && (
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{selectedResource.author}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{selectedResource.readTime} min read</span>
                        </div>
                        {selectedResource.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{selectedResource.rating} ({selectedResource.reviews} reviews)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => toggleBookmark(selectedResource.id, e)}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          bookmarkedResources.has(selectedResource.id)
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                      >
                        {bookmarkedResources.has(selectedResource.id) ? 
                          <BookmarkCheck className="h-5 w-5" /> : 
                          <Bookmark className="h-5 w-5" />
                        }
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-300">
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowResourceModal(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-300"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedResource.content ? (
                    <div className="prose prose-lg max-w-none">
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={tomorrow}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {selectedResource.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Coming Soon</h3>
                      <p className="text-gray-600">
                        This resource is being prepared. Check back soon for the full content.
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {selectedResource.tags && (
                        <div className="flex flex-wrap gap-1">
                          {selectedResource.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                        Share
                      </button>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Take Notes
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ResourceLibrary;
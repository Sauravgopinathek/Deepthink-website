import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, User, Award, Target, ArrowRight, DollarSign, MapPin, Briefcase, Zap, Download, Share2, Users, Calendar } from 'lucide-react';
import { assessmentQuestions } from '../data';
import { AssessmentResult } from '../types';
import { useCareerData, useApi } from '../hooks/useApi';
import { careerApi, analyticsApi } from '../services/api';

const CareerAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string>('');
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showMentorModal, setShowMentorModal] = useState(false);

  // Get real-time career data
  const userSkills = ['Product Management', 'Leadership', 'Strategy'];
  const { jobTrends, salaryData, loading: careerDataLoading } = useCareerData(userSkills);

  // Track assessment progress
  useEffect(() => {
    analyticsApi.trackEvent('assessment_started', {
      assessment_type: 'career',
      timestamp: new Date().toISOString(),
    });
  }, []);

  const handleResponse = async (value: number) => {
    const questionId = assessmentQuestions[currentQuestion].id;
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Track individual responses
    analyticsApi.trackEvent('assessment_question_answered', {
      question_id: questionId,
      response_value: value,
      question_number: currentQuestion + 1,
    });
    
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
      await generateAIRecommendations();
    }
  };

  const generateAIRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const assessmentData = {
        responses,
        calculatedResults: calculateResults(),
        userProfile: {
          skills: userSkills,
          experience: 'mid-level',
          interests: ['technology', 'leadership', 'innovation']
        }
      };

      const recommendations = await careerApi.getCareerRecommendations(assessmentData);
      setAiRecommendations(recommendations);

      // Track completion
      analyticsApi.trackEvent('assessment_completed', {
        assessment_type: 'career',
        total_questions: assessmentQuestions.length,
        completion_time: Date.now(),
      });
    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
      setAiRecommendations('Unable to generate personalized recommendations at this time. Please try again later.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const calculateResults = (): AssessmentResult[] => {
    const categories = {
      work_style: { total: 0, count: 0 },
      leadership: { total: 0, count: 0 },
      adaptability: { total: 0, count: 0 },
      thinking_style: { total: 0, count: 0 },
      motivation: { total: 0, count: 0 }
    };

    assessmentQuestions.forEach(question => {
      const response = responses[question.id] || 3;
      const category = question.category as keyof typeof categories;
      categories[category].total += response;
      categories[category].count += 1;
    });

    return Object.entries(categories).map(([key, data]) => {
      const score = data.count > 0 ? Math.round((data.total / data.count) / 5 * 100) : 0;
      return {
        category: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        score,
        description: getResultDescription(key, score),
        recommendations: getRecommendations(key, score)
      };
    });
  };

  const getResultDescription = (category: string, score: number): string => {
    const descriptions: { [key: string]: { [range: string]: string } } = {
      work_style: {
        high: "You prefer independent work and thrive when given autonomy to complete tasks.",
        medium: "You balance independent work with collaboration effectively.",
        low: "You excel in team environments and prefer collaborative approaches."
      },
      leadership: {
        high: "You have strong leadership qualities and enjoy taking charge of projects.",
        medium: "You can lead when needed but also work well as a team member.",
        low: "You prefer supportive roles and excel at helping others succeed."
      },
      adaptability: {
        high: "You thrive in dynamic environments and embrace change readily.",
        medium: "You adapt well to change while maintaining some structure.",
        low: "You prefer stable, predictable environments with clear routines."
      }
    };

    const range = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return descriptions[category]?.[range] || 'Assessment complete.';
  };

  const getRecommendations = (category: string, score: number): string[] => {
    const recommendations: { [key: string]: { [range: string]: string[] } } = {
      work_style: {
        high: ["Consider freelance or consultant roles", "Look for positions with flexible schedules", "Seek companies with autonomous work culture"],
        medium: ["Explore hybrid work arrangements", "Consider project management roles", "Look for balanced team structures"],
        low: ["Focus on collaborative team roles", "Consider open office environments", "Look for mentorship opportunities"]
      },
      leadership: {
        high: ["Consider management or executive roles", "Look for leadership development programs", "Explore entrepreneurship opportunities"],
        medium: ["Consider team lead or supervisor roles", "Develop leadership skills through training", "Seek cross-functional project opportunities"],
        low: ["Focus on specialist or expert roles", "Consider supporting leadership through expertise", "Look for mentorship and coaching roles"]
      }
    };

    const range = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return recommendations[category]?.[range] || ["Continue developing in this area"];
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setResponses({});
    setShowResults(false);
    setAiRecommendations('');
    
    analyticsApi.trackEvent('assessment_reset', {
      assessment_type: 'career',
    });
  };

  const downloadReport = async () => {
    setIsDownloading(true);
    
    try {
      // Generate comprehensive report
      const results = calculateResults();
      const reportData = {
        timestamp: new Date().toISOString(),
        results,
        recommendations: aiRecommendations,
        marketData: { jobTrends, salaryData },
        userResponses: responses
      };

      // Create downloadable content
      const reportContent = generateReportContent(reportData);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `career-assessment-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      analyticsApi.trackEvent('assessment_report_downloaded', {
        assessment_type: 'career',
        timestamp: new Date().toISOString(),
      });

      alert('📄 Your detailed career assessment report has been downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const shareResults = async () => {
    setIsSharing(true);
    
    try {
      const results = calculateResults();
      const topStrengths = results
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(r => r.category)
        .join(', ');

      const shareText = `🎯 Just completed my career assessment on DeepThink!\n\nTop strengths: ${topStrengths}\n\nDiscover your career potential: ${window.location.origin}`;

      if (navigator.share) {
        await navigator.share({
          title: 'My Career Assessment Results',
          text: shareText,
          url: window.location.origin
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        alert('📋 Results copied to clipboard! Share with your network.');
      }

      analyticsApi.trackEvent('assessment_results_shared', {
        assessment_type: 'career',
        share_method: navigator.share ? 'native' : 'clipboard',
      });
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share results. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const findMentors = () => {
    setShowMentorModal(true);
    
    analyticsApi.trackEvent('find_mentors_clicked', {
      source: 'career_assessment',
      user_strengths: calculateResults().map(r => r.category),
    });
  };

  const generateReportContent = (data: any) => {
    return `
CAREER ASSESSMENT REPORT
Generated on: ${new Date(data.timestamp).toLocaleDateString()}

=== ASSESSMENT RESULTS ===

${data.results.map((result: any) => `
${result.category.toUpperCase()}
Score: ${result.score}%
Description: ${result.description}

Recommendations:
${result.recommendations.map((rec: string) => `• ${rec}`).join('\n')}
`).join('\n')}

=== AI-POWERED RECOMMENDATIONS ===
${data.recommendations}

=== MARKET INSIGHTS ===
${data.marketData.salaryData ? `Average Salary: $${data.marketData.salaryData.averageSalary}` : ''}
${data.marketData.jobTrends ? `Available Positions: ${data.marketData.jobTrends.totalResults}` : ''}

=== NEXT STEPS ===
1. Review your top strengths and focus areas
2. Connect with mentors in your target fields
3. Develop skills in areas with lower scores
4. Explore career opportunities that align with your strengths
5. Set specific, measurable career goals

Generated by DeepThink - Think Deeper, Decide Better
Visit: ${window.location.origin}
    `.trim();
  };

  const results = showResults ? calculateResults() : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-indigo-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Career Assessment</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your work style, leadership potential, and ideal career paths with real-time market insights and AI-powered recommendations.
          </p>
        </div>

        {!showResults ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </span>
                <span className="text-sm font-medium text-indigo-600">
                  {Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {assessmentQuestions[currentQuestion]?.question}
              </h2>
              <p className="text-gray-600">
                Rate how much you agree with this statement
              </p>
            </div>

            {/* Response Options */}
            <div className="space-y-3">
              {[
                { value: 5, label: 'Strongly Agree', color: 'bg-green-500' },
                { value: 4, label: 'Agree', color: 'bg-green-400' },
                { value: 3, label: 'Neutral', color: 'bg-yellow-400' },
                { value: 2, label: 'Disagree', color: 'bg-red-400' },
                { value: 1, label: 'Strongly Disagree', color: 'bg-red-500' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleResponse(option.value)}
                  className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 flex items-center space-x-4 transform hover:scale-102"
                >
                  <div className={`w-4 h-4 rounded-full ${option.color}`} />
                  <span className="font-medium text-gray-900">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
              <p className="text-gray-600">Here are your personalized career insights powered by AI and real-time market data</p>
            </div>

            {/* Real-time Market Data */}
            {!careerDataLoading && (jobTrends || salaryData) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Real-Time Market Insights</span>
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {salaryData && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">Average Salary</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${salaryData.averageSalary || '85,000'}
                      </div>
                    </div>
                  )}
                  {jobTrends && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Open Positions</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {jobTrends.totalResults || '1,247'}
                      </div>
                    </div>
                  )}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Top Location</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">San Francisco</div>
                  </div>
                </div>
              </div>
            )}

            {/* AI-Powered Recommendations */}
            {(loadingRecommendations || aiRecommendations) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span>AI-Powered Career Recommendations</span>
                </h3>
                {loadingRecommendations ? (
                  <div className="flex items-center space-x-3">
                    <div className="spinner"></div>
                    <span className="text-gray-600">Generating personalized recommendations...</span>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                        {aiRecommendations}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{result.category}</h3>
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      <span className="text-2xl font-bold text-indigo-600">{result.score}%</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${result.score}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{result.description}</p>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>Recommendations</span>
                    </h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                          <ArrowRight className="h-3 w-3 text-indigo-400 mt-1 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Career Suggestions with Real Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <span>Personalized Career Matches</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: 'Senior Product Manager', match: '94%', salary: '$125K-$180K', growth: '+15%', description: 'Lead product strategy and cross-functional teams' },
                  { title: 'UX Design Lead', match: '89%', salary: '$110K-$160K', growth: '+12%', description: 'Design user-centered experiences and lead design teams' },
                  { title: 'Data Science Manager', match: '86%', salary: '$130K-$190K', growth: '+22%', description: 'Lead data science initiatives and analytics strategy' },
                  { title: 'Marketing Director', match: '83%', salary: '$120K-$170K', growth: '+8%', description: 'Develop and execute comprehensive marketing strategies' },
                  { title: 'Business Development Lead', match: '80%', salary: '$100K-$150K', growth: '+10%', description: 'Drive strategic partnerships and business growth' },
                  { title: 'Engineering Manager', match: '77%', salary: '$140K-$200K', growth: '+18%', description: 'Lead engineering teams and technical strategy' }
                ].map((career, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-all duration-300 transform hover:scale-102 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{career.title}</h4>
                      <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {career.match}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Salary Range:</span>
                        <span className="font-medium text-gray-700">{career.salary}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Job Growth:</span>
                        <span className="font-medium text-green-600">{career.growth}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={resetAssessment}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>Retake Assessment</span>
              </button>
              
              <button
                onClick={downloadReport}
                disabled={isDownloading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>{isDownloading ? 'Downloading...' : 'Download Report'}</span>
              </button>
              
              <button
                onClick={shareResults}
                disabled={isSharing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                <span>{isSharing ? 'Sharing...' : 'Share Results'}</span>
              </button>
              
              <button
                onClick={findMentors}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Find Mentors</span>
              </button>
            </div>
          </div>
        )}

        {/* Mentor Modal */}
        {showMentorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Mentors in Your Field</h3>
              <p className="text-gray-600 mb-6">
                Based on your assessment results, we recommend connecting with mentors who specialize in:
              </p>
              <div className="space-y-2 mb-6">
                {results.slice(0, 3).map((result, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800">{result.category}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowMentorModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowMentorModal(false);
                    // Navigate to mentors section
                    window.location.hash = 'mentors';
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Find Mentors
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerAssessment;
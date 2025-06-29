import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Star, MapPin, Clock, MessageCircle, Video, Calendar, Globe, Award, TrendingUp, Heart, Zap, Eye, ChevronDown, ChevronUp, Send, Phone, Mic, MicOff, VideoOff, PhoneCall, ExternalLink, CheckCircle, AlertCircle, BookOpen, Briefcase, GraduationCap, Building, Linkedin, Twitter, Github, Mail, Shield, Verified } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mentor, MentorshipRequest, ChatMessage, VideoCallSession } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { analyticsApi } from '../services/api';
import freeMentorApiClient from '../services/freeMentorApi';
import aiService from '../services/aiService';

const MentorPlatform: React.FC = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMentorProfile, setShowMentorProfile] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'responseTime' | 'free'>('free');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineMentors, setOnlineMentors] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<'free' | 'paid' | 'all'>('all');
  
  // Chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Contact instructions
  const [contactInstructions, setContactInstructions] = useState<any>(null);

  // Enhanced mentor categories
  const mentorCategories = [
    { id: 'all', name: 'All Mentors', icon: Users, count: 0 },
    { id: 'tech', name: 'Technology', icon: Briefcase, count: 0 },
    { id: 'product', name: 'Product Management', icon: TrendingUp, count: 0 },
    { id: 'design', name: 'Design & UX', icon: Eye, count: 0 },
    { id: 'business', name: 'Business & Strategy', icon: Building, count: 0 },
    { id: 'marketing', name: 'Marketing & Growth', icon: Zap, count: 0 },
    { id: 'data', name: 'Data Science', icon: BookOpen, count: 0 },
    { id: 'leadership', name: 'Leadership', icon: Award, count: 0 },
    { id: 'startup', name: 'Entrepreneurship', icon: GraduationCap, count: 0 }
  ];

  // Load free mentors
  useEffect(() => {
    loadFreeMentors();
  }, []);

  const loadFreeMentors = async () => {
    setIsLoading(true);
    try {
      const fetchedMentors = await freeMentorApiClient.getFreeMentors();
      setMentors(fetchedMentors);
      setFilteredMentors(fetchedMentors);
      
      // Simulate some mentors being online
      const onlineIds = new Set(
        fetchedMentors
          .filter(() => Math.random() > 0.7)
          .map(m => m.id)
      );
      setOnlineMentors(onlineIds);
      
      analyticsApi.trackEvent('free_mentors_loaded', {
        total_mentors: fetchedMentors.length,
        online_mentors: onlineIds.size,
      });
    } catch (error) {
      console.error('Failed to load mentors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter mentors based on search and filters
  useEffect(() => {
    let filtered = mentors;

    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.expertise.includes(selectedExpertise)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(mentor => {
        const category = getCategoryForMentor(mentor);
        return category === selectedCategory;
      });
    }

    if (priceRange !== 'all') {
      if (priceRange === 'free') {
        filtered = filtered.filter(mentor => mentor.isFree);
      } else if (priceRange === 'paid') {
        filtered = filtered.filter(mentor => !mentor.isFree);
      }
    }

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'responseTime':
          return parseInt(a.responseTime) - parseInt(b.responseTime);
        case 'free':
          // Prioritize free mentors
          if (a.isFree && !b.isFree) return -1;
          if (!a.isFree && b.isFree) return 1;
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredMentors(filtered);
  }, [mentors, searchTerm, selectedExpertise, sortBy, selectedCategory, priceRange]);

  const getCategoryForMentor = (mentor: Mentor): string => {
    const expertise = mentor.expertise.join(' ').toLowerCase();
    const title = mentor.title.toLowerCase();
    
    if (expertise.includes('software') || expertise.includes('engineering') || title.includes('engineer')) return 'tech';
    if (expertise.includes('product') || title.includes('product')) return 'product';
    if (expertise.includes('design') || expertise.includes('ux') || title.includes('design')) return 'design';
    if (expertise.includes('business') || expertise.includes('strategy') || title.includes('business')) return 'business';
    if (expertise.includes('marketing') || expertise.includes('growth') || title.includes('marketing')) return 'marketing';
    if (expertise.includes('data') || expertise.includes('analytics') || title.includes('data')) return 'data';
    if (expertise.includes('leadership') || expertise.includes('management') || title.includes('manager')) return 'leadership';
    if (expertise.includes('startup') || expertise.includes('entrepreneur') || title.includes('founder')) return 'startup';
    
    return 'tech'; // default
  };

  const allExpertise = Array.from(new Set(mentors.flatMap(m => m.expertise)));

  const getAvailabilityColor = (availability: Mentor['availability']) => {
    switch (availability) {
      case 'available': return 'text-green-600 bg-green-100 border-green-200';
      case 'busy': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'offline': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getAvailabilityText = (availability: Mentor['availability']) => {
    switch (availability) {
      case 'available': return 'Available Now';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const toggleFavorite = (mentorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(mentorId)) {
      newFavorites.delete(mentorId);
    } else {
      newFavorites.add(mentorId);
    }
    setFavorites(newFavorites);
    
    analyticsApi.trackEvent('mentor_favorited', {
      mentor_id: mentorId,
      action: newFavorites.has(mentorId) ? 'added' : 'removed',
    });
  };

  const startChat = async (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowChatModal(true);
    
    // Generate welcome message using AI
    const welcomeMessage: ChatMessage = {
      id: '1',
      senderId: mentor.id,
      senderName: mentor.name,
      message: `Hi ${user?.name}! I'm ${mentor.name}, ${mentor.title} at ${mentor.company}. I'm excited to help you with your career journey! What specific challenge are you facing right now?`,
      timestamp: new Date(),
      type: 'text'
    };
    
    setChatMessages([welcomeMessage]);
    
    analyticsApi.trackEvent('chat_session_started', {
      mentor_id: mentor.id,
      mentor_name: mentor.name,
      platform: mentor.platform,
    });
  };

  const sendChatMessage = async () => {
    if (!currentMessage.trim() || !selectedMentor || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      message: currentMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, newMessage]);
    const userMessage = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);

    try {
      // Generate AI mentor response using the enhanced AI service
      const conversationId = `mentor-${selectedMentor.id}`;
      const mentorResponse = await aiService.generateMentorResponse(userMessage, selectedMentor, conversationId);

      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: selectedMentor.id,
          senderName: selectedMentor.name,
          message: mentorResponse,
          timestamp: new Date(),
          type: 'text'
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to generate mentor response:', error);
      setIsTyping(false);
    }
  };

  const openContactModal = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    const instructions = freeMentorApiClient.getContactInstructions(mentor);
    setContactInstructions(instructions);
    setShowContactModal(true);
    
    analyticsApi.trackEvent('contact_mentor_clicked', {
      mentor_id: mentor.id,
      mentor_name: mentor.name,
      platform: mentor.platform,
      contact_method: mentor.contactMethod
    });
  };

  const openMentorProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowMentorProfile(true);
    
    analyticsApi.trackEvent('mentor_profile_viewed', {
      mentor_id: mentor.id,
      mentor_name: mentor.name,
    });
  };

  const handleContactRedirect = (url: string) => {
    window.open(url, '_blank');
    analyticsApi.trackEvent('mentor_platform_redirect', {
      mentor_id: selectedMentor?.id,
      platform: selectedMentor?.platform,
      url: url
    });
  };

  const MentorCard = ({ mentor, index }: { mentor: Mentor; index: number }) => {
    const isOnline = onlineMentors.has(mentor.id);
    const isFavorite = favorites.has(mentor.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 group relative"
        onClick={() => openMentorProfile(mentor)}
      >
        {/* Free Badge */}
        {mentor.isFree && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            FREE
          </div>
        )}

        {/* Verified Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {isOnline && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span>Online</span>
            </div>
          )}
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Verified className="h-3 w-3" />
            <span>Verified</span>
          </div>
        </div>

        <div className="relative mt-8">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300"
              />
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {mentor.name}
              </h3>
              <p className="text-blue-600 font-medium">{mentor.title}</p>
              <p className="text-gray-600 text-sm">{mentor.company}</p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">{mentor.location}</span>
              </div>
            </div>
            <button
              onClick={(e) => toggleFavorite(mentor.id, e)}
              className={`p-2 rounded-full transition-all duration-300 ${
                isFavorite 
                  ? 'text-red-500 bg-red-50' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(mentor.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium text-yellow-600">{mentor.rating}</span>
              <span className="text-gray-600 text-sm">({mentor.reviewCount})</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{mentor.responseTime}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {mentor.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.expertise.slice(0, 3).map((skill, skillIndex) => (
              <span
                key={skillIndex}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {mentor.expertise.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{mentor.expertise.length - 3} more
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {mentor.isFree ? (
                <span className="font-bold text-green-600">FREE</span>
              ) : (
                <span className="font-medium">${mentor.hourlyRate}/hour</span>
              )}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(mentor.availability)}`}>
              {getAvailabilityText(mentor.availability)}
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startChat(mentor);
              }}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openContactModal(mentor);
              }}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Professional Mentors Network</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified mentors from top companies. Get personalized career guidance, 
            interview preparation, and industry insights from experienced professionals.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Free & Premium mentorship available</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Verified industry professionals</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4 text-purple-600" />
              <span>AI-powered matching</span>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {mentorCategories.map((category) => {
              const Icon = category.icon;
              const count = filteredMentors.filter(m => getCategoryForMentor(m) === category.id || category.id === 'all').length;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {category.id === 'all' ? mentors.length : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, value: `${mentors.filter(m => m.isFree).length}`, label: 'Free Mentors', gradient: 'from-green-500 to-emerald-500' },
            { icon: Globe, value: `${onlineMentors.size}`, label: 'Online Now', gradient: 'from-blue-500 to-cyan-500' },
            { icon: Award, value: '4.8', label: 'Avg Rating', gradient: 'from-purple-500 to-pink-500' },
            { icon: TrendingUp, value: '2K+', label: 'Sessions', gradient: 'from-orange-500 to-red-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-6 border border-gray-200 text-center hover:shadow-xl transition-all duration-500"
            >
              <div className={`bg-gradient-to-r ${stat.gradient} p-3 rounded-lg w-fit mx-auto mb-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search mentors by name, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Expertise</option>
                {allExpertise.map(expertise => (
                  <option key={expertise} value={expertise}>{expertise}</option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="free">Free Only</option>
                <option value="paid">Premium Only</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="free">Free First</option>
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="responseTime">Sort by Response Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredMentors.length}</span> mentors
            {priceRange === 'free' && (
              <span className="text-green-600 font-semibold"> • {filteredMentors.filter(m => m.isFree).length} free</span>
            )}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span>{onlineMentors.size} mentors online now</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading mentors...</span>
          </div>
        )}

        {/* Mentors Grid */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredMentors.map((mentor, index) => (
              <MentorCard key={mentor.id} mentor={mentor} index={index} />
            ))}
          </div>
        )}

        {/* Enhanced Mentor Profile Modal */}
        <AnimatePresence>
          {showMentorProfile && selectedMentor && (
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
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                {/* Profile Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white rounded-t-xl">
                  <button
                    onClick={() => setShowMentorProfile(false)}
                    className="absolute top-4 right-4 text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10"
                  >
                    ✕
                  </button>
                  
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <img
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20"
                      />
                      {onlineMentors.has(selectedMentor.id) && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold">{selectedMentor.name}</h2>
                        <Verified className="h-6 w-6 text-blue-200" />
                        {selectedMentor.isFree && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                      <p className="text-xl text-blue-100 mb-2">{selectedMentor.title}</p>
                      <p className="text-blue-200 mb-4">{selectedMentor.company} • {selectedMentor.location}</p>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-300 fill-current" />
                          <span>{selectedMentor.rating} ({selectedMentor.reviewCount} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{selectedMentor.responseTime} response</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{selectedMentor.menteeCount} mentees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                        <p className="text-gray-600 leading-relaxed">{selectedMentor.bio}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.expertise.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedMentor.specializations.map((spec, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-700">{spec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.languages.map((lang, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4">Session Details</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Price:</span>
                            <span className="font-semibold text-green-600">
                              {selectedMentor.isFree ? 'FREE' : `$${selectedMentor.hourlyRate}/hour`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Response Time:</span>
                            <span className="font-medium">{selectedMentor.responseTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Experience:</span>
                            <span className="font-medium">{selectedMentor.experience} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Availability:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(selectedMentor.availability)}`}>
                              {getAvailabilityText(selectedMentor.availability)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            setShowMentorProfile(false);
                            startChat(selectedMentor);
                          }}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>Start Chat</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setShowMentorProfile(false);
                            openContactModal(selectedMentor);
                          }}
                          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>Connect on Platform</span>
                        </button>
                      </div>

                      {/* Social Links */}
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">Connect</h3>
                        <div className="flex space-x-3">
                          {selectedMentor.linkedinUrl && (
                            <button
                              onClick={() => handleContactRedirect(selectedMentor.linkedinUrl!)}
                              className="flex-1 border border-blue-600 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center space-x-1"
                            >
                              <Linkedin className="h-4 w-4" />
                              <span>LinkedIn</span>
                            </button>
                          )}
                          {selectedMentor.twitterUrl && (
                            <button
                              onClick={() => handleContactRedirect(selectedMentor.twitterUrl!)}
                              className="flex-1 border border-blue-600 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors text-sm flex items-center justify-center space-x-1"
                            >
                              <Twitter className="h-4 w-4" />
                              <span>Twitter</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Modal - Enhanced */}
        <AnimatePresence>
          {showChatModal && selectedMentor && (
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
                className="bg-white rounded-xl max-w-2xl w-full h-[600px] flex flex-col"
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedMentor.name}</h3>
                        <p className="text-sm text-gray-600">{selectedMentor.title} at {selectedMentor.company}</p>
                      </div>
                      {selectedMentor.isFree && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                          FREE
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowChatModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!currentMessage.trim()}
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 This is an AI simulation. For real mentorship, use the "Connect" button to reach out on their platform.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact Instructions Modal */}
        <AnimatePresence>
          {showContactModal && selectedMentor && contactInstructions && (
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
                className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedMentor.avatar}
                        alt={selectedMentor.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Connect with {selectedMentor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedMentor.title} at {selectedMentor.company}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {selectedMentor.isFree && (
                            <span className="text-sm font-bold text-green-600">FREE</span>
                          )}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{selectedMentor.responseTime} response time</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContactModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{contactInstructions.title}</h4>
                      <p className="text-gray-600 mb-4">{contactInstructions.description}</p>
                      
                      <button
                        onClick={() => handleContactRedirect(contactInstructions.url)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span>{contactInstructions.buttonText}</span>
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">How to Connect:</h4>
                      <ol className="space-y-2">
                        {contactInstructions.steps.map((step: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-800">
                          <p className="font-medium">Professional Mentorship</p>
                          <p>{selectedMentor.name} offers {selectedMentor.isFree ? 'free' : 'premium'} mentorship sessions. Be respectful of their time and come prepared with specific questions.</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Links */}
                    <div className="flex space-x-3">
                      {selectedMentor.linkedinUrl && (
                        <button
                          onClick={() => handleContactRedirect(selectedMentor.linkedinUrl!)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          LinkedIn
                        </button>
                      )}
                      {selectedMentor.twitterUrl && (
                        <button
                          onClick={() => handleContactRedirect(selectedMentor.twitterUrl!)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          Twitter
                        </button>
                      )}
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

export default MentorPlatform;
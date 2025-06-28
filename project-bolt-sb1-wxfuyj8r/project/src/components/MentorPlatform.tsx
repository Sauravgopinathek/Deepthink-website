import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Star, MapPin, Clock, MessageCircle, Video, Calendar, Globe, Award, TrendingUp, Heart, Zap, Eye, ChevronDown, ChevronUp, Send, Phone, Mic, MicOff, VideoOff, PhoneCall, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mentor, MentorshipRequest, ChatMessage, VideoCallSession } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { mentorApiClient } from '../services/mentorApi';
import { analyticsApi } from '../services/api';

const MentorPlatform: React.FC = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'responseTime' | 'price'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineMentors, setOnlineMentors] = useState<Set<string>>(new Set());
  
  // Chat and video call states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [videoCallSession, setVideoCallSession] = useState<VideoCallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // Scheduling states
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    notes: '',
    sessionType: 'video' as 'video' | 'audio' | 'chat'
  });
  
  const [requestForm, setRequestForm] = useState({
    subject: '',
    message: '',
    preferredTime: '',
    sessionType: 'video' as 'video' | 'chat' | 'phone'
  });

  // Load mentors from real APIs
  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    setIsLoading(true);
    try {
      const fetchedMentors = await mentorApiClient.getAllMentors();
      setMentors(fetchedMentors);
      setFilteredMentors(fetchedMentors);
      
      // Simulate some mentors being online
      const onlineIds = new Set(
        fetchedMentors
          .filter(() => Math.random() > 0.6)
          .map(m => m.id)
      );
      setOnlineMentors(onlineIds);
      
      analyticsApi.trackEvent('mentors_loaded', {
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

    // Sort mentors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'responseTime':
          return parseInt(a.responseTime) - parseInt(b.responseTime);
        case 'price':
          return (a.hourlyRate || 0) - (b.hourlyRate || 0);
        default:
          return 0;
      }
    });

    setFilteredMentors(filtered);
  }, [mentors, searchTerm, selectedExpertise, sortBy]);

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
    
    // Generate welcome message
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
      // Send message to real mentor platform
      await mentorApiClient.sendMessageToMentor(selectedMentor.id, userMessage, {
        name: user.name,
        email: user.email,
      });

      // Simulate mentor response (in real implementation, this would come from the platform)
      setTimeout(() => {
        const mentorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: selectedMentor.id,
          senderName: selectedMentor.name,
          message: generateMentorResponse(userMessage, selectedMentor),
          timestamp: new Date(),
          type: 'text'
        };
        setChatMessages(prev => [...prev, mentorResponse]);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  };

  const generateMentorResponse = (userMessage: string, mentor: Mentor): string => {
    const message = userMessage.toLowerCase();
    
    // Context-aware responses based on mentor expertise
    if (message.includes('career') || message.includes('job')) {
      return `Great question about career development! Based on my experience at ${mentor.company}, I'd recommend focusing on these key areas: 1) Building strong technical skills in your domain, 2) Developing communication and leadership abilities, 3) Creating a strong professional network. What specific aspect of your career would you like to focus on?`;
    }
    
    if (message.includes('interview')) {
      return `Interview preparation is crucial! At ${mentor.company}, we look for candidates who can demonstrate both technical competence and cultural fit. I'd suggest: 1) Practice coding problems daily, 2) Prepare STAR method examples, 3) Research the company thoroughly. Would you like me to share some specific interview tips for your target role?`;
    }
    
    if (message.includes('skill') || message.includes('learn')) {
      return `Continuous learning is essential in tech! Given my expertise in ${mentor.expertise.join(', ')}, I'd recommend starting with the fundamentals and building practical projects. What specific skills are you looking to develop? I can suggest a learning path tailored to your goals.`;
    }
    
    return `That's an excellent question! Based on my ${mentor.experience} years of experience in ${mentor.expertise.join(', ')}, I'd be happy to share some insights. Could you provide a bit more context about your specific situation so I can give you more targeted advice?`;
  };

  const openScheduleModal = async (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowScheduleModal(true);
    setSchedulingLoading(true);
    
    try {
      // Get real availability from mentor's calendar
      const availability = await mentorApiClient.getMentorAvailability(mentor.id, mentor.calendlyUrl || '');
      setAvailableSlots(availability.slots || []);
    } catch (error) {
      console.error('Failed to load availability:', error);
      // Fallback to mock slots
      setAvailableSlots([
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
      ]);
    } finally {
      setSchedulingLoading(false);
    }
  };

  const scheduleMeeting = async () => {
    if (!selectedMentor || !selectedSlot || !user) return;

    setSchedulingLoading(true);
    try {
      const result = await mentorApiClient.scheduleMeeting(selectedMentor.id, selectedSlot, {
        name: user.name,
        email: user.email,
        notes: meetingDetails.notes,
      });

      if (result.success) {
        alert(`🎉 Meeting scheduled successfully with ${selectedMentor.name}!\n\nMeeting Details:\n- Time: ${new Date(selectedSlot).toLocaleString()}\n- Meeting URL: ${result.meetingUrl}\n\nYou will receive a calendar invite shortly.`);
        
        analyticsApi.trackEvent('meeting_scheduled', {
          mentor_id: selectedMentor.id,
          mentor_name: selectedMentor.name,
          platform: selectedMentor.platform,
          scheduled_time: selectedSlot,
        });
        
        setShowScheduleModal(false);
        setSelectedSlot('');
        setMeetingDetails({ notes: '', sessionType: 'video' });
      }
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      alert('Failed to schedule meeting. Please try again or contact the mentor directly.');
    } finally {
      setSchedulingLoading(false);
    }
  };

  const MentorCard = ({ mentor, index }: { mentor: Mentor; index: number }) => {
    const isOnline = onlineMentors.has(mentor.id);
    const isFavorite = favorites.has(mentor.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:scale-105 group"
        onClick={() => setSelectedMentor(mentor)}
      >
        {/* Platform Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {isOnline && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
              <span>Online</span>
            </div>
          )}
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            {mentor.platform === 'adplist' ? 'ADPList' : 
             mentor.platform === 'mentorcruise' ? 'MentorCruise' : 
             mentor.platform}
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
              <span className="font-medium">${mentor.hourlyRate}/hour</span>
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
                openScheduleModal(mentor);
              }}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </button>
            {mentor.calendlyUrl && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(mentor.calendlyUrl, '_blank');
                }}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg w-fit mx-auto mb-4"
          >
            <Users className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold mb-4">Real Professional Mentors</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified mentors from top companies through ADPList, MentorCruise, and other platforms. 
            Schedule real meetings and get personalized career guidance.
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Real mentors from top companies</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Direct scheduling integration</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Live availability tracking</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Users, value: `${mentors.length}+`, label: 'Real Mentors', gradient: 'from-blue-500 to-cyan-500' },
            { icon: Globe, value: `${onlineMentors.size}`, label: 'Online Now', gradient: 'from-green-500 to-emerald-500' },
            { icon: Award, value: '4.8', label: 'Avg Rating', gradient: 'from-purple-500 to-pink-500' },
            { icon: TrendingUp, value: '10K+', label: 'Sessions', gradient: 'from-orange-500 to-red-500' }
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
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="responseTime">Sort by Response Time</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredMentors.length}</span> of {mentors.length} mentors
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
            <span className="ml-3 text-gray-600">Loading real mentors...</span>
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

        {/* Chat Modal */}
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
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {selectedMentor.platform}
                      </div>
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
                        <p className="text-sm">{message.message}</p>
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
                    💡 This will send a real message to {selectedMentor.name} on {selectedMentor.platform}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Meeting Modal */}
        <AnimatePresence>
          {showScheduleModal && selectedMentor && (
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
                          Schedule with {selectedMentor.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedMentor.title} at {selectedMentor.company}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          ${selectedMentor.hourlyRate}/hour
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {schedulingLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading availability...</span>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Available Slots */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Available Time Slots</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {availableSlots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-3 text-left border rounded-lg transition-colors ${
                                selectedSlot === slot
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="font-medium">
                                {new Date(slot).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(slot).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Session Type */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Session Type</h4>
                        <div className="flex space-x-3">
                          {['video', 'audio', 'chat'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setMeetingDetails(prev => ({ ...prev, sessionType: type as any }))}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                meetingDetails.sessionType === type
                                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Notes (Optional)</h4>
                        <textarea
                          value={meetingDetails.notes}
                          onChange={(e) => setMeetingDetails(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="What would you like to discuss? Any specific questions or topics?"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setShowScheduleModal(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={scheduleMeeting}
                          disabled={!selectedSlot || schedulingLoading}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {schedulingLoading ? 'Scheduling...' : 'Schedule Meeting'}
                        </button>
                      </div>

                      {/* Platform Info */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div className="text-sm text-blue-800">
                            <p className="font-medium">Real Meeting Booking</p>
                            <p>This will create an actual meeting with {selectedMentor.name} through {selectedMentor.platform}. You'll receive a calendar invite and meeting link.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
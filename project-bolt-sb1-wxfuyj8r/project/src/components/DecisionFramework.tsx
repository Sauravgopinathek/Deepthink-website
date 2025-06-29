import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Trash2, 
  Save, 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Star, 
  Lightbulb,
  BarChart3,
  Zap,
  Download,
  Share2,
  History,
  RefreshCw,
  Eye,
  Edit3,
  Calculator,
  Sparkles,
  ArrowRight,
  Award,
  Clock,
  Users,
  Globe,
  Upload,
  Image as ImageIcon,
  X,
  Camera,
  FileText,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  MessageSquare,
  Send,
  BookOpen,
  Bookmark
} from 'lucide-react';
import { Decision, DecisionOption, DecisionCriteria } from '../types';
import { analyticsApi } from '../services/api';
import aiService from '../services/aiService';

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'document' | 'audio';
  analysis?: string;
  insights?: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface DecisionTemplate {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  options: string[];
}

const DecisionFramework: React.FC = () => {
  const [decision, setDecision] = useState<Decision>({
    id: '',
    title: '',
    description: '',
    options: [],
    criteria: [],
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const [activeStep, setActiveStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [savedDecisions, setSavedDecisions] = useState<Decision[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DecisionTemplate | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const conversationId = 'decision-framework';

  // Decision templates
  const decisionTemplates: DecisionTemplate[] = [
    {
      id: 'career-change',
      name: 'Career Change',
      description: 'Template for evaluating career transition decisions',
      criteria: ['Salary Potential', 'Growth Opportunities', 'Work-Life Balance', 'Job Security', 'Personal Interest'],
      options: ['Stay in Current Role', 'New Role at Current Company', 'Switch Companies', 'Career Pivot']
    },
    {
      id: 'investment',
      name: 'Investment Decision',
      description: 'Template for financial investment choices',
      criteria: ['Expected Return', 'Risk Level', 'Liquidity', 'Time Horizon', 'Diversification'],
      options: ['Stocks', 'Bonds', 'Real Estate', 'Cryptocurrency', 'Index Funds']
    },
    {
      id: 'education',
      name: 'Education Path',
      description: 'Template for educational decisions',
      criteria: ['Cost', 'Time Commitment', 'Career Impact', 'Quality', 'Flexibility'],
      options: ['Traditional Degree', 'Online Course', 'Bootcamp', 'Self-Study', 'Professional Certification']
    },
    {
      id: 'location',
      name: 'Location Decision',
      description: 'Template for deciding where to live or work',
      criteria: ['Cost of Living', 'Career Opportunities', 'Quality of Life', 'Climate', 'Social Network'],
      options: ['Current City', 'Major Metropolitan Area', 'Smaller City', 'Remote Location', 'International']
    }
  ];

  useEffect(() => {
    // Load saved decisions from localStorage
    const saved = localStorage.getItem('deepthink_decisions');
    if (saved) {
      try {
        setSavedDecisions(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved decisions:', error);
      }
    }

    // Initialize with welcome message
    setChatMessages([{
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI decision assistant. I can help you:

🎯 **Analyze complex decisions systematically**
📊 **Suggest criteria and options you might miss**
🧠 **Provide insights based on uploaded files**
💡 **Guide you through proven decision frameworks**

What decision are you working on today? You can also upload documents, images, or voice notes for deeper analysis!`,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom of chat
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Save decision to localStorage
  const saveDecision = () => {
    if (!decision.title) {
      alert('Please add a title to save your decision');
      return;
    }

    const savedDecision = {
      ...decision,
      id: decision.id || Date.now().toString(),
      updatedAt: new Date()
    };

    const updatedDecisions = savedDecisions.filter(d => d.id !== savedDecision.id);
    updatedDecisions.unshift(savedDecision);
    
    setSavedDecisions(updatedDecisions);
    localStorage.setItem('deepthink_decisions', JSON.stringify(updatedDecisions));
    
    setDecision(savedDecision);
    alert('Decision saved successfully!');
  };

  // Load decision from history
  const loadDecision = (savedDecision: Decision) => {
    setDecision(savedDecision);
    setShowHistory(false);
    setActiveStep(1);
    setShowResults(false);
  };

  // Apply template
  const applyTemplate = (template: DecisionTemplate) => {
    const newDecision = {
      ...decision,
      title: decision.title || template.name,
      criteria: template.criteria.map((name, index) => ({
        id: Date.now().toString() + index,
        name,
        description: '',
        weight: 5
      })),
      options: template.options.map((name, index) => ({
        id: Date.now().toString() + index + 100,
        name,
        description: '',
        scores: {}
      }))
    };
    
    setDecision(newDecision);
    setSelectedTemplate(template);
    setShowTemplates(false);
    setActiveStep(2);
  };

  // File upload handlers
  const handleFileUpload = async (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = getFileType(file);
      
      if (fileType) {
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + i,
          file,
          url: URL.createObjectURL(file),
          type: fileType
        };
        
        newFiles.push(uploadedFile);
        analyzeFile(uploadedFile);
      }
    }
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    analyticsApi.trackEvent('decision_files_uploaded', {
      file_count: newFiles.length,
      file_types: newFiles.map(f => f.type),
      decision_id: decision.id
    });
  };

  const getFileType = (file: File): 'image' | 'document' | 'audio' | null => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    return null;
  };

  const analyzeFile = async (uploadedFile: UploadedFile) => {
    try {
      setIsLoading(true);
      
      let fileContent = '';
      
      if (uploadedFile.type === 'image') {
        fileContent = `Image file: ${uploadedFile.file.name}. This appears to be a visual representation that could contain charts, diagrams, or other decision-relevant information.`;
      } else if (uploadedFile.type === 'document') {
        fileContent = `Document: ${uploadedFile.file.name}. This document likely contains important information, data, or analysis relevant to your decision.`;
      } else if (uploadedFile.type === 'audio') {
        fileContent = `Audio file: ${uploadedFile.file.name}. This voice recording may contain thoughts, discussions, or insights about your decision.`;
      }
      
      const analysis = await aiService.analyzeUploadedFile(fileContent, uploadedFile.type, {
        decisionTitle: decision.title,
        decisionDescription: decision.description
      });
      
      setUploadedFiles(prev => prev.map(file => 
        file.id === uploadedFile.id 
          ? { 
              ...file, 
              analysis,
              insights: [
                'Consider how this information affects your decision criteria',
                'Look for quantitative data that could inform your scoring',
                'Think about any new options this might suggest'
              ]
            }
          : file
      ));
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `I've analyzed your ${uploadedFile.type} file "${uploadedFile.file.name}". ${analysis}`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('File analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        const audioFile: UploadedFile = {
          id: Date.now().toString(),
          file: new File([blob], `voice-note-${Date.now()}.wav`, { type: 'audio/wav' }),
          url: URL.createObjectURL(blob),
          type: 'audio'
        };
        
        setUploadedFiles(prev => [...prev, audioFile]);
        analyzeFile(audioFile);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Recording error:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // AI Chat handlers
  const sendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsTyping(true);
    
    try {
      const aiResponse = await aiService.generateDecisionInsights({
        ...decision,
        uploadedFiles: uploadedFiles.map(f => ({
          name: f.file.name,
          type: f.type,
          analysis: f.analysis
        })),
        userMessage: messageToSend
      }, conversationId);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('AI response error:', error);
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble generating a response right now. Please try rephrasing your question or check back later.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIInsights = async () => {
    if (!decision.title || decision.options.length === 0 || decision.criteria.length === 0) {
      setAiInsights('Please complete your decision framework (title, options, and criteria) before generating AI insights.');
      return;
    }

    setLoadingInsights(true);
    try {
      const insights = await aiService.generateDecisionInsights({
        ...decision,
        uploadedFiles: uploadedFiles.map(f => ({
          name: f.file.name,
          type: f.type,
          analysis: f.analysis
        }))
      }, conversationId);
      
      setAiInsights(insights);
      
      analyticsApi.trackEvent('ai_insights_generated', {
        decision_id: decision.id,
        options_count: decision.options.length,
        criteria_count: decision.criteria.length,
        files_count: uploadedFiles.length
      });
    } catch (error) {
      console.error('AI insights error:', error);
      setAiInsights('Unable to generate insights at this time. Please try again later.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const addOption = () => {
    const newOption: DecisionOption = {
      id: Date.now().toString(),
      name: '',
      description: '',
      scores: {}
    };
    setDecision(prev => ({
      ...prev,
      options: [...prev.options, newOption]
    }));
  };

  const addCriteria = () => {
    const newCriteria: DecisionCriteria = {
      id: Date.now().toString(),
      name: '',
      description: '',
      weight: 5
    };
    setDecision(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriteria]
    }));
  };

  const updateOption = (optionId: string, field: keyof DecisionOption, value: any) => {
    setDecision(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId ? { ...option, [field]: value } : option
      )
    }));
  };

  const updateCriteria = (criteriaId: string, field: keyof DecisionCriteria, value: any) => {
    setDecision(prev => ({
      ...prev,
      criteria: prev.criteria.map(criteria =>
        criteria.id === criteriaId ? { ...criteria, [field]: value } : criteria
      )
    }));
  };

  const calculateResults = () => {
    const results = decision.options.map(option => {
      let totalScore = 0;
      let maxPossibleScore = 0;

      decision.criteria.forEach(criteria => {
        const score = option.scores[criteria.id] || 0;
        totalScore += score * criteria.weight;
        maxPossibleScore += 10 * criteria.weight;
      });

      return {
        ...option,
        totalScore,
        percentage: maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
      };
    }).sort((a, b) => b.totalScore - a.totalScore);

    return results;
  };

  const resetDecision = () => {
    setDecision({
      id: '',
      title: '',
      description: '',
      options: [],
      criteria: [],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    setActiveStep(1);
    setShowResults(false);
    setAiInsights('');
    setUploadedFiles([]);
    setChatMessages([{
      id: '1',
      role: 'assistant',
      content: 'Ready to start a new decision! What would you like to work on?',
      timestamp: new Date()
    }]);
    
    analyticsApi.trackEvent('decision_reset', {
      decision_type: 'new',
    });
  };

  const downloadReport = async () => {
    if (!decision.title) {
      alert('Please add a title before downloading the report');
      return;
    }

    try {
      const results = calculateResults();
      const reportData = {
        title: decision.title,
        description: decision.description,
        timestamp: new Date().toISOString(),
        results,
        recommendations: aiInsights,
        uploadedFiles: uploadedFiles.length,
        criteria: decision.criteria,
        options: decision.options
      };

      const reportContent = generateReportContent(reportData);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `decision-report-${decision.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      analyticsApi.trackEvent('decision_report_downloaded', {
        decision_title: decision.title,
        timestamp: new Date().toISOString(),
      });

      alert('📄 Your decision report has been downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const shareResults = async () => {
    if (!decision.title) {
      alert('Please add a title before sharing');
      return;
    }

    try {
      const results = calculateResults();
      const topChoice = results[0];
      
      const shareText = `🎯 Just completed a decision analysis on DeepThink!\n\nDecision: ${decision.title}\nTop choice: ${topChoice?.name} (${topChoice?.percentage}% score)\n\nMake better decisions with AI: ${window.location.origin}`;

      if (navigator.share) {
        await navigator.share({
          title: 'My Decision Analysis Results',
          text: shareText,
          url: window.location.origin
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('📋 Results copied to clipboard! Share with your network.');
      }

      analyticsApi.trackEvent('decision_results_shared', {
        decision_title: decision.title,
        share_method: navigator.share ? 'native' : 'clipboard',
      });
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share results. Please try again.');
    }
  };

  const generateReportContent = (data: any) => {
    return `
DECISION ANALYSIS REPORT
Generated on: ${new Date(data.timestamp).toLocaleDateString()}

=== DECISION OVERVIEW ===
Title: ${data.title}
Description: ${data.description}

=== ANALYSIS RESULTS ===

${data.results.map((result: any, index: number) => `
${index + 1}. ${result.name.toUpperCase()}
   Score: ${result.percentage}% (${result.totalScore} points)
   Description: ${result.description}
`).join('\n')}

=== CRITERIA ANALYSIS ===
${data.criteria.map((criteria: any) => `
• ${criteria.name} (Weight: ${criteria.weight}/10)
  ${criteria.description}
`).join('\n')}

=== AI RECOMMENDATIONS ===
${data.recommendations || 'No AI recommendations generated.'}

=== SUPPORTING FILES ===
${data.uploadedFiles > 0 ? `${data.uploadedFiles} files were analyzed as part of this decision.` : 'No files were uploaded for analysis.'}

=== NEXT STEPS ===
1. Review your top-scoring option and consider implementation
2. Identify any remaining concerns or questions
3. Set a timeline for making the final decision
4. Plan for monitoring the outcome of your choice
5. Document lessons learned for future decisions

Generated by DeepThink - Think Deeper, Decide Better
Visit: ${window.location.origin}
    `.trim();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const steps = [
    { id: 1, title: 'Define Decision', icon: Target },
    { id: 2, title: 'Add Options', icon: Plus },
    { id: 3, title: 'Set Criteria', icon: BarChart3 },
    { id: 4, title: 'Score & Analyze', icon: Calculator },
    { id: 5, title: 'Results', icon: Award }
  ];

  const results = showResults ? calculateResults() : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">AI-Enhanced Decision Framework</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make better decisions with AI-powered insights, file analysis, and systematic evaluation. 
            Upload documents, images, or voice notes for personalized guidance.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={() => setShowTemplates(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>Use Template</span>
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <History className="h-4 w-4" />
              <span>View History</span>
            </button>
            <button
              onClick={saveDecision}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Decision</span>
            </button>
            <button
              onClick={resetDecision}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>New Decision</span>
            </button>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === step.id;
                const isCompleted = activeStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.button
                      onClick={() => setActiveStep(step.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : isCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{step.title}</span>
                      {isCompleted && <CheckCircle className="h-4 w-4" />}
                    </motion.button>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* File Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span>Upload Supporting Files</span>
              </h3>
              
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <FileText className="h-8 w-8 text-gray-400" />
                    <Mic className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-600">
                      Support for images, documents (PDF, DOC), and audio files
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Choose Files
                    </button>
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        isRecording 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <Square className="h-4 w-4" />
                          <span>Stop ({formatTime(recordingTime)})</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          <span>Record Voice Note</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,audio/*"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Uploaded Files</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {file.type === 'image' && <ImageIcon className="h-4 w-4 text-blue-600" />}
                            {file.type === 'document' && <FileText className="h-4 w-4 text-green-600" />}
                            {file.type === 'audio' && <Mic className="h-4 w-4 text-purple-600" />}
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {file.file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(file.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {file.type === 'image' && (
                          <img
                            src={file.url}
                            alt="Uploaded"
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                        )}
                        
                        {file.analysis && (
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <p className="text-blue-800">{file.analysis}</p>
                            {file.insights && file.insights.length > 0 && (
                              <ul className="mt-2 space-y-1">
                                {file.insights.map((insight, index) => (
                                  <li key={index} className="text-blue-700 text-xs flex items-start space-x-1">
                                    <span>•</span>
                                    <span>{insight}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Decision Steps Content */}
            <AnimatePresence mode="wait">
              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Define Your Decision</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Decision Title
                      </label>
                      <input
                        type="text"
                        value={decision.title}
                        onChange={(e) => setDecision(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="What decision are you trying to make?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={decision.description}
                        onChange={(e) => setDecision(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide context and background for your decision..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {selectedTemplate && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <strong>Template Applied:</strong> {selectedTemplate.name} - {selectedTemplate.description}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Add Options</h3>
                    <button
                      onClick={addOption}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Option</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {decision.options.map((option, index) => (
                      <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">Option {index + 1}</h4>
                          <button
                            onClick={() => setDecision(prev => ({
                              ...prev,
                              options: prev.options.filter(o => o.id !== option.id)
                            }))}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) => updateOption(option.id, 'name', e.target.value)}
                            placeholder="Option name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <textarea
                            value={option.description}
                            onChange={(e) => updateOption(option.id, 'description', e.target.value)}
                            placeholder="Describe this option..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                    
                    {decision.options.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Plus className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No options added yet. Click "Add Option" to get started.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Set Criteria</h3>
                    <button
                      onClick={addCriteria}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Criteria</span>
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {decision.criteria.map((criteria, index) => (
                      <div key={criteria.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-medium text-gray-900">Criteria {index + 1}</h4>
                          <button
                            onClick={() => setDecision(prev => ({
                              ...prev,
                              criteria: prev.criteria.filter(c => c.id !== criteria.id)
                            }))}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={criteria.name}
                            onChange={(e) => updateCriteria(criteria.id, 'name', e.target.value)}
                            placeholder="Criteria name (e.g., Cost, Quality, Time)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <textarea
                            value={criteria.description}
                            onChange={(e) => updateCriteria(criteria.id, 'description', e.target.value)}
                            placeholder="Describe what this criteria means..."
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Importance Weight: {criteria.weight}/10
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={criteria.weight}
                              onChange={(e) => updateCriteria(criteria.id, 'weight', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {decision.criteria.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No criteria added yet. Click "Add Criteria" to get started.</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Options</h3>
                  
                  {decision.options.length > 0 && decision.criteria.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Options</th>
                            {decision.criteria.map(criteria => (
                              <th key={criteria.id} className="text-center py-3 px-4 font-medium text-gray-900">
                                {criteria.name}
                                <div className="text-xs text-gray-500 font-normal">
                                  Weight: {criteria.weight}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {decision.options.map(option => (
                            <tr key={option.id} className="border-b border-gray-100">
                              <td className="py-3 px-4">
                                <div className="font-medium text-gray-900">{option.name}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                              </td>
                              {decision.criteria.map(criteria => (
                                <td key={criteria.id} className="py-3 px-4 text-center">
                                  <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={option.scores[criteria.id] || 5}
                                    onChange={(e) => {
                                      const newScores = { ...option.scores };
                                      newScores[criteria.id] = parseInt(e.target.value);
                                      updateOption(option.id, 'scores', newScores);
                                    }}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  <div className="text-xs text-gray-500 mt-1">
                                    /10
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Add options and criteria first to start scoring.</p>
                    </div>
                  )}
                  
                  {decision.options.length > 0 && decision.criteria.length > 0 && (
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={generateAIInsights}
                        disabled={loadingInsights}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        {loadingInsights ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        <span>{loadingInsights ? 'Analyzing...' : 'Get AI Insights'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowResults(true);
                          setActiveStep(5);
                        }}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Calculator className="h-4 w-4" />
                        <span>Calculate Results</span>
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeStep === 5 && showResults && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <span>Decision Results</span>
                    </h3>
                    
                    <div className="space-y-4">
                      {results.map((result, index) => (
                        <div
                          key={result.id}
                          className={`p-4 rounded-lg border-2 ${
                            index === 0 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-3">
                              {index === 0 && <Award className="h-5 w-5 text-green-600" />}
                              <h4 className="font-semibold text-gray-900">{result.name}</h4>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">{result.percentage}%</div>
                              <div className="text-sm text-gray-600">Score: {result.totalScore}</div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{result.description}</p>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-1000 ${
                                index === 0 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${result.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  {aiInsights && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <span>AI Insights</span>
                      </h3>
                      <div className="prose max-w-none">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm">
                            {aiInsights}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
                    <button
                      onClick={saveDecision}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Decision</span>
                    </button>
                    <button
                      onClick={downloadReport}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download Report</span>
                    </button>
                    <button
                      onClick={shareResults}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share Results</span>
                    </button>
                    <button
                      onClick={resetDecision}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>New Decision</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit sticky top-8"
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>AI Assistant</span>
                </h3>
              </div>
              
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask me anything about your decision..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 I can analyze your uploaded files and provide decision insights
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Templates Modal */}
        <AnimatePresence>
          {showTemplates && (
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
                className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Decision Templates</h3>
                    <button
                      onClick={() => setShowTemplates(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {decisionTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => applyTemplate(template)}
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-500">Criteria:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.criteria.slice(0, 3).map((criteria, index) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {criteria}
                                </span>
                              ))}
                              {template.criteria.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{template.criteria.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-gray-500">Options:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.options.slice(0, 3).map((option, index) => (
                                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {option}
                                </span>
                              ))}
                              {template.options.length > 3 && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  +{template.options.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Modal */}
        <AnimatePresence>
          {showHistory && (
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
                className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Decision History</h3>
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {savedDecisions.length > 0 ? (
                    <div className="space-y-4">
                      {savedDecisions.map((savedDecision) => (
                        <div
                          key={savedDecision.id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                          onClick={() => loadDecision(savedDecision)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-900">{savedDecision.title}</h4>
                            <span className="text-xs text-gray-500">
                              {new Date(savedDecision.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{savedDecision.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{savedDecision.options.length} options</span>
                            <span>{savedDecision.criteria.length} criteria</span>
                            <span className={`px-2 py-1 rounded ${
                              savedDecision.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {savedDecision.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No saved decisions yet. Complete a decision to see it here.</p>
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

export default DecisionFramework;
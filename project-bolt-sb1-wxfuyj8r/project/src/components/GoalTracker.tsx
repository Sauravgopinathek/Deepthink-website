import React, { useState, useEffect } from 'react';
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Circle, Clock, Flag, History, BarChart3, Award, Trash2, Edit3, Save, X, Download, Share2, Filter, Search, Archive, Star, Eye, Users, BookOpen, Trophy, Zap, ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Goal, Milestone } from '../types';

interface GoalHistory {
  id: string;
  goalId: string;
  action: 'created' | 'updated' | 'completed' | 'milestone_completed' | 'deleted' | 'archived';
  description: string;
  timestamp: Date;
  oldValue?: any;
  newValue?: any;
}

interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: Goal['category'];
  milestones: string[];
  estimatedDuration: string;
}

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<Goal[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<Goal[]>([]);
  const [goalHistory, setGoalHistory] = useState<GoalHistory[]>([]);
  
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'progress' | 'created'>('deadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as Goal['category'],
    priority: 'medium' as Goal['priority'],
    deadline: '',
    milestones: [] as string[]
  });

  // Goal templates
  const goalTemplates: GoalTemplate[] = [
    {
      id: 'career-transition',
      name: 'Career Transition',
      description: 'Complete transition to a new career field',
      category: 'career',
      milestones: [
        'Research target industry and roles',
        'Update resume and LinkedIn profile',
        'Complete relevant certification or course',
        'Network with professionals in target field',
        'Apply to 10 positions',
        'Land first interview',
        'Receive job offer'
      ],
      estimatedDuration: '6-12 months'
    },
    {
      id: 'fitness-journey',
      name: 'Fitness Transformation',
      description: 'Achieve significant fitness and health improvements',
      category: 'health',
      milestones: [
        'Establish workout routine (3x/week)',
        'Create meal plan and track nutrition',
        'Lose first 10 pounds',
        'Complete first 5K run',
        'Reach target weight',
        'Maintain for 3 months'
      ],
      estimatedDuration: '6-9 months'
    },
    {
      id: 'financial-freedom',
      name: 'Financial Independence',
      description: 'Build emergency fund and investment portfolio',
      category: 'financial',
      milestones: [
        'Create monthly budget',
        'Pay off high-interest debt',
        'Save $1,000 emergency fund',
        'Increase emergency fund to 3 months expenses',
        'Start investing 15% of income',
        'Reach 6 months emergency fund'
      ],
      estimatedDuration: '12-18 months'
    },
    {
      id: 'skill-mastery',
      name: 'Learn New Skill',
      description: 'Master a new professional or personal skill',
      category: 'personal',
      milestones: [
        'Research learning resources',
        'Complete beginner course',
        'Practice daily for 30 days',
        'Complete intermediate course',
        'Build portfolio project',
        'Teach someone else the skill'
      ],
      estimatedDuration: '3-6 months'
    },
    {
      id: 'relationship-building',
      name: 'Strengthen Relationships',
      description: 'Improve and deepen personal relationships',
      category: 'relationships',
      milestones: [
        'Schedule regular check-ins with family',
        'Plan monthly activities with friends',
        'Join social group or club',
        'Practice active listening skills',
        'Resolve any ongoing conflicts',
        'Build 3 new meaningful friendships'
      ],
      estimatedDuration: '6-12 months'
    }
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    loadGoalsFromStorage();
  }, []);

  // Save data to localStorage whenever goals change
  useEffect(() => {
    saveGoalsToStorage();
  }, [goals, completedGoals, archivedGoals, goalHistory]);

  const loadGoalsFromStorage = () => {
    try {
      const savedGoals = localStorage.getItem('deepthink_goals');
      const savedCompleted = localStorage.getItem('deepthink_completed_goals');
      const savedArchived = localStorage.getItem('deepthink_archived_goals');
      const savedHistory = localStorage.getItem('deepthink_goal_history');

      if (savedGoals) setGoals(JSON.parse(savedGoals));
      if (savedCompleted) setCompletedGoals(JSON.parse(savedCompleted));
      if (savedArchived) setArchivedGoals(JSON.parse(savedArchived));
      if (savedHistory) setGoalHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error loading goals from storage:', error);
    }
  };

  const saveGoalsToStorage = () => {
    try {
      localStorage.setItem('deepthink_goals', JSON.stringify(goals));
      localStorage.setItem('deepthink_completed_goals', JSON.stringify(completedGoals));
      localStorage.setItem('deepthink_archived_goals', JSON.stringify(archivedGoals));
      localStorage.setItem('deepthink_goal_history', JSON.stringify(goalHistory));
    } catch (error) {
      console.error('Error saving goals to storage:', error);
    }
  };

  const addHistoryEntry = (goalId: string, action: GoalHistory['action'], description: string, oldValue?: any, newValue?: any) => {
    const historyEntry: GoalHistory = {
      id: Date.now().toString(),
      goalId,
      action,
      description,
      timestamp: new Date(),
      oldValue,
      newValue
    };
    setGoalHistory(prev => [historyEntry, ...prev.slice(0, 99)]); // Keep last 100 entries
  };

  // Filter and sort goals
  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'deadline':
        comparison = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
        break;
      case 'progress':
        comparison = b.progress - a.progress;
        break;
      case 'created':
        comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const applyTemplate = (template: GoalTemplate) => {
    setNewGoal({
      title: template.name,
      description: template.description,
      category: template.category,
      priority: 'medium',
      deadline: '',
      milestones: template.milestones
    });
    setShowTemplates(false);
    setShowNewGoalForm(true);
  };

  const addGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        deadline: new Date(newGoal.deadline),
        progress: 0,
        status: 'active',
        milestones: newGoal.milestones.map((title, index) => ({
          id: `${Date.now()}_${index}`,
          title,
          completed: false,
          dueDate: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000) // Weekly intervals
        })),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setGoals(prev => [...prev, goal]);
      addHistoryEntry(goal.id, 'created', `Created goal: ${goal.title}`);
      
      setNewGoal({
        title: '',
        description: '',
        category: 'personal',
        priority: 'medium',
        deadline: '',
        milestones: []
      });
      setShowNewGoalForm(false);
    }
  };

  const updateProgress = (goalId: string, progress: number) => {
    const oldGoal = goals.find(g => g.id === goalId);
    const oldProgress = oldGoal?.progress || 0;
    
    setGoals(prev => prev.map(goal =>
      goal.id === goalId ? { 
        ...goal, 
        progress,
        status: progress === 100 ? 'completed' : 'active',
        updatedAt: new Date()
      } : goal
    ));

    addHistoryEntry(goalId, 'updated', `Updated progress from ${oldProgress}% to ${progress}%`, oldProgress, progress);

    // If completed, move to completed goals
    if (progress === 100) {
      const completedGoal = goals.find(g => g.id === goalId);
      if (completedGoal) {
        setCompletedGoals(prev => [{ ...completedGoal, progress: 100, status: 'completed' }, ...prev]);
        setGoals(prev => prev.filter(g => g.id !== goalId));
        addHistoryEntry(goalId, 'completed', `Completed goal: ${completedGoal.title}`);
      }
    }
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    const milestone = goal?.milestones.find(m => m.id === milestoneId);
    
    setGoals(prev => prev.map(goal =>
      goal.id === goalId
        ? {
            ...goal,
            milestones: goal.milestones.map(milestone =>
              milestone.id === milestoneId
                ? { ...milestone, completed: !milestone.completed }
                : milestone
            ),
            updatedAt: new Date()
          }
        : goal
    ));

    if (milestone) {
      addHistoryEntry(goalId, 'milestone_completed', 
        `${milestone.completed ? 'Uncompleted' : 'Completed'} milestone: ${milestone.title}`);
    }
  };

  const deleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal && window.confirm(`Are you sure you want to delete "${goal.title}"?`)) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
      addHistoryEntry(goalId, 'deleted', `Deleted goal: ${goal.title}`);
    }
  };

  const archiveGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setArchivedGoals(prev => [{ ...goal, status: 'paused' }, ...prev]);
      setGoals(prev => prev.filter(g => g.id !== goalId));
      addHistoryEntry(goalId, 'archived', `Archived goal: ${goal.title}`);
    }
  };

  const restoreGoal = (goalId: string, fromArchive = false) => {
    const sourceArray = fromArchive ? archivedGoals : completedGoals;
    const setSourceArray = fromArchive ? setArchivedGoals : setCompletedGoals;
    
    const goal = sourceArray.find(g => g.id === goalId);
    if (goal) {
      setGoals(prev => [...prev, { ...goal, status: 'active', updatedAt: new Date() }]);
      setSourceArray(prev => prev.filter(g => g.id !== goalId));
      addHistoryEntry(goalId, 'updated', `Restored goal: ${goal.title}`);
    }
  };

  const exportGoals = () => {
    const data = {
      activeGoals: goals,
      completedGoals,
      archivedGoals,
      history: goalHistory,
      exportDate: new Date().toISOString(),
      stats: {
        totalGoals: goals.length + completedGoals.length + archivedGoals.length,
        completedCount: completedGoals.length,
        averageProgress: goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0
      }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `goals-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'career': return 'text-blue-600 bg-blue-100';
      case 'personal': return 'text-purple-600 bg-purple-100';
      case 'financial': return 'text-green-600 bg-green-100';
      case 'health': return 'text-red-600 bg-red-100';
      case 'relationships': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getActionIcon = (action: GoalHistory['action']) => {
    switch (action) {
      case 'created': return Plus;
      case 'updated': return Edit3;
      case 'completed': return CheckCircle;
      case 'milestone_completed': return Target;
      case 'deleted': return Trash2;
      case 'archived': return Archive;
      default: return Circle;
    }
  };

  const getActionColor = (action: GoalHistory['action']) => {
    switch (action) {
      case 'created': return 'text-blue-600 bg-blue-100';
      case 'updated': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'milestone_completed': return 'text-purple-600 bg-purple-100';
      case 'deleted': return 'text-red-600 bg-red-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const addMilestone = () => {
    setNewGoal(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };

  const updateMilestone = (index: number, value: string) => {
    setNewGoal(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => i === index ? value : milestone)
    }));
  };

  const removeMilestone = (index: number) => {
    setNewGoal(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-green-600 p-3 rounded-lg w-fit mx-auto mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Goal Tracker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Set meaningful goals, track your progress, and celebrate your achievements. 
            Keep a complete history of your journey to success with templates and advanced tracking.
          </p>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid md:grid-cols-6 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{goals.length}</div>
                <div className="text-gray-600">Active Goals</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{completedGoals.length}</div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Archive className="h-8 w-8 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{archivedGoals.length}</div>
                <div className="text-gray-600">Archived</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) || 0}%
                </div>
                <div className="text-gray-600">Avg Progress</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <Flag className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {goals.filter(g => g.priority === 'high').length}
                </div>
                <div className="text-gray-600">High Priority</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center space-x-3">
              <History className="h-8 w-8 text-indigo-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{goalHistory.length}</div>
                <div className="text-gray-600">History Items</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Templates</span>
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showHistory 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <History className="h-4 w-4" />
                <span>History</span>
              </button>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showCompleted 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Completed ({completedGoals.length})</span>
              </button>
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showArchived 
                    ? 'bg-gray-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Archive className="h-4 w-4" />
                <span>Archived ({archivedGoals.length})</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={exportGoals}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowNewGoalForm(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="career">Career</option>
                <option value="personal">Personal</option>
                <option value="financial">Financial</option>
                <option value="health">Health</option>
                <option value="relationships">Relationships</option>
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <div className="flex items-center space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="deadline">Sort by Deadline</option>
                  <option value="priority">Sort by Priority</option>
                  <option value="progress">Sort by Progress</option>
                  <option value="created">Sort by Created</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* History View */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Goal History</span>
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {goalHistory.slice(0, 20).map((entry) => {
                  const Icon = getActionIcon(entry.action);
                  return (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-lg ${getActionColor(entry.action)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.description}</p>
                        <p className="text-xs text-gray-600">{entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  );
                })}
                {goalHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No history yet. Start creating and updating goals to see activity here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed Goals View */}
        <AnimatePresence>
          {showCompleted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span>Completed Goals</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      </div>
                      <button
                        onClick={() => restoreGoal(goal.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      <span className="text-gray-500">
                        Completed: {goal.deadline.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {completedGoals.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No completed goals yet. Keep working towards your active goals!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Archived Goals View */}
        <AnimatePresence>
          {showArchived && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Archive className="h-5 w-5 text-gray-600" />
                <span>Archived Goals</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {archivedGoals.map((goal) => (
                  <div key={goal.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Archive className="h-5 w-5 text-gray-600" />
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                      </div>
                      <button
                        onClick={() => restoreGoal(goal.id, true)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                      <span className="text-gray-500">
                        Progress: {goal.progress}%
                      </span>
                    </div>
                  </div>
                ))}
                {archivedGoals.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    <Archive className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No archived goals yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced New Goal Form */}
        {showNewGoalForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter your goal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe your goal in detail"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="career">Career</option>
                  <option value="personal">Personal</option>
                  <option value="financial">Financial</option>
                  <option value="health">Health</option>
                  <option value="relationships">Relationships</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {/* Milestones Section */}
              <div className="md:col-span-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Milestones</label>
                  <button
                    onClick={addMilestone}
                    className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Milestone</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {newGoal.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={milestone}
                        onChange={(e) => updateMilestone(index, e.target.value)}
                        placeholder={`Milestone ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeMilestone(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowNewGoalForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-6">
          {filteredGoals.map((goal) => {
            const daysUntilDeadline = getDaysUntilDeadline(goal.deadline);
            const completedMilestones = goal.milestones.filter(m => m.completed).length;
            const totalMilestones = goal.milestones.length;
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{goal.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(goal.priority)}`}>
                        {goal.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(goal.category)}`}>
                        {goal.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">{goal.progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => archiveGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Archive Goal"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={goal.progress}
                        onChange={(e) => updateProgress(goal.id, parseInt(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Goal Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Due: {goal.deadline.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className={`text-sm ${
                      daysUntilDeadline < 0 ? 'text-red-600' :
                      daysUntilDeadline < 30 ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {daysUntilDeadline < 0 
                        ? `${Math.abs(daysUntilDeadline)} days overdue`
                        : `${daysUntilDeadline} days remaining`
                      }
                    </span>
                  </div>
                  {totalMilestones > 0 && (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {completedMilestones}/{totalMilestones} milestones
                      </span>
                    </div>
                  )}
                </div>

                {/* Milestones */}
                {goal.milestones.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <button
                            onClick={() => toggleMilestone(goal.id, milestone.id)}
                            className="flex-shrink-0"
                          >
                            {milestone.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <span className={`${milestone.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {milestone.title}
                            </span>
                            <div className="text-xs text-gray-500">
                              Due: {milestone.dueDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGoals.length === 0 && !showNewGoalForm && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' || filterPriority !== 'all'
                ? 'Try adjusting your search or filters.'
                : 'Start by creating your first goal to track your progress.'}
            </p>
            {!searchTerm && filterCategory === 'all' && filterPriority === 'all' && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowNewGoalForm(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Your First Goal
                </button>
                <div className="text-sm text-gray-500">or</div>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Choose from Templates
                </button>
              </div>
            )}
          </div>
        )}

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
                    <h3 className="text-lg font-semibold text-gray-900">Goal Templates</h3>
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
                    {goalTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 cursor-pointer transition-colors"
                        onClick={() => applyTemplate(template)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                            {template.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                        <div className="text-xs text-gray-500 mb-3">
                          Estimated duration: {template.estimatedDuration}
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Milestones:</span>
                          <div className="mt-1 space-y-1">
                            {template.milestones.slice(0, 3).map((milestone, index) => (
                              <div key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                                <Circle className="h-2 w-2" />
                                <span>{milestone}</span>
                              </div>
                            ))}
                            {template.milestones.length > 3 && (
                              <div className="text-xs text-gray-500">
                                +{template.milestones.length - 3} more milestones
                              </div>
                            )}
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
      </div>
    </div>
  );
};

export default GoalTracker;
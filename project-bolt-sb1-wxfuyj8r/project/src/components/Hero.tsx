import React, { useState, useEffect } from 'react';
import { ArrowRight, Target, Compass, TrendingUp, Users, Sparkles, Zap, Star } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Target,
      title: 'Decision Framework',
      description: 'Systematic approach to making complex life and career decisions',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Compass,
      title: 'Values Alignment',
      description: 'Discover and align your choices with your core values',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Goal Tracking',
      description: 'Set, monitor, and achieve your personal and professional goals',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Career Assessment',
      description: 'Understand your strengths and find your ideal career path',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const FloatingElement = ({ delay, size, color }: { delay: number; size: string; color: string }) => (
    <div
      className={`absolute ${size} ${color} rounded-full opacity-20 animate-float`}
      style={{
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <FloatingElement
            key={i}
            delay={i * 0.5}
            size={`w-${Math.floor(Math.random() * 8) + 4} h-${Math.floor(Math.random() * 8) + 4}`}
            color="bg-white"
          />
        ))}
      </div>

      {/* Interactive Mouse Follower */}
      <div
        className="fixed w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sparkles className="h-12 w-12 text-yellow-400 animate-spin-slow" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="h-12 w-12 text-yellow-400 opacity-75" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">Think</span>{' '}
            <span className="inline-block animate-fade-in-up animation-delay-200">Deeper,</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-gradient-x">
              <span className="inline-block animate-fade-in-up animation-delay-400">Decide</span>{' '}
              <span className="inline-block animate-fade-in-up animation-delay-600">Better</span>
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            Navigate life's complex decisions with clarity and confidence. Our comprehensive toolkit helps you explore your values, assess your strengths, and create a roadmap to your ideal future.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <button
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              <Zap className="h-5 w-5 group-hover:animate-bounce" />
              <span>Start Your Journey</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Learn More</span>
            </button>
          </div>
        </div>

        {/* Interactive Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = currentFeature === index;
            return (
              <div
                key={index}
                className={`group bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all duration-500 cursor-pointer transform hover:scale-110 hover:-translate-y-2 ${
                  isActive ? 'bg-white/20 scale-105 -translate-y-1' : ''
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`bg-gradient-to-br ${feature.color} p-3 rounded-lg w-fit mb-4 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-indigo-100 leading-relaxed group-hover:text-white transition-colors duration-300">
                  {feature.description}
                </p>
                <div className={`mt-4 h-1 bg-gradient-to-r ${feature.color} rounded-full transform origin-left transition-all duration-500 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </div>
            );
          })}
        </div>

        {/* Animated Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '5K+', label: 'Decisions Made', icon: Target },
            { value: '92%', label: 'Satisfaction Rate', icon: Star },
            { value: '50+', label: 'Career Paths', icon: TrendingUp },
            { value: '24/7', label: 'Available', icon: Zap }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group border-r border-white/20 last:border-r-0 hover:bg-white/5 rounded-lg p-4 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-2">
                  <Icon className="h-6 w-6 text-yellow-400 group-hover:animate-bounce" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-indigo-200 group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Action Elements */}
        <div className="absolute top-1/4 right-10 animate-bounce-slow">
          <div className="w-4 h-4 bg-yellow-400 rounded-full opacity-60" />
        </div>
        <div className="absolute top-1/3 left-10 animate-bounce-slow animation-delay-1000">
          <div className="w-3 h-3 bg-pink-400 rounded-full opacity-60" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 animate-bounce-slow animation-delay-2000">
          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-60" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
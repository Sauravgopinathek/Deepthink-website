import React, { useState } from 'react';
import { Heart, TrendingUp, ArrowRight, RotateCcw, Eye } from 'lucide-react';
import { coreValues as initialValues } from '../data';
import { CoreValue } from '../types';

const ValuesExplorer: React.FC = () => {
  const [values, setValues] = useState<CoreValue[]>(initialValues);
  const [selectedValue, setSelectedValue] = useState<CoreValue | null>(null);
  const [showAlignment, setShowAlignment] = useState(false);

  const updateImportance = (id: string, importance: number) => {
    setValues(prev => prev.map(value => 
      value.id === id ? { ...value, importance } : value
    ));
  };

  const updateAlignment = (id: string, alignment: number) => {
    setValues(prev => prev.map(value => 
      value.id === id ? { ...value, alignment } : value
    ));
  };

  const getGapAnalysis = () => {
    return values.map(value => ({
      ...value,
      gap: value.importance - value.alignment
    })).sort((a, b) => b.gap - a.gap);
  };

  const resetValues = () => {
    setValues(initialValues);
    setShowAlignment(false);
    setSelectedValue(null);
  };

  const sortedValues = [...values].sort((a, b) => b.importance - a.importance);
  const gapAnalysis = getGapAnalysis();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-red-500 p-3 rounded-lg w-fit mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Values Explorer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what matters most to you and identify areas where your life may be out of alignment with your core values.
          </p>
        </div>

        {/* Phase Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setShowAlignment(false)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                !showAlignment 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rate Importance
            </button>
            <button
              onClick={() => setShowAlignment(true)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                showAlignment 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rate Alignment
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Values List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {showAlignment ? 'Rate Current Alignment' : 'Rate Importance'}
                </h2>
                <button
                  onClick={resetValues}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="space-y-6">
                {values.map((value) => (
                  <div
                    key={value.id}
                    className={`p-6 border-2 rounded-lg transition-all cursor-pointer ${
                      selectedValue?.id === value.id
                        ? 'border-indigo-300 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedValue(value)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{value.name}</h3>
                        <p className="text-gray-600">{value.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {showAlignment ? value.alignment : value.importance}
                        </div>
                        <div className="text-xs text-gray-500">
                          {showAlignment ? 'Alignment' : 'Importance'}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {showAlignment ? 'Current Alignment' : 'Importance Level'}
                          </span>
                          <span className="text-sm text-gray-600">
                            {showAlignment ? value.alignment : value.importance}/10
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={showAlignment ? value.alignment : value.importance}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value);
                            if (showAlignment) {
                              updateAlignment(value.id, newValue);
                            } else {
                              updateImportance(value.id, newValue);
                            }
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Top Values */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Top Values</span>
              </h3>
              <div className="space-y-3">
                {sortedValues.slice(0, 3).map((value, index) => (
                  <div key={value.id} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{value.name}</div>
                      <div className="text-sm text-gray-600">Score: {value.importance}/10</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Eye className="h-5 w-5 text-red-500" />
                <span>Alignment Gaps</span>
              </h3>
              <div className="space-y-3">
                {gapAnalysis.slice(0, 3).map((value, index) => (
                  <div key={value.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{value.name}</span>
                      <span className={`text-sm font-bold ${
                        value.gap > 2 ? 'text-red-600' :
                        value.gap > 0 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {value.gap > 0 ? '+' : ''}{value.gap}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          value.gap > 2 ? 'bg-red-500' :
                          value.gap > 0 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.abs(value.gap) * 10}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Focus on areas with the largest gaps between importance and alignment.
                </p>
              </div>
            </div>

            {/* Action Steps */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                {gapAnalysis.filter(v => v.gap > 1).slice(0, 3).map((value, index) => (
                  <div key={value.id} className="flex items-start space-x-3">
                    <ArrowRight className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900">{value.name}</div>
                      <div className="text-sm text-gray-600">
                        {getActionRecommendation(value.name, value.gap)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed View */}
        {selectedValue && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedValue.name}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600 mb-4">{selectedValue.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-600">{selectedValue.importance}</div>
                    <div className="text-sm text-indigo-800">Importance</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedValue.alignment}</div>
                    <div className="text-sm text-green-800">Alignment</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reflection Questions</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• How does this value show up in your daily life?</li>
                  <li>• What would living this value more fully look like?</li>
                  <li>• What barriers prevent you from honoring this value?</li>
                  <li>• What small step could you take this week to better align with this value?</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getActionRecommendation = (valueName: string, gap: number): string => {
  const recommendations: { [key: string]: string } = {
    'Autonomy': 'Consider roles with more independence or negotiate flexible work arrangements.',
    'Growth': 'Seek learning opportunities, courses, or mentorship programs.',
    'Impact': 'Look for ways to contribute meaningfully to causes you care about.',
    'Security': 'Focus on building emergency funds and stable income sources.',
    'Creativity': 'Make time for creative projects or explore creative problem-solving roles.',
    'Balance': 'Set boundaries between work and personal life, prioritize self-care.'
  };
  
  return recommendations[valueName] || 'Reflect on how to better honor this value in your daily life.';
};

export default ValuesExplorer;
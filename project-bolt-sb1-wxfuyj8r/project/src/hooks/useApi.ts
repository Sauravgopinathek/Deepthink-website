import { useState, useEffect, useCallback } from 'react';

// Generic API hook for data fetching
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Career data hook
export function useCareerData(skills: string[]) {
  const [jobTrends, setJobTrends] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCareerData = useCallback(async () => {
    if (skills.length === 0) return;
    
    setLoading(true);
    try {
      const { careerApi } = await import('../services/api');
      const [trends, salary] = await Promise.all([
        careerApi.getJobTrends(skills),
        careerApi.getSalaryData(skills[0], 'United States')
      ]);
      
      setJobTrends(trends);
      setSalaryData(salary);
    } catch (error) {
      console.error('Career data fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [skills]);

  useEffect(() => {
    fetchCareerData();
  }, [fetchCareerData]);

  return { jobTrends, salaryData, loading, refetch: fetchCareerData };
}

// Real-time mentor availability hook
export function useMentorAvailability() {
  const [onlineMentors, setOnlineMentors] = useState<Set<string>>(new Set());
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const websocket = new WebSocket('wss://api.deepthink.com/mentors/availability');
    
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'availability_update') {
        setOnlineMentors(new Set(data.onlineMentorIds));
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  return { onlineMentors, isConnected: ws?.readyState === WebSocket.OPEN };
}

// Goal progress tracking hook
export function useGoalTracking(goalId: string) {
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState(null);

  const updateProgress = useCallback(async (newProgress: number) => {
    try {
      const { goalApi, analyticsApi } = await import('../services/api');
      await goalApi.trackGoalProgress(goalId, newProgress);
      setProgress(newProgress);
      
      // Track analytics event
      analyticsApi.trackEvent('goal_progress_updated', {
        goal_id: goalId,
        progress: newProgress,
      });
    } catch (error) {
      console.error('Goal progress update error:', error);
    }
  }, [goalId]);

  const fetchInsights = useCallback(async () => {
    try {
      const { goalApi } = await import('../services/api');
      const goalInsights = await goalApi.getGoalInsights('current-user-id');
      setInsights(goalInsights);
    } catch (error) {
      console.error('Goal insights fetch error:', error);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return { progress, insights, updateProgress, refetchInsights: fetchInsights };
}

// AI-powered decision insights hook
export function useDecisionInsights(decisionData: any) {
  const [insights, setInsights] = useState<string | null>(null);
  const [marketResearch, setMarketResearch] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    if (!decisionData || !decisionData.title) return;
    
    setLoading(true);
    try {
      const { decisionApi } = await import('../services/api');
      const [aiInsights, research] = await Promise.all([
        decisionApi.getDecisionInsights(decisionData),
        decisionApi.getMarketResearch(decisionData.title)
      ]);
      
      setInsights(aiInsights);
      setMarketResearch(research);
    } catch (error) {
      console.error('Decision insights error:', error);
    } finally {
      setLoading(false);
    }
  }, [decisionData]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  return { insights, marketResearch, loading, regenerate: generateInsights };
}

// Values alignment insights hook
export function useValuesInsights(valuesData: any[]) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsights = useCallback(async () => {
    if (!valuesData || valuesData.length === 0) return;
    
    setLoading(true);
    try {
      const { valuesApi } = await import('../services/api');
      const aiInsights = await valuesApi.getValuesInsights(valuesData);
      setInsights(aiInsights);
    } catch (error) {
      console.error('Values insights error:', error);
    } finally {
      setLoading(false);
    }
  }, [valuesData]);

  useEffect(() => {
    generateInsights();
  }, [generateInsights]);

  return { insights, loading, regenerate: generateInsights };
}

// Dynamic resource loading hook
export function useResources(category: string) {
  const [resources, setResources] = useState({
    articles: [],
    videos: [],
    courses: []
  });
  const [loading, setLoading] = useState(false);

  const fetchResources = useCallback(async () => {
    if (!category) return;
    
    setLoading(true);
    try {
      const { resourceApi } = await import('../services/api');
      const curatedResources = await resourceApi.getCuratedResources(category);
      setResources(curatedResources);
    } catch (error) {
      console.error('Resources fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return { resources, loading, refetch: fetchResources };
}
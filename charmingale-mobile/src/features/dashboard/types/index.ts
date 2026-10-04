

export interface DashboardData {
  totalTopics: number;
  completedTopics: number;
  totalStudiedSeconds: number;
  streakCounts: number;
  name: string | null;
}


export interface DashboardStats extends DashboardData{
  isLoading: boolean;
  getDashboardStats: () => Promise<void>;
}








export interface DashboardData {
  totalTopics: number;
  completedTopics: number;
  totalStudiedSeconds: number;
  streakCounts: number;

}


export interface DashboardStats extends DashboardData{
  isLoading: boolean;
  getDashboardStats: () => Promise<void>;

}





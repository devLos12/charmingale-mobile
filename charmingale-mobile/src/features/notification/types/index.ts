
export interface NotificationType {
  id: number;
  title: string;
  body: string;
  path: string | null;
  read: boolean;
  createdAt: string; 
}


export interface NotificationStore {
    loadingNotification: boolean;
    notification: NotificationType[];
    getNotification: () => Promise<void>;
}



export type NotificationProps = {
    notification: NotificationType[]
}

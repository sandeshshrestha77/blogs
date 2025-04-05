
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Notification = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  read: boolean;
};

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Using mock notifications since we don't have a dedicated notifications table
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }
      
      // Transform comments into notifications
      const notificationsData = (data || []).map((comment) => ({
        id: comment.id,
        title: 'New Comment',
        content: `${comment.name} commented: ${comment.content.substring(0, 50)}${comment.content.length > 50 ? '...' : ''}`,
        created_at: comment.created_at,
        read: false,
      }));
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    // In a real app, you would update a notifications table
    // For now we'll just update the local state
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open, user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white hover:bg-zinc-800">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-zinc-900 border border-zinc-800 text-white" align="end">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
          <h3 className="font-medium">Notifications</h3>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs h-7 text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="py-2 max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-6 text-zinc-500">
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-2 rounded-md cursor-pointer ${notification.read ? 'bg-zinc-800/50' : 'bg-zinc-800'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <span className="text-xs text-zinc-500">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400">{notification.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

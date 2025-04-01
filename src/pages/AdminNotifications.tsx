
import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, AlertCircle, MessageSquare, Bell, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New comment",
      message: "You received a new comment on your post 'Getting Started with React'",
      read: false,
      time: "2 hours ago",
      type: "comment"
    },
    {
      id: "2",
      title: "Post published",
      message: "Your post 'Mastering TypeScript' has been successfully published",
      read: false,
      time: "Yesterday",
      type: "post"
    },
    {
      id: "3",
      title: "New subscriber",
      message: "You have a new newsletter subscriber: john@example.com",
      read: true,
      time: "3 days ago",
      type: "subscriber"
    },
    {
      id: "4",
      title: "Comment approved",
      message: "A comment on 'Mastering TypeScript' was automatically approved",
      read: true,
      time: "1 week ago",
      type: "comment"
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast.success("Notification deleted");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Notifications
            </h1>
            <p className="text-gray-500 mt-1">
              Stay updated with all your blog activity
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-sm"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
              className="text-sm text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear all
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-muted/20 w-full max-w-md">
            <TabsTrigger value="all" className="flex-1">
              All
              <Badge className="ml-2 bg-gray-500">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Unread
              <Badge className="ml-2 bg-blue-500">{unreadCount}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>
                  View and manage all your notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`py-4 first:pt-0 last:pb-0 ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex gap-4">
                        <div className={`p-2 h-10 w-10 rounded-full flex items-center justify-center ${notification.read ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'}`}>
                          {notification.type === "comment" ? (
                            <MessageSquare className="h-5 w-5" />
                          ) : notification.type === "post" ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{notification.title}</p>
                              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 h-8 px-2"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 h-8 px-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Unread Notifications</CardTitle>
                <CardDescription>
                  Notifications you haven't read yet
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y">
                {unreadCount === 0 ? (
                  <div className="py-6 text-center">
                    <Check className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">All caught up!</p>
                  </div>
                ) : (
                  notifications
                    .filter(notification => !notification.read)
                    .map((notification) => (
                      <div key={notification.id} className="py-4 first:pt-0 last:pb-0 bg-blue-50/50">
                        <div className="flex gap-4">
                          <div className="p-2 h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                            {notification.type === "comment" ? (
                              <MessageSquare className="h-5 w-5" />
                            ) : notification.type === "post" ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <Bell className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{notification.title}</p>
                                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 h-8 px-2"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-red-600 h-8 px-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;

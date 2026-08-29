import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/models/notification_model.dart';

class NotificationsPage extends ConsumerStatefulWidget {
  const NotificationsPage({super.key});

  @override
  ConsumerState<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends ConsumerState<NotificationsPage> {
  String _formatTimeAgo(DateTime dateTime) {
    final difference = DateTime.now().difference(dateTime);
    if (difference.inDays >= 1) return '${difference.inDays}d ago';
    if (difference.inHours >= 1) return '${difference.inHours}h ago';
    if (difference.inMinutes >= 1) return '${difference.inMinutes}m ago';
    return 'just now';
  }

  final List<AppNotification> _notifications = [
    AppNotification(
      id: '1',
      title: 'New Like',
      body: 'John Doe liked your post',
      timestamp: DateTime.now().subtract(const Duration(minutes: 2)),
      type: NotificationType.like,
    ),
    AppNotification(
      id: '2',
      title: 'New Comment',
      body: 'Jane Smith commented: "Great work!"',
      timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
      type: NotificationType.comment,
    ),
    AppNotification(
      id: '3',
      title: 'New Follower',
      body: 'Alex Rivera started following you',
      timestamp: DateTime.now().subtract(const Duration(hours: 1)),
      type: NotificationType.follow,
    ),
    AppNotification(
      id: '4',
      title: 'System Update',
      body: 'Nexus Connect v2.0 is now available',
      timestamp: DateTime.now().subtract(const Duration(days: 1)),
      type: NotificationType.system,
      isRead: true,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                for (var i = 0; i < _notifications.length; i++) {
                  _notifications[i] = AppNotification(
                    id: _notifications[i].id,
                    title: _notifications[i].title,
                    body: _notifications[i].body,
                    timestamp: _notifications[i].timestamp,
                    type: _notifications[i].type,
                    isRead: true,
                  );
                }
              });
            },
            child: const Text('Mark all as read'),
          ),
        ],
      ),
      body: _notifications.isEmpty
          ? const Center(child: Text('No notifications yet'))
          : ListView.separated(
              itemCount: _notifications.length,
              separatorBuilder: (context, index) => const Divider(height: 1),
              itemBuilder: (context, index) {
                final notification = _notifications[index];
                return Dismissible(
                  key: Key(notification.id),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    color: const Color(0xFFFF5252), // destructive: 0 84% 60% roughly
                    child: const Icon(Icons.delete, color: Colors.white),
                  ),
                  onDismissed: (direction) {
                    setState(() {
                      _notifications.removeAt(index);
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Notification dismissed'), duration: Duration(seconds: 1)),
                    );
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeInOut,
                    color: notification.isRead ? Colors.transparent : Theme.of(context).colorScheme.primary.withOpacity(0.05),
                    child: ListTile(
                      leading: _getNotificationIcon(notification.type),
                      title: Text(
                        notification.title,
                        style: TextStyle(
                          fontWeight: notification.isRead ? FontWeight.normal : FontWeight.bold,
                        ),
                      ),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(notification.body),
                          const SizedBox(height: 4),
                          Text(
                            _formatTimeAgo(notification.timestamp),
                            style: TextStyle(fontSize: 12, color: Theme.of(context).hintColor),
                          ),
                        ],
                      ),
                      onTap: () {
                        setState(() {
                          _notifications[index] = AppNotification(
                            id: notification.id,
                            title: notification.title,
                            body: notification.body,
                            timestamp: notification.timestamp,
                            type: notification.type,
                            isRead: true,
                          );
                        });
                      },
                      trailing: !notification.isRead
                          ? Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: Theme.of(context).colorScheme.primary,
                                shape: BoxShape.circle,
                              ),
                            )
                          : null,
                    ),
                  ),
                );
              },
            ),
    );
  }

  Widget _getNotificationIcon(NotificationType type) {
    IconData iconData;
    Color color;

    switch (type) {
      case NotificationType.like:
        iconData = Icons.favorite;
        color = Colors.red;
        break;
      case NotificationType.comment:
        iconData = Icons.comment;
        color = Colors.blue;
        break;
      case NotificationType.follow:
        iconData = Icons.person_add;
        color = Colors.green;
        break;
      case NotificationType.system:
        iconData = Icons.info;
        color = Colors.orange;
        break;
    }

    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(iconData, color: color, size: 20),
    );
  }
}

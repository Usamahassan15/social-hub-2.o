import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../../core/models/message_model.dart';
import '../../../core/services/supabase_service.dart';

class MessagesPage extends ConsumerStatefulWidget {
  const MessagesPage({super.key});

  @override
  ConsumerState<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends ConsumerState<MessagesPage> {
  String? selectedConversationId;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isDesktop = constraints.maxWidth > 900;

          if (isDesktop) {
            return Row(
              children: [
                SizedBox(
                  width: 350,
                  child: ConversationList(
                    onConversationSelected: (id) {
                      setState(() => selectedConversationId = id);
                    },
                    selectedId: selectedConversationId,
                  ),
                ),
                const VerticalDivider(width: 1),
                Expanded(
                  child: selectedConversationId != null
                      ? ChatArea(conversationId: selectedConversationId!)
                      : const Center(child: Text('Select a conversation to start chatting')),
                ),
              ],
            );
          }

          return selectedConversationId == null
              ? ConversationList(
                  onConversationSelected: (id) {
                    setState(() => selectedConversationId = id);
                  },
                )
              : ChatArea(
                  conversationId: selectedConversationId!,
                  onBack: () => setState(() => selectedConversationId = null),
                );
        },
      ),
    );
  }
}

class ConversationList extends StatelessWidget {
  final Function(String) onConversationSelected;
  final String? selectedId;

  const ConversationList({
    super.key,
    required this.onConversationSelected,
    this.selectedId,
  });

  @override
  Widget build(BuildContext context) {
    // Mock Data
    final conversations = [
      Conversation(
        id: '1',
        otherUserId: 'u1',
        otherUserName: 'Sarah Jenkins',
        otherUserAvatar: 'https://i.pravatar.cc/150?u=u1',
        isOnline: true,
        lastMessage: 'Hey, are we still meeting today?',
        lastMessageTime: DateTime.now().subtract(const Duration(minutes: 5)),
        unreadCount: 2,
      ),
      Conversation(
        id: '2',
        otherUserId: 'u2',
        otherUserName: 'Tech Support',
        otherUserAvatar: 'https://i.pravatar.cc/150?u=u2',
        isOnline: false,
        lastMessage: 'Your ticket has been resolved.',
        lastMessageTime: DateTime.now().subtract(const Duration(hours: 2)),
      ),
    ];

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Messages', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              IconButton(onPressed: () {}, icon: const Icon(Icons.edit_note_outlined)),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Search messages...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide.none,
              ),
              filled: true,
              fillColor: Theme.of(context).colorScheme.secondary.withOpacity(0.5),
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            itemCount: conversations.length,
            itemBuilder: (context, index) {
              final conv = conversations[index];
              final isSelected = selectedId == conv.id;

              return AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                color: isSelected ? Theme.of(context).colorScheme.primary.withOpacity(0.1) : Colors.transparent,
                child: ListTile(
                  onTap: () => onConversationSelected(conv.id),
                  leading: Stack(
                    children: [
                      CircleAvatar(backgroundImage: NetworkImage(conv.otherUserAvatar)),
                      if (conv.isOnline)
                        Positioned(
                          right: 0,
                          bottom: 0,
                          child: Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: Colors.green,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                          ),
                        ),
                    ],
                  ),
                  title: Text(conv.otherUserName, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(conv.lastMessage, maxLines: 1, overflow: TextOverflow.ellipsis),
                  trailing: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        DateFormat.jm().format(conv.lastMessageTime),
                        style: TextStyle(fontSize: 12, color: Theme.of(context).hintColor),
                      ),
                      if (conv.unreadCount > 0)
                        Container(
                          margin: const EdgeInsets.only(top: 4),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            conv.unreadCount.toString(),
                            style: const TextStyle(color: Colors.white, fontSize: 10),
                          ),
                        ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class ChatArea extends ConsumerStatefulWidget {
  final String conversationId;
  final VoidCallback? onBack;

  const ChatArea({super.key, required this.conversationId, this.onBack});

  @override
  ConsumerState<ChatArea> createState() => _ChatAreaState();
}

class _ChatAreaState extends ConsumerState<ChatArea> {
  final TextEditingController _messageController = TextEditingController();
  ChatMessage? replyingTo;

  @override
  Widget build(BuildContext context) {
    final supabase = ref.watch(supabaseServiceProvider);
    final currentUserId = supabase.currentUser?.id ?? 'me';

    // Mock Data
    final messages = [
      ChatMessage(
        id: 'm1',
        senderId: 'other',
        content: 'Hey, how are you?',
        timestamp: DateTime.now().subtract(const Duration(minutes: 10)),
        status: MessageStatus.seen,
      ),
      ChatMessage(
        id: 'm2',
        senderId: currentUserId,
        content: 'I am good! Just working on the project.',
        timestamp: DateTime.now().subtract(const Duration(minutes: 8)),
        status: MessageStatus.seen,
      ),
      ChatMessage(
        id: 'm3',
        senderId: 'other',
        content: 'Great! Do you have time for a quick call?',
        timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
        status: MessageStatus.seen,
      ),
    ];

    return Column(
      children: [
        _buildHeader(context),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: messages.length,
            itemBuilder: (context, index) {
              final msg = messages[index];
              final isMe = msg.senderId == currentUserId;
              return _buildMessageBubble(msg, isMe);
            },
          ),
        ),
        if (replyingTo != null) _buildReplyPreview(),
        _buildInputArea(),
      ],
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4)],
      ),
      child: Row(
        children: [
          if (widget.onBack != null) IconButton(icon: const Icon(Icons.arrow_back), onPressed: widget.onBack),
          const CircleAvatar(backgroundImage: NetworkImage('https://i.pravatar.cc/150?u=u1')),
          const SizedBox(width: 12),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Sarah Jenkins', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Text('Online', style: TextStyle(color: Colors.green, fontSize: 12)),
            ],
          ),
          const Spacer(),
          IconButton(icon: const Icon(Icons.videocam_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.phone_outlined), onPressed: () {}),
          IconButton(icon: const Icon(Icons.info_outline), onPressed: () {}),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(ChatMessage msg, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? Theme.of(context).colorScheme.primary : Theme.of(context).colorScheme.secondary.withOpacity(0.3),
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: Radius.circular(isMe ? 16 : 0),
            bottomRight: Radius.circular(isMe ? 0 : 16),
          ),
        ),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.7),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Text(
              msg.content,
              style: TextStyle(color: isMe ? Colors.white : null),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  DateFormat.jm().format(msg.timestamp),
                  style: TextStyle(fontSize: 10, color: isMe ? Colors.white70 : Colors.grey),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    msg.status == MessageStatus.seen
                        ? Icons.done_all
                        : msg.status == MessageStatus.delivered
                            ? Icons.done_all
                            : Icons.done,
                    size: 14,
                    color: msg.status == MessageStatus.seen ? Colors.white : Colors.white70,
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReplyPreview() {
    return Container(
      padding: const EdgeInsets.all(8),
      color: Theme.of(context).colorScheme.surface,
      child: Row(
        children: [
          const Icon(Icons.reply, size: 20, color: Colors.grey),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Replying to Sarah', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                Text(replyingTo!.content, maxLines: 1, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12)),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, size: 20),
            onPressed: () => setState(() => replyingTo = null),
          ),
        ],
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        border: Border(top: BorderSide(color: Colors.grey.withOpacity(0.2))),
      ),
      child: Row(
        children: [
          IconButton(icon: const Icon(Icons.add), onPressed: () {}),
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                filled: true,
                fillColor: Theme.of(context).colorScheme.secondary.withOpacity(0.3),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            icon: const Icon(Icons.send),
            color: Theme.of(context).colorScheme.primary,
            onPressed: () {
              if (_messageController.text.isNotEmpty) {
                // Send logic here
                _messageController.clear();
                setState(() => replyingTo = null);
              }
            },
          ),
        ],
      ),
    );
  }
}

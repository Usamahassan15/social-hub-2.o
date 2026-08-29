import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../shared/widgets/responsive_layout.dart';
import '../widgets/post_card.dart';
import '../widgets/stories_list.dart';
import '../widgets/feed_selector.dart';
import '../providers/feed_provider.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: ResponsiveLayout(
        mobile: const MobileHomeView(),
        desktop: const DesktopHomeView(),
      ),
      bottomNavigationBar: ResponsiveLayout.isMobile(context)
          ? const MobileNav()
          : null,
    );
  }
}

class MobileHomeView extends ConsumerWidget {
  const MobileHomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedAsync = ref.watch(feedNotifierProvider);

    return Scaffold(
      appBar: const PreferredSize(
        preferredSize: Size.fromHeight(60),
        child: TopBar(),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(feedNotifierProvider.notifier).refresh(),
        child: CustomScrollView(
          slivers: [
            const SliverToBoxAdapter(child: Stories()),
            const SliverToBoxAdapter(child: FeedTypeSelector()),
            feedAsync.when(
              data: (posts) => SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => InstaPost(post: posts[index]),
                  childCount: posts.length,
                ),
              ),
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (err, stack) => SliverFillRemaining(
                child: Center(child: Text('Error: $err')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DesktopHomeView extends ConsumerWidget {
  const DesktopHomeView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final feedAsync = ref.watch(feedNotifierProvider);

    return Row(
      children: [
        // Left Sidebar
        const DesktopSidebar(),

        // Main Feed
        Expanded(
          flex: 3,
          child: CustomScrollView(
            slivers: [
              const SliverToBoxAdapter(child: Stories()),
              const SliverToBoxAdapter(child: FeedTypeSelector()),
              feedAsync.when(
                data: (posts) => SliverList(
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => InstaPost(post: posts[index]),
                    childCount: posts.length,
                  ),
                ),
                loading: () => const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator()),
                ),
                error: (err, stack) => SliverFillRemaining(
                  child: Center(child: Text('Error: $err')),
                ),
              ),
            ],
          ),
        ),

        // Right Sidebar (Trending)
        const Expanded(
          flex: 1,
          child: TrendingSidebar(),
        ),
      ],
    );
  }
}

class TopBar extends StatelessWidget {
  const TopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: const Text(
        'Nexus Connect',
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: Color(0xFF00A3FF),
        ),
      ),
      actions: [
        IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
        IconButton(icon: const Icon(Icons.send_outlined), onPressed: () {}),
      ],
    );
  }
}

class MobileNav extends StatelessWidget {
  const MobileNav({super.key});

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      selectedItemColor: const Color(0xFF00A3FF),
      unselectedItemColor: Colors.grey,
      onTap: (index) {
        if (index == 4) {
          context.push('/profile');
        }
      },
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Explore'),
        BottomNavigationBarItem(icon: Icon(Icons.add_box_outlined), label: 'Post'),
        BottomNavigationBarItem(icon: Icon(Icons.video_library_outlined), label: 'Reels'),
        BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
      ],
    );
  }
}

class DesktopSidebar extends StatelessWidget {
  const DesktopSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      decoration: BoxDecoration(
        border: Border(right: BorderSide(color: Colors.grey[300]!)),
      ),
      child: Column(
        children: [
          const Padding(
            padding: EdgeInsets.all(24.0),
            child: Text(
              'Nexus Connect',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF00A3FF),
              ),
            ),
          ),
          _SidebarItem(icon: Icons.home, label: 'Home', isActive: true, onTap: () => context.go('/')),
          _SidebarItem(icon: Icons.search, label: 'Search'),
          _SidebarItem(icon: Icons.explore_outlined, label: 'Explore'),
          _SidebarItem(icon: Icons.video_library_outlined, label: 'Reels'),
          _SidebarItem(icon: Icons.message_outlined, label: 'Messages'),
          _SidebarItem(icon: Icons.favorite_border, label: 'Notifications'),
          _SidebarItem(icon: Icons.add_box_outlined, label: 'Create'),
          _SidebarItem(icon: Icons.person_outline, label: 'Profile', onTap: () => context.push('/profile')),
          const Spacer(),
          _SidebarItem(icon: Icons.menu, label: 'More'),
        ],
      ),
    );
  }
}

class _SidebarItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback? onTap;

  const _SidebarItem({
    required this.icon,
    required this.label,
    this.isActive = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 12.0),
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF00A3FF).withOpacity(0.1) : null,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Icon(icon, color: isActive ? const Color(0xFF00A3FF) : Colors.black87),
              const SizedBox(width: 16),
              Text(
                label,
                style: TextStyle(
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                  color: isActive ? const Color(0xFF00A3FF) : Colors.black87,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TrendingSidebar extends StatelessWidget {
  const TrendingSidebar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        border: Border(left: BorderSide(color: Colors.grey[300]!)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Trending for you',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _TrendingItem(category: 'Technology', title: '#FlutterDev', posts: '12.5K'),
          _TrendingItem(category: 'Sports', title: '#Olympics2026', posts: '85K'),
          _TrendingItem(category: 'Music', title: 'New Album Release', posts: '42K'),
          _TrendingItem(category: 'News', title: 'Global Summit', posts: '15K'),
          const SizedBox(height: 24),
          const Text(
            'Suggested for you',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _SuggestedUser(name: 'John Doe', username: '@johndoe'),
          _SuggestedUser(name: 'Jane Smith', username: '@janesmith'),
        ],
      ),
    );
  }
}

class _TrendingItem extends StatelessWidget {
  final String category;
  final String title;
  final String posts;

  const _TrendingItem({
    required this.category,
    required this.title,
    required this.posts,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(category, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          Text('$posts posts', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
        ],
      ),
    );
  }
}

class _SuggestedUser extends StatelessWidget {
  final String name;
  final String username;

  const _SuggestedUser({required this.name, required this.username});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          CircleAvatar(
            radius: 18,
            backgroundImage: NetworkImage('https://api.dicebear.com/7.x/avataaars/svg?seed=$username'),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              Text(username, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
            ],
          ),
          const Spacer(),
          TextButton(
            onPressed: () {},
            child: const Text('Follow', style: TextStyle(color: Color(0xFF00A3FF))),
          ),
        ],
      ),
    );
  }
}

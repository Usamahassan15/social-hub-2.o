import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/models/post_model.dart';
import '../../../../core/services/supabase_service.dart';

part 'feed_provider.g.dart';

@riverpod
class FeedType extends _$FeedType {
  @override
  String build() => 'Personalized';

  void setType(String type) => state = type;
}

@riverpod
class FeedNotifier extends _$FeedNotifier {
  @override
  Future<List<PostModel>> build() async {
    final type = ref.watch(feedTypeProvider);
    final supabase = ref.read(supabaseServiceProvider);

    final data = await supabase.getPosts(category: type);
    return data.map((json) {
      final post = PostModel.fromJson(json);
      final profile = json['profiles'] as Map<String, dynamic>?;
      return post.copyWith(
        username: profile?['username'],
        avatarUrl: profile?['avatar_url'],
      );
    }).toList();
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final type = ref.read(feedTypeProvider);
      final supabase = ref.read(supabaseServiceProvider);
      final data = await supabase.getPosts(category: type);
      return data.map((json) {
        final post = PostModel.fromJson(json);
        final profile = json['profiles'] as Map<String, dynamic>?;
        return post.copyWith(
          username: profile?['username'],
          avatarUrl: profile?['avatar_url'],
        );
      }).toList();
    });
  }
}

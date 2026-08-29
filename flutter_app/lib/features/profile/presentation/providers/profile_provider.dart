import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:nexus_connect/core/services/supabase_service.dart';
import 'package:nexus_connect/core/models/profile_model.dart';
import 'package:nexus_connect/core/models/post_model.dart';

part 'profile_provider.g.dart';

@riverpod
class ProfileNotifier extends _$ProfileNotifier {
  @override
  FutureOr<ProfileModel?> build() async {
    final supabase = ref.watch(supabaseServiceProvider);
    final user = supabase.currentUser;
    if (user == null) return null;

    final data = await supabase.client
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

    return ProfileModel.fromJson(data);
  }

  Future<void> updateProfile(ProfileModel profile) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final supabase = ref.read(supabaseServiceProvider);
      final data = await supabase.client
          .from('profiles')
          .update(profile.toJson())
          .eq('id', profile.id)
          .select()
          .single();
      return ProfileModel.fromJson(data);
    });
  }
}

@riverpod
class UserPostsNotifier extends _$UserPostsNotifier {
  @override
  FutureOr<List<PostModel>> build() async {
    final supabase = ref.watch(supabaseServiceProvider);
    final user = supabase.currentUser;
    if (user == null) return [];

    final data = await supabase.client
        .from('posts')
        .select('*, profiles:user_id(username, avatar_url)')
        .eq('user_id', user.id)
        .order('created_at', ascending: false);

    return (data as List).map((e) => PostModel.fromJson(e)).toList();
  }
}

@riverpod
class ProfileModeNotifier extends _$ProfileModeNotifier {
  @override
  bool build() => false; // false = Social, true = Work

  void toggle() => state = !state;
}

import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

part 'supabase_service.g.dart';

@Riverpod(keepAlive: true)
SupabaseService supabaseService(SupabaseServiceRef ref) {
  return SupabaseService();
}

class SupabaseService {
  static final SupabaseService _instance = SupabaseService._internal();
  factory SupabaseService() => _instance;
  SupabaseService._internal();

  final SupabaseClient client = Supabase.instance.client;

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: 'https://lwexuydsatwcwaooepbl.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZXh1eWRzYXR3Y3dhb29lcGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTc5MjcsImV4cCI6MjA4ODU5MzkyN30.RoA5kUxqtQ4JYUj0R7jykU0h1oF2YkYmZWSHMu0-skI',
    );
  }

  // Auth Methods
  Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    return await client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
  }) async {
    return await client.auth.signUp(
      email: email,
      password: password,
    );
  }

  Future<void> signOut() async {
    await client.auth.signOut();
  }

  User? get currentUser => client.auth.currentUser;

  Session? get currentSession => client.auth.currentSession;

  // Post Methods
  Future<List<Map<String, dynamic>>> getPosts({
    int limit = 20,
    int offset = 0,
    String? category,
  }) async {
    var query = client
        .from('posts')
        .select('*, profiles:user_id(username, avatar_url)')
        .order('created_at', ascending: false)
        .range(offset, offset + limit - 1);

    if (category != null && category != 'Personalized' && category != 'Latest') {
      query = query.eq('category', category.toLowerCase());
    }

    return await query;
  }
}

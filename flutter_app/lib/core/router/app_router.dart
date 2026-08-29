import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:nexus_connect/core/services/supabase_service.dart';

import 'package:nexus_connect/features/home/presentation/pages/home_page.dart';
import 'package:nexus_connect/features/auth/presentation/pages/auth_page.dart';
import 'package:nexus_connect/features/auth/presentation/pages/welcome_page.dart';
import 'package:nexus_connect/features/auth/presentation/pages/onboarding_page.dart';
import 'package:nexus_connect/features/profile/presentation/pages/profile_page.dart';
import 'package:nexus_connect/features/profile/presentation/pages/settings_page.dart';
import 'package:nexus_connect/features/messaging/presentation/messages_page.dart';
import 'package:nexus_connect/features/notifications/presentation/notifications_page.dart';
import 'package:nexus_connect/features/wallet/presentation/wallet_page.dart';
import 'package:nexus_connect/features/services/presentation/services_page.dart';

part 'app_router.g.dart';

@riverpod
GoRouter router(RouterRef ref) {
  final supabase = ref.watch(supabaseServiceProvider);

  return GoRouter(
    initialLocation: '/',
    refreshListenable: SupabaseAuthListenable(supabase),
    redirect: (context, state) {
      final session = supabase.client.auth.currentSession;
      final isLoggingIn = state.matchedLocation == '/auth' ||
                          state.matchedLocation == '/welcome' ||
                          state.matchedLocation == '/reset-password';

      if (session == null) {
        return isLoggingIn ? null : '/welcome';
      }

      if (isLoggingIn) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        path: '/welcome',
        builder: (context, state) => const WelcomePage(),
      ),
      GoRoute(
        path: '/auth',
        builder: (context, state) => const AuthPage(),
      ),
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingPage(),
      ),
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfilePage(),
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsPage(),
      ),
      GoRoute(
        path: '/messages',
        builder: (context, state) => const MessagesPage(),
      ),
      GoRoute(
        path: '/notifications',
        builder: (context, state) => const NotificationsPage(),
      ),
      GoRoute(
        path: '/wallet',
        builder: (context, state) => const WalletPage(),
      ),
      GoRoute(
        path: '/services',
        builder: (context, state) => const ServicesPage(),
      ),
    ],
  );
}

class SupabaseAuthListenable extends ChangeNotifier {
  SupabaseAuthListenable(SupabaseService service) {
    service.client.auth.onAuthStateChange.listen((data) {
      notifyListeners();
    });
  }
}

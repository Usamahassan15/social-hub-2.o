# Implementation Plan: Convert React/Web to Flutter Responsive App

This plan outlines the steps to convert the existing "Nexus Connect" React/TypeScript web application into a fully responsive Flutter mobile and desktop application, preserving all functionalities and design principles.

## User Review Required

> [!IMPORTANT]
> The conversion will map React components to Flutter widgets. While I will strive for exact visual parity, some Tailwind-specific layouts will be implemented using Flutter's `Flex`, `Column`, `Row`, and `Stack` widgets.
> The Flutter app will be created in a new subdirectory `flutter_app` within the current project root to avoid data loss in the existing web project.

> [!WARNING]
> Supabase integration requires specific configuration (URL and Anon Key). I will use the `.env` file from the current project if available, but you will need to ensure the Supabase project allows connections from the Flutter app's bundle ID / package name.

## Proposed Changes

### Project Initialization

#### [NEW] `flutter_app/`
A new Flutter project directory containing the entire application.

### Core Architecture & Dependencies

#### [NEW] `pubspec.yaml`(file:///C:/Users/USAMA/StudioProjects/nexus-connect-83/flutter_app/pubspec.yaml)
Add essential dependencies:
- `supabase_flutter`: For Backend-as-a-Service.
- `flutter_riverpod`: For state management (replacing React Context/TanStack Query).
- `go_router`: For declarative routing (replacing React Router).
- `lucide_icons`: To match the existing icon set.
- `google_fonts`: For consistent typography.
- `flutter_svg`: For SVG asset support.
- `intl`: For localization and date formatting.

### Data Layer (Supabase Mapping)

#### [NEW] `lib/core/models/`
Convert TypeScript interfaces/Zod schemas to Dart classes:
- `user_model.dart`
- `post_model.dart`
- `message_model.dart`
- `service_model.dart`
- `wallet_transaction_model.dart`

#### [NEW] `lib/core/services/`
- `supabase_service.dart`: Initialization and core client provider.
- `auth_service.dart`: Login, Signup, 2FA, Reset Password.
- `database_service.dart`: Generic CRUD operations.

### Presentation Layer (UI Mapping)

#### [NEW] `lib/features/`
Organize by feature area to match `src/pages/`:
- `auth/`: Welcome, Auth, ResetPassword, TwoFactor, Onboarding.
- `home/`: Feed, PostDetail.
- `profile/`: Profile, UserProfile, Settings, ChangePassword.
- `explore/`: Explore, PeopleSuggestions.
- `messaging/`: Messages, UnreadCount.
- `services/`: Services, ServicesDashboard.
- `transport/`: Transport, DriverMode.
- `wallet/`: Wallet.
- `admin/`: Moderation, ReportCenter.

### Responsiveness & Theming

#### [NEW] `lib/core/theme/`
- `app_theme.dart`: Define Light/Dark themes based on the Tailwind/Shadcn configuration.
- `responsive_layout.dart`: A helper widget to handle mobile, tablet, and desktop breakpoints.

## Verification Plan

### Automated Tests
- Unit tests for Model parsing (JSON to Dart).
- Unit tests for AuthService (Mocking Supabase).
- Widget tests for key UI components (Buttons, Inputs).

### Manual Verification
- Verify Auth flow (Login -> Home).
- Verify Navigation between all pages via the Bottom Navigation Bar or Side Drawer.
- Verify Responsive layout by resizing the window (on Desktop/Web targets) or using different device emulators.

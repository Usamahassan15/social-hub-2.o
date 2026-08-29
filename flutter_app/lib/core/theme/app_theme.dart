import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static final light = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF00A3FF),
      brightness: Brightness.light,
      background: const Color(0xFFFAFAFA),
      surface: Colors.white,
      primary: const Color(0xFF00A3FF),
      secondary: const Color(0xFFE2E8F0),
      onPrimary: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardTheme(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );

  static final dark = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF00A3FF),
      brightness: Brightness.dark,
      background: const Color(0xFF0B0F13),
      surface: const Color(0xFF15191F),
      primary: const Color(0xFF00A3FF),
      secondary: const Color(0xFF1E293B),
      onPrimary: Colors.white,
    ),
    textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF15191F),
      elevation: 0,
      centerTitle: false,
    ),
    cardTheme: CardTheme(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
  );
}

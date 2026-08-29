import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';

class ServicesPage extends StatefulWidget {
  const ServicesPage({super.key});

  @override
  State<ServicesPage> createState() => _ServicesPageState();
}

class _ServicesPageState extends State<ServicesPage> {
  String _selectedCategory = 'All';

  // HSL Colors based on Tailwind config
  final primaryColor = const HSLColor.fromAHSL(1.0, 199, 1.0, 0.5).toColor();
  final backgroundColor = const HSLColor.fromAHSL(1.0, 0, 0, 1.0).toColor();
  final foregroundColor = const HSLColor.fromAHSL(1.0, 222.2, 0.84, 0.049).toColor();
  final mutedForegroundColor = const HSLColor.fromAHSL(1.0, 215.4, 0.163, 0.469).toColor();
  final borderColor = const HSLColor.fromAHSL(1.0, 214.3, 0.318, 0.914).toColor();

  final List<String> _categories = ['All', 'Transport', 'Delivery', 'Cleaning', 'Repairs', 'Home', 'Digital'];

  final List<Map<String, dynamic>> _services = [
    {'name': 'Ride', 'icon': LucideIcons.car, 'category': 'Transport', 'color': Color(0xFF3B82F6)},
    {'name': 'Delivery', 'icon': LucideIcons.truck, 'category': 'Delivery', 'color': Color(0xFFF59E0B)},
    {'name': 'House Cleaning', 'icon': LucideIcons.brush, 'category': 'Cleaning', 'color': Color(0xFF8B5CF6)},
    {'name': 'Plumbing', 'icon': LucideIcons.wrench, 'category': 'Repairs', 'color': Color(0xFFEF4444)},
    {'name': 'Electrician', 'icon': LucideIcons.zap, 'category': 'Repairs', 'color': Color(0xFFEAB308)},
    {'name': 'Laundry', 'icon': LucideIcons.droplets, 'category': 'Cleaning', 'color': Color(0xFF06B6D4)},
    {'name': 'Grocery', 'icon': LucideIcons.shoppingBag, 'category': 'Delivery', 'color': Color(0xFF10B981)},
    {'name': 'IT Support', 'icon': LucideIcons.monitor, 'category': 'Digital', 'color': Color(0xFF6366F1)},
  ];

  @override
  Widget build(BuildContext context) {
    final filteredServices = _selectedCategory == 'All'
        ? _services
        : _services.where((s) => s['category'] == _selectedCategory).toList();

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        title: Text(
          'Services',
          style: GoogleFonts.inter(
            color: foregroundColor,
            fontWeight: FontWeight.w700,
            fontSize: 24,
            letterSpacing: -0.5,
          ),
        ),
      ),
      body: Column(
        children: [
          // Category Selector
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (selected) {
                      setState(() => _selectedCategory = cat);
                    },
                    backgroundColor: Colors.white,
                    selectedColor: primaryColor.withOpacity(0.1),
                    checkmarkColor: primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                      side: BorderSide(color: isSelected ? primaryColor : borderColor),
                    ),
                    labelStyle: GoogleFonts.inter(
                      color: isSelected ? primaryColor : foregroundColor.withOpacity(0.7),
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                      fontSize: 14,
                    ),
                  ),
                );
              },
            ),
          ),

          // Service Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 1.0,
              ),
              itemCount: filteredServices.length,
              itemBuilder: (context, index) {
                final service = filteredServices[index];
                return _ServiceCard(
                  name: service['name'],
                  icon: service['icon'],
                  color: service['color'],
                  borderColor: borderColor,
                  foregroundColor: foregroundColor,
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

class _ServiceCard extends StatelessWidget {
  final String name;
  final IconData icon;
  final Color color;
  final Color borderColor;
  final Color foregroundColor;

  const _ServiceCard({
    required this.name,
    required this.icon,
    required this.color,
    required this.borderColor,
    required this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: InkWell(
        onTap: () {},
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 30),
              ),
              const SizedBox(height: 16),
              Text(
                name,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  fontSize: 15,
                  color: foregroundColor,
                  letterSpacing: -0.2,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

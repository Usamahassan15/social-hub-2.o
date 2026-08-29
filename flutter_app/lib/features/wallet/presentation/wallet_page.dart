import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({super.key});

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // HSL Colors based on Tailwind config
  final primaryColor = const HSLColor.fromAHSL(1.0, 199, 1.0, 0.5).toColor();
  final backgroundColor = const HSLColor.fromAHSL(1.0, 0, 0, 1.0).toColor();
  final foregroundColor = const HSLColor.fromAHSL(1.0, 222.2, 0.84, 0.049).toColor();
  final mutedForegroundColor = const HSLColor.fromAHSL(1.0, 215.4, 0.163, 0.469).toColor();
  final borderColor = const HSLColor.fromAHSL(1.0, 214.3, 0.318, 0.914).toColor();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showWithdrawalSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const WithdrawalBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        title: Text(
          'Wallet',
          style: GoogleFonts.inter(
            color: foregroundColor,
            fontWeight: FontWeight.w700,
            fontSize: 24,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: Icon(LucideIcons.history, color: foregroundColor),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Cards
            _BalanceSection(primaryColor: primaryColor, borderColor: borderColor, foregroundColor: foregroundColor),
            const SizedBox(height: 24),

            // Rewards Summary
            _SectionHeader(title: 'Rewards Summary', foregroundColor: foregroundColor),
            const SizedBox(height: 12),
            const _RewardsBadges(),
            const SizedBox(height: 16),
            _RewardHistoryList(borderColor: borderColor, foregroundColor: foregroundColor, mutedColor: mutedForegroundColor),
            const SizedBox(height: 24),

            // Transactions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _SectionHeader(title: 'Transactions', foregroundColor: foregroundColor),
                TextButton(
                  onPressed: () {},
                  child: Text('View All', style: TextStyle(color: primaryColor)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            _TransactionFilters(tabController: _tabController, primaryColor: primaryColor, mutedColor: mutedForegroundColor),
            const SizedBox(height: 16),
            _TransactionList(foregroundColor: foregroundColor, mutedColor: mutedForegroundColor, borderColor: borderColor),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showWithdrawalSheet,
        elevation: 0,
        label: Text(
          'Withdraw Funds',
          style: GoogleFonts.inter(fontWeight: FontWeight.w600),
        ),
        icon: const Icon(LucideIcons.arrowUpRight, size: 20),
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final Color foregroundColor;
  const _SectionHeader({required this.title, required this.foregroundColor});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: foregroundColor,
        letterSpacing: -0.4,
      ),
    );
  }
}

class _BalanceSection extends StatelessWidget {
  final Color primaryColor;
  final Color borderColor;
  final Color foregroundColor;

  const _BalanceSection({
    required this.primaryColor,
    required this.borderColor,
    required this.foregroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      clipBehavior: Clip.none,
      child: Row(
        children: [
          _BalanceCard(
            label: 'Current Balance',
            amount: 2450.50,
            color: primaryColor,
            isPrimary: true,
            foregroundColor: Colors.white,
          ),
          const SizedBox(width: 12),
          _BalanceCard(
            label: 'Available',
            amount: 1800.00,
            color: Colors.white,
            borderColor: borderColor,
            foregroundColor: foregroundColor,
          ),
          const SizedBox(width: 12),
          _BalanceCard(
            label: 'Pending',
            amount: 650.50,
            color: Colors.white,
            borderColor: borderColor,
            foregroundColor: foregroundColor,
          ),
        ],
      ),
    );
  }
}

class _BalanceCard extends StatelessWidget {
  final String label;
  final double amount;
  final Color color;
  final Color? borderColor;
  final Color foregroundColor;
  final bool isPrimary;

  const _BalanceCard({
    required this.label,
    required this.amount,
    required this.color,
    this.borderColor,
    required this.foregroundColor,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(symbol: '\$');

    return Container(
      width: 160,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16),
        border: borderColor != null ? Border.all(color: borderColor!) : null,
        boxShadow: isPrimary ? [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ] : [],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              color: isPrimary ? Colors.white.withOpacity(0.8) : foregroundColor.withOpacity(0.6),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            currencyFormat.format(amount),
            style: GoogleFonts.inter(
              color: foregroundColor,
              fontSize: 20,
              fontWeight: FontWeight.w700,
              letterSpacing: -0.5,
            ),
          ),
        ],
      ),
    );
  }
}

class _RewardsBadges extends StatelessWidget {
  const _RewardsBadges();

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          _RewardBadge(label: 'Referral', color: Color(0xFF3B82F6), icon: LucideIcons.userPlus),
          SizedBox(width: 8),
          _RewardBadge(label: 'Bonus', color: Color(0xFF8B5CF6), icon: LucideIcons.gift),
          SizedBox(width: 8),
          _RewardBadge(label: 'Cashback', color: Color(0xFF10B981), icon: LucideIcons.refreshCw),
        ],
      ),
    );
  }
}

class _RewardBadge extends StatelessWidget {
  final String label;
  final Color color;
  final IconData icon;

  const _RewardBadge({required this.label, required this.color, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.inter(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _RewardHistoryList extends StatelessWidget {
  final Color borderColor;
  final Color foregroundColor;
  final Color mutedColor;

  const _RewardHistoryList({
    required this.borderColor,
    required this.foregroundColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: 3,
        separatorBuilder: (context, index) => Divider(height: 1, color: borderColor),
        itemBuilder: (context, index) {
          final items = [
            {'title': 'Referral Bonus', 'amount': '+\$25.00', 'date': '2 days ago'},
            {'title': 'Weekly Cashback', 'amount': '+\$12.40', 'date': '5 days ago'},
            {'title': 'New User Bonus', 'amount': '+\$50.00', 'date': '1 week ago'},
          ];
          final item = items[index];
          return ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFFE0F2FE),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(LucideIcons.award, color: Color(0xFF0284C7), size: 20),
            ),
            title: Text(
              item['title']!,
              style: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14, color: foregroundColor),
            ),
            subtitle: Text(
              item['date']!,
              style: GoogleFonts.inter(fontSize: 12, color: mutedColor),
            ),
            trailing: Text(
              item['amount']!,
              style: GoogleFonts.inter(color: const Color(0xFF10B981), fontWeight: FontWeight.w700, fontSize: 15),
            ),
          );
        },
      ),
    );
  }
}

class _TransactionFilters extends StatelessWidget {
  final TabController tabController;
  final Color primaryColor;
  final Color mutedColor;

  const _TransactionFilters({
    required this.tabController,
    required this.primaryColor,
    required this.mutedColor,
  });

  @override
  Widget build(BuildContext context) {
    return TabBar(
      controller: tabController,
      isScrollable: true,
      tabAlignment: TabAlignment.start,
      dividerColor: Colors.transparent,
      indicatorColor: primaryColor,
      labelColor: primaryColor,
      unselectedLabelColor: mutedColor,
      labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w600, fontSize: 14),
      unselectedLabelStyle: GoogleFonts.inter(fontWeight: FontWeight.w500, fontSize: 14),
      tabs: const [
        Tab(text: 'All'),
        Tab(text: 'Earnings'),
        Tab(text: 'Payments'),
        Tab(text: 'Refunds'),
      ],
    );
  }
}

class _TransactionList extends StatelessWidget {
  final Color foregroundColor;
  final Color mutedColor;
  final Color borderColor;

  const _TransactionList({
    required this.foregroundColor,
    required this.mutedColor,
    required this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    final transactions = [
      {'type': 'Earnings', 'title': 'Project Payment', 'amount': '+\$450.00', 'status': 'Completed'},
      {'type': 'Payments', 'title': 'Subscription', 'amount': '-\$15.00', 'status': 'Completed'},
      {'type': 'Refunds', 'title': 'Cancelled Service', 'amount': '+\$50.00', 'status': 'Pending'},
      {'type': 'Earnings', 'title': 'Referral Reward', 'amount': '+\$25.00', 'status': 'Failed'},
      {'type': 'Payments', 'title': 'Withdrawal', 'amount': '-\$200.00', 'status': 'Completed'},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: transactions.length,
      itemBuilder: (context, index) {
        final tx = transactions[index];
        return _TransactionItem(
          title: tx['title']!,
          subtitle: tx['type']!,
          amount: tx['amount']!,
          status: tx['status']!,
          foregroundColor: foregroundColor,
          mutedColor: mutedColor,
          borderColor: borderColor,
        );
      },
    );
  }
}

class _TransactionItem extends StatelessWidget {
  final String title;
  final String subtitle;
  final String amount;
  final String status;
  final Color foregroundColor;
  final Color mutedColor;
  final Color borderColor;

  const _TransactionItem({
    required this.title,
    required this.subtitle,
    required this.amount,
    required this.status,
    required this.foregroundColor,
    required this.mutedColor,
    required this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    Color statusColor;
    switch (status) {
      case 'Completed': statusColor = const Color(0xFF10B981); break;
      case 'Pending': statusColor = const Color(0xFFF59E0B); break;
      case 'Failed': statusColor = const Color(0xFFEF4444); break;
      default: statusColor = mutedColor;
    }

    final isPositive = amount.startsWith('+');

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: (isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444)).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(
              isPositive ? LucideIcons.arrowDownLeft : LucideIcons.arrowUpRight,
              color: isPositive ? const Color(0xFF10B981) : const Color(0xFFEF4444),
              size: 18,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: foregroundColor),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(color: mutedColor, fontSize: 12),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w700,
                  color: isPositive ? const Color(0xFF10B981) : foregroundColor,
                ),
              ),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  status,
                  style: GoogleFonts.inter(color: statusColor, fontSize: 10, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class WithdrawalBottomSheet extends StatefulWidget {
  const WithdrawalBottomSheet({super.key});

  @override
  State<WithdrawalBottomSheet> createState() => _WithdrawalBottomSheetState();
}

class _WithdrawalBottomSheetState extends State<WithdrawalBottomSheet> {
  final _amountController = TextEditingController();
  String _selectedMethod = 'Bank Transfer';
  bool _isLoading = false;

  final primaryColor = const HSLColor.fromAHSL(1.0, 199, 1.0, 0.5).toColor();
  final borderColor = const HSLColor.fromAHSL(1.0, 214.3, 0.318, 0.914).toColor();

  void _handleWithdraw() async {
    if (_amountController.text.isEmpty) return;

    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 2));
    if (mounted) {
      setState(() => _isLoading = false);
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Withdrawal request submitted!'),
          backgroundColor: primaryColor,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
      ),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 20),
                decoration: BoxDecoration(
                  color: borderColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Withdraw Funds',
                  style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.x),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const SizedBox(height: 20),
            Text('Amount', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: GoogleFonts.inter(fontWeight: FontWeight.w600),
              decoration: InputDecoration(
                hintText: '0.00',
                prefixText: '\$ ',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text('Payment Method', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              value: _selectedMethod,
              style: GoogleFonts.inter(color: Colors.black87, fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
              ),
              items: ['Bank Transfer', 'PayPal', 'Crypto Wallet']
                  .map((m) => DropdownMenuItem(value: m, child: Text(m)))
                  .toList(),
              onChanged: (val) => setState(() => _selectedMethod = val!),
            ),
            const SizedBox(height: 20),
            Text('Account Details', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            TextField(
              style: GoogleFonts.inter(fontWeight: FontWeight.w500),
              decoration: InputDecoration(
                hintText: 'Enter account number or email',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: borderColor),
                ),
              ),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _handleWithdraw,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : Text(
                        'Confirm Withdrawal',
                        style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

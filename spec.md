# EarnKaro - Real Money Earning App

## Current State
New project, no existing application files.

## Requested Changes (Diff)

### Add
- User registration/login with role-based access (user, admin)
- Dashboard with wallet balance, today's earnings, total earned
- Task hub: list of tasks (install app, watch video, complete survey) with coin/rupee rewards
- Refer & Earn: unique referral code per user, ₹100 per referral, share via social
- Withdrawal flow: enter amount, select UPI/bank, request payout (Stripe payout simulation)
- Transaction history: deposits, earnings, withdrawals
- Admin panel: manage tasks, approve/reject withdrawal requests, view users
- Leaderboard: top earners

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: user profiles, wallet balance, task system, referral tracking, withdrawal requests, transaction history, admin controls
2. Frontend: mobile-first UI matching design preview (orange + teal palette), all sections: hero, task hub, wallet, refer & earn, withdrawal, leaderboard, admin panel
3. Auth: login/register with authorization component
4. Stripe: deposit flow

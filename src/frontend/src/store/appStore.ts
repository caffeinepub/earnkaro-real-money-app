import { createContext, useContext } from "react";

export interface Task {
  id: string;
  emoji: string;
  title: string;
  description: string;
  coins: number;
  rewardPaise: number;
  category: string;
  active: boolean;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit";
  description: string;
  amount: number; // paise
  timestamp: number;
  status: "completed" | "pending" | "failed";
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number; // paise
  upiId: string;
  status: "pending" | "approved" | "rejected";
  timestamp: number;
}

export interface ReferredUser {
  id: string;
  name: string;
  joinedAt: number;
  earned: number; // paise referral bonus
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  totalEarned: number; // paise
  rank: number;
}

export interface AppData {
  walletBalance: number; // paise
  todayEarnings: number; // paise
  totalEarned: number; // paise
  completedTaskIds: string[];
  transactions: Transaction[];
  withdrawalRequests: WithdrawalRequest[];
  referralCode: string;
  referredUsers: ReferredUser[];
  tasks: Task[];
}

export const DEFAULT_TASKS: Task[] = [
  {
    id: "t1",
    emoji: "📱",
    title: "Install Sponsor App",
    description: "Download and install our sponsor app & open it once",
    coins: 100,
    rewardPaise: 1000,
    category: "Install",
    active: true,
  },
  {
    id: "t2",
    emoji: "🎬",
    title: "Watch Full Video Ad",
    description: "Watch a 60-second video advertisement to completion",
    coins: 50,
    rewardPaise: 500,
    category: "Watch",
    active: true,
  },
  {
    id: "t3",
    emoji: "📋",
    title: "Complete Survey",
    description: "Fill out a 5-minute consumer survey",
    coins: 200,
    rewardPaise: 2000,
    category: "Survey",
    active: true,
  },
  {
    id: "t4",
    emoji: "📲",
    title: "Share on WhatsApp",
    description: "Share our referral link with 5 contacts",
    coins: 75,
    rewardPaise: 750,
    category: "Share",
    active: true,
  },
  {
    id: "t5",
    emoji: "🎮",
    title: "Play Mini Game",
    description: "Play our mini game and score 100 points",
    coins: 150,
    rewardPaise: 1500,
    category: "Game",
    active: true,
  },
  {
    id: "t6",
    emoji: "📰",
    title: "Read Sponsored Article",
    description: "Read a sponsored article for at least 2 minutes",
    coins: 30,
    rewardPaise: 300,
    category: "Read",
    active: true,
  },
  {
    id: "t7",
    emoji: "⭐",
    title: "Rate Our App",
    description: "Give us a 5-star review on the app store",
    coins: 250,
    rewardPaise: 2500,
    category: "Review",
    active: true,
  },
  {
    id: "t8",
    emoji: "🛒",
    title: "Shop & Earn",
    description: "Make a purchase of ₹299 or more from our partners",
    coins: 500,
    rewardPaise: 5000,
    category: "Shop",
    active: true,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "l1",
    name: "Rahul Sharma",
    avatar: "RS",
    totalEarned: 1245000,
    rank: 1,
  },
  { id: "l2", name: "Priya Patel", avatar: "PP", totalEarned: 987500, rank: 2 },
  { id: "l3", name: "Amit Kumar", avatar: "AK", totalEarned: 756000, rank: 3 },
  {
    id: "l4",
    name: "Sunita Verma",
    avatar: "SV",
    totalEarned: 645000,
    rank: 4,
  },
  { id: "l5", name: "Rohit Singh", avatar: "RS", totalEarned: 543000, rank: 5 },
  { id: "l6", name: "Kavita Nair", avatar: "KN", totalEarned: 498000, rank: 6 },
  {
    id: "l7",
    name: "Deepak Joshi",
    avatar: "DJ",
    totalEarned: 421000,
    rank: 7,
  },
  { id: "l8", name: "Meena Reddy", avatar: "MR", totalEarned: 389000, rank: 8 },
];

const STORAGE_KEY = "earn_app_data";

export function generateReferralCode(principal: string): string {
  const hash = principal
    .slice(-6)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "X");
  return `EARN${hash}`;
}

export function loadAppData(principal: string): AppData {
  const key = `${STORAGE_KEY}_${principal.slice(-8)}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      const data = JSON.parse(stored) as AppData;
      // Refresh tasks if new ones were added
      if (!data.tasks || data.tasks.length === 0) {
        data.tasks = DEFAULT_TASKS;
      }
      return data;
    } catch {
      // fall through to default
    }
  }
  return {
    walletBalance: 50000, // ₹500 welcome bonus
    todayEarnings: 0,
    totalEarned: 50000,
    completedTaskIds: [],
    transactions: [
      {
        id: "tx_welcome",
        type: "credit",
        description: "Welcome Bonus",
        amount: 50000,
        timestamp: Date.now(),
        status: "completed",
      },
    ],
    withdrawalRequests: [],
    referralCode: generateReferralCode(principal),
    referredUsers: [
      {
        id: "r1",
        name: "Vikram Mehta",
        joinedAt: Date.now() - 86400000 * 2,
        earned: 10000,
      },
      {
        id: "r2",
        name: "Sonal Gupta",
        joinedAt: Date.now() - 86400000 * 5,
        earned: 10000,
      },
    ],
    tasks: DEFAULT_TASKS,
  };
}

export function saveAppData(principal: string, data: AppData): void {
  const key = `${STORAGE_KEY}_${principal.slice(-8)}`;
  localStorage.setItem(key, JSON.stringify(data));
}

export const ADMIN_WITHDRAWAL_KEY = "earn_app_admin_withdrawals";

export function loadAdminWithdrawals(): WithdrawalRequest[] {
  const stored = localStorage.getItem(ADMIN_WITHDRAWAL_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as WithdrawalRequest[];
    } catch {
      return [];
    }
  }
  return [
    {
      id: "w1",
      userId: "user1",
      userName: "Rahul Sharma",
      amount: 50000,
      upiId: "rahul@upi",
      status: "pending",
      timestamp: Date.now() - 3600000,
    },
    {
      id: "w2",
      userId: "user2",
      userName: "Priya Patel",
      amount: 100000,
      upiId: "priya@paytm",
      status: "pending",
      timestamp: Date.now() - 7200000,
    },
    {
      id: "w3",
      userId: "user3",
      userName: "Amit Kumar",
      amount: 75000,
      upiId: "amit@gpay",
      status: "approved",
      timestamp: Date.now() - 86400000,
    },
  ];
}

export function saveAdminWithdrawals(requests: WithdrawalRequest[]): void {
  localStorage.setItem(ADMIN_WITHDRAWAL_KEY, JSON.stringify(requests));
}

export function formatRupees(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export interface AppContextValue {
  appData: AppData;
  updateAppData: (updater: (prev: AppData) => AppData) => void;
  adminWithdrawals: WithdrawalRequest[];
  updateAdminWithdrawals: (requests: WithdrawalRequest[]) => void;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppStore(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}

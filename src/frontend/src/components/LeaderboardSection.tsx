import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { MOCK_LEADERBOARD, formatRupees } from "../store/appStore";
import { useAppStore } from "../store/appStore";

export function LeaderboardSection() {
  const { identity } = useInternetIdentity();
  const { appData } = useAppStore();
  const isLoggedIn = !!identity;

  const rankColors = [
    "bg-yellow-400 text-yellow-900",
    "bg-gray-300 text-gray-700",
    "bg-amber-600 text-amber-100",
  ];

  return (
    <section
      className="py-8 px-4 max-w-6xl mx-auto"
      data-ocid="leaderboard.section"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">
          TOP EARNERS
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          This month's leaderboard
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="flex items-end justify-center gap-4 mb-8">
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map(
          (entry, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <motion.div
                key={entry.id}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                  <AvatarFallback
                    className={`text-sm font-bold ${rankColors[actualRank - 1] || "bg-muted"}`}
                  >
                    {entry.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <div className="text-xs font-semibold text-foreground truncate max-w-[80px]">
                    {entry.name.split(" ")[0]}
                  </div>
                  <div className="text-xs text-secondary font-bold">
                    {formatRupees(entry.totalEarned)}
                  </div>
                </div>
                <div
                  className={`w-16 ${heights[i]} rounded-t-lg gradient-hero flex items-start justify-center pt-1 text-white font-bold text-sm`}
                >
                  #{actualRank}
                </div>
              </motion.div>
            );
          },
        )}
      </div>

      {/* Full List */}
      <div
        className="bg-card rounded-xl card-shadow border border-border overflow-hidden"
        data-ocid="leaderboard.table"
      >
        {MOCK_LEADERBOARD.map((entry, i) => (
          <motion.div
            key={entry.id}
            className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            data-ocid={`leaderboard.item.${i + 1}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < 3 ? rankColors[i] : "bg-muted text-muted-foreground"
              }`}
            >
              {i === 0 ? <Trophy className="w-3.5 h-3.5" /> : `#${i + 1}`}
            </div>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-secondary text-white text-xs font-bold">
                {entry.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">
                {entry.name}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-secondary">
                {formatRupees(entry.totalEarned)}
              </div>
              <div className="text-xs text-muted-foreground">this month</div>
            </div>
          </motion.div>
        ))}

        {/* Current user row */}
        {isLoggedIn && (
          <div className="flex items-center gap-3 px-4 py-3 bg-accent/30 border-t-2 border-primary/20">
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
              You
            </div>
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-primary text-white text-xs font-bold">
                ME
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground">You</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-primary">
                {formatRupees(appData.totalEarned)}
              </div>
              <div className="text-xs text-muted-foreground">your earnings</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

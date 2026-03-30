import { Button } from "@/components/ui/button";
import { CheckCircle, Lock } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatRupees, useAppStore } from "../store/appStore";

interface TasksSectionProps {
  onLoginRequired: () => void;
}

export function TasksSection({ onLoginRequired }: TasksSectionProps) {
  const { identity } = useInternetIdentity();
  const { appData, updateAppData } = useAppStore();
  const isLoggedIn = !!identity;

  const handleCompleteTask = (taskId: string) => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    const task = appData.tasks.find((t) => t.id === taskId);
    if (!task) return;

    updateAppData((prev) => {
      const newTx = {
        id: `tx_${Date.now()}`,
        type: "credit" as const,
        description: `Task: ${task.title}`,
        amount: task.rewardPaise,
        timestamp: Date.now(),
        status: "completed" as const,
      };
      return {
        ...prev,
        walletBalance: prev.walletBalance + task.rewardPaise,
        todayEarnings: prev.todayEarnings + task.rewardPaise,
        totalEarned: prev.totalEarned + task.rewardPaise,
        completedTaskIds: [...prev.completedTaskIds, taskId],
        transactions: [newTx, ...prev.transactions],
      };
    });

    toast.success(
      `🎉 Task completed! You earned ${formatRupees(task.rewardPaise)}`,
      {
        description: `${task.coins} coins added to your wallet`,
      },
    );
  };

  const activeTasks = appData.tasks.filter((t) => t.active);
  const completedCount = appData.completedTaskIds.filter((id) =>
    activeTasks.some((t) => t.id === id),
  ).length;

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto" data-ocid="tasks.section">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider text-foreground">
          EARNING HUB
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Complete tasks to earn real money • {completedCount}/
          {activeTasks.length} completed today
        </p>
      </div>

      {/* Progress bar */}
      {isLoggedIn && (
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Daily Progress</span>
            <span>
              {completedCount} of {activeTasks.length} tasks
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-hero rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / activeTasks.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {activeTasks.map((task, index) => {
          const isCompleted = appData.completedTaskIds.includes(task.id);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              data-ocid={`tasks.item.${index + 1}`}
              className={`bg-card rounded-xl p-4 card-shadow border border-border relative overflow-hidden ${
                isCompleted ? "opacity-75" : ""
              }`}
            >
              {isCompleted && (
                <div className="absolute inset-0 bg-card/80 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <CheckCircle className="w-8 h-8 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">
                      Completed!
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{task.emoji}</div>
                <span className="text-xs font-semibold bg-accent text-primary px-2 py-0.5 rounded-full">
                  #{index + 1}
                </span>
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-1">
                {task.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xs">🪙</span>
                  <span className="text-xs font-semibold text-foreground">
                    {task.coins} coins
                  </span>
                </div>
                <span className="text-sm font-bold text-secondary">
                  {formatRupees(task.rewardPaise)}
                </span>
              </div>
              <Button
                size="sm"
                className="w-full text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={() => handleCompleteTask(task.id)}
                disabled={isCompleted}
                data-ocid={`tasks.item.${index + 1}.button`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" /> Done
                  </>
                ) : !isLoggedIn ? (
                  <>
                    <Lock className="w-3 h-3 mr-1" /> Login to Earn
                  </>
                ) : (
                  "Start Task"
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

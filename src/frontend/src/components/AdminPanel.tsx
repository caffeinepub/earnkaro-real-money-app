import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Plus,
  ToggleLeft,
  ToggleRight,
  Trash2,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Task, formatRupees, useAppStore } from "../store/appStore";

export function AdminPanel() {
  const { appData, updateAppData, adminWithdrawals, updateAdminWithdrawals } =
    useAppStore();
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    emoji: "📱",
    title: "",
    description: "",
    coins: "",
    rewardRupees: "",
    category: "",
  });

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.coins || !newTask.rewardRupees) {
      toast.error("Please fill all required fields");
      return;
    }
    const task: Task = {
      id: `t_${Date.now()}`,
      emoji: newTask.emoji || "📋",
      title: newTask.title.trim(),
      description:
        newTask.description.trim() || "Complete this task to earn rewards",
      coins: Number.parseInt(newTask.coins),
      rewardPaise: Math.floor(Number.parseFloat(newTask.rewardRupees) * 100),
      category: newTask.category || "Other",
      active: true,
    };
    updateAppData((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    toast.success(`Task "${task.title}" added!`);
    setShowAddTask(false);
    setNewTask({
      emoji: "📱",
      title: "",
      description: "",
      coins: "",
      rewardRupees: "",
      category: "",
    });
  };

  const handleToggleTask = (taskId: string) => {
    updateAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, active: !t.active } : t,
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    updateAppData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    toast.success("Task deleted");
  };

  const handleWithdrawalAction = (
    requestId: string,
    action: "approved" | "rejected",
  ) => {
    const updated = adminWithdrawals.map((r) =>
      r.id === requestId ? { ...r, status: action } : r,
    );
    updateAdminWithdrawals(updated);
    toast.success(`Withdrawal ${action}!`);
  };

  const pendingCount = adminWithdrawals.filter(
    (r) => r.status === "pending",
  ).length;

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto" data-ocid="admin.section">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">
          ADMIN PANEL
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage tasks and withdrawal requests
        </p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tasks" data-ocid="admin.tasks.tab">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="withdrawals" data-ocid="admin.withdrawals.tab">
            Withdrawals
            {pendingCount > 0 && (
              <Badge className="ml-1.5 bg-destructive text-white text-[10px] h-4 px-1">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users" data-ocid="admin.users.tab">
            Users
          </TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">
              All Tasks ({appData.tasks.length})
            </h3>
            <Button
              size="sm"
              onClick={() => setShowAddTask(true)}
              className="bg-primary text-white hover:bg-primary/90"
              data-ocid="admin.tasks.add.button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </div>

          <div className="space-y-2" data-ocid="admin.tasks.list">
            {appData.tasks.map((task, i) => (
              <motion.div
                key={task.id}
                className="bg-card rounded-xl p-4 card-shadow border border-border flex items-center gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                data-ocid={`admin.tasks.item.${i + 1}`}
              >
                <span className="text-2xl">{task.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground truncate">
                    {task.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {task.coins} coins • {formatRupees(task.rewardPaise)}
                  </div>
                </div>
                <Badge
                  variant={task.active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {task.active ? "Active" : "Inactive"}
                </Badge>
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid={`admin.tasks.toggle.${i + 1}`}
                >
                  {task.active ? (
                    <ToggleRight className="w-5 h-5 text-secondary" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-muted-foreground hover:text-destructive"
                  data-ocid={`admin.tasks.delete.${i + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals">
          <div className="space-y-3" data-ocid="admin.withdrawals.list">
            {adminWithdrawals.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="admin.withdrawals.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No withdrawal requests
                </p>
              </div>
            ) : (
              adminWithdrawals.map((req, i) => (
                <motion.div
                  key={req.id}
                  className="bg-card rounded-xl p-4 card-shadow border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`admin.withdrawals.item.${i + 1}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm text-foreground">
                        {req.userName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {req.upiId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(req.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">
                        {formatRupees(req.amount)}
                      </div>
                      <Badge
                        variant={
                          req.status === "approved"
                            ? "default"
                            : req.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {req.status}
                      </Badge>
                    </div>
                  </div>
                  {req.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleWithdrawalAction(req.id, "approved")
                        }
                        className="flex-1 bg-secondary text-white hover:bg-secondary/90 text-xs"
                        data-ocid={`admin.withdrawals.approve.${i + 1}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleWithdrawalAction(req.id, "rejected")
                        }
                        className="flex-1 text-xs"
                        data-ocid={`admin.withdrawals.reject.${i + 1}`}
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <div
            className="bg-card rounded-xl card-shadow border border-border overflow-hidden"
            data-ocid="admin.users.table"
          >
            {[
              {
                name: "Rahul Sharma",
                principal: "rdmx6-jaaaa...",
                role: "user",
                earned: "₹12,450",
              },
              {
                name: "Priya Patel",
                principal: "renrk-eyaaa...",
                role: "user",
                earned: "₹9,875",
              },
              {
                name: "Admin User",
                principal: "rrkah-fqaaa...",
                role: "admin",
                earned: "₹0",
              },
            ].map((user, i) => (
              <div
                key={user.principal}
                className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0"
                data-ocid={`admin.users.item.${i + 1}`}
              >
                <div>
                  <div className="font-semibold text-sm text-foreground">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {user.principal}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-secondary">
                    {user.earned}
                  </span>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Dialog */}
      <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
        <DialogContent data-ocid="admin.tasks.add.modal">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Emoji</Label>
                <Input
                  value={newTask.emoji}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, emoji: e.target.value }))
                  }
                  placeholder="📱"
                  className="mt-1"
                  data-ocid="admin.tasks.add.emoji.input"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="e.g. Install"
                  className="mt-1"
                  data-ocid="admin.tasks.add.category.input"
                />
              </div>
            </div>
            <div>
              <Label>Task Title *</Label>
              <Input
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Task title"
                className="mt-1"
                data-ocid="admin.tasks.add.title.input"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Short description"
                className="mt-1"
                data-ocid="admin.tasks.add.description.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Coins *</Label>
                <Input
                  type="number"
                  value={newTask.coins}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, coins: e.target.value }))
                  }
                  placeholder="100"
                  className="mt-1"
                  data-ocid="admin.tasks.add.coins.input"
                />
              </div>
              <div>
                <Label>Reward (₹) *</Label>
                <Input
                  type="number"
                  value={newTask.rewardRupees}
                  onChange={(e) =>
                    setNewTask((p) => ({ ...p, rewardRupees: e.target.value }))
                  }
                  placeholder="10.00"
                  className="mt-1"
                  data-ocid="admin.tasks.add.reward.input"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTask(false)}
              data-ocid="admin.tasks.add.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              className="bg-primary text-white hover:bg-primary/90"
              data-ocid="admin.tasks.add.submit.button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onStartEarning: () => void;
  onViewTasks: () => void;
  isLoggedIn: boolean;
  onLogin: () => void;
}

export function HeroSection({
  onStartEarning,
  onViewTasks,
  isLoggedIn,
  onLogin,
}: HeroSectionProps) {
  return (
    <section className="gradient-hero text-white overflow-hidden relative">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm mb-4">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>RBI Compliant Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 uppercase tracking-tight">
              EARN REAL
              <br />
              <span className="text-yellow-300">MONEY DAILY!</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg mb-8 max-w-md">
              Complete tasks, refer friends, and withdraw instantly to your UPI.
              Over ₹50 Lakh paid out!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={isLoggedIn ? onStartEarning : onLogin}
                className="bg-primary text-white hover:bg-primary/90 font-bold text-base rounded-full px-8 shadow-lg"
                data-ocid="hero.primary_button"
              >
                START EARNING <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onViewTasks}
                className="border-white/40 text-white hover:bg-white/10 bg-transparent font-semibold text-base rounded-full px-8"
                data-ocid="hero.secondary_button"
              >
                View Tasks
              </Button>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6 mt-10 justify-center md:justify-start">
              {[
                { label: "Active Users", value: "2.4L+" },
                { label: "Paid Out", value: "₹50L+" },
                { label: "Avg. Daily", value: "₹250" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-white/70 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Coins Illustration */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 flex items-center justify-center">
              <motion.div
                className="absolute text-7xl"
                animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                💰
              </motion.div>
              <motion.div
                className="absolute top-4 right-8 text-4xl"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                🪙
              </motion.div>
              <motion.div
                className="absolute bottom-8 left-4 text-3xl"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                💳
              </motion.div>
              <motion.div
                className="absolute top-12 left-2 text-2xl"
                animate={{ y: [0, -5, 0], rotate: [0, -8, 0] }}
                transition={{
                  duration: 2.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1.5,
                }}
              >
                📱
              </motion.div>
              {/* Background glow */}
              <div className="absolute inset-0 rounded-full bg-white/10 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 bg-background"
        style={{ borderRadius: "100% 100% 0 0" }}
      />
    </section>
  );
}

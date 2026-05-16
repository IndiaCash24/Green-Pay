import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Bell,
  Search,
  CheckCircle,
  Info,
  XCircle,
} from "lucide-react";
import { useAppContext, Notification } from "../context/AppContext";

export default function Notifications({ onBack }: { onBack: () => void }) {
  const { notifications, markAsRead } = useAppContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full w-full flex-col bg-[#f9fafb] pb-[100px] min-h-screen relative"
    >
      <div className="bg-[#0b8a40] px-5 pt-12 pb-[60px] rounded-bl-[40px] rounded-br-[40px] relative shadow-sm">
        <div className="flex items-center relative z-10 text-white">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 transition cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="ml-2">
            <h1 className="text-[22px] font-bold tracking-tight">
              Notifications
            </h1>
            <p className="text-[13px] text-green-100 font-medium">
              Your latest updates and alerts
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 -mt-8 z-10 relative space-y-4">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center pt-24 text-center bg-white rounded-[24px] p-8 shadow-[0_20px_40px_rgb(0,0,0,0.06)] border border-gray-100 min-h-[300px]"
          >
            <div className="bg-gray-50 border-4 border-white shadow-sm p-5 rounded-full mb-5">
              <Bell size={40} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-bold text-gray-900">All caught up!</p>
            <p className="text-[13px] font-medium text-gray-500 mt-1 max-w-[200px]">
              You don't have any new notifications at the moment.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {notifications.map((n, i) => {
              const isApproved = n.title.toLowerCase().includes("approve");
              const isRejected = n.title.toLowerCase().includes("reject");

              let Icon = Bell;
              let iconColor = "text-gray-400";
              let iconBg = "bg-gray-100";

              if (isApproved) {
                Icon = CheckCircle;
                iconColor = "text-green-600";
                iconBg = "bg-green-100";
              } else if (isRejected) {
                Icon = XCircle;
                iconColor = "text-red-500";
                iconBg = "bg-red-100";
              } else if (!n.read) {
                Icon = Info;
                iconColor = "text-blue-500";
                iconBg = "bg-blue-100";
              }

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => markAsRead(n.id)}
                  className={`rounded-[20px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 transition-all cursor-pointer flex items-start space-x-4 relative overflow-hidden group ${
                    n.read
                      ? "bg-white ring-gray-100 opacity-70 hover:opacity-100"
                      : "bg-white ring-green-100 hover:ring-green-200 hover:shadow-[0_8px_30px_rgb(11,138,64,0.08)]"
                  }`}
                >
                  {!n.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0b8a40]"></div>
                  )}

                  <div
                    className={`mt-0.5 flex-shrink-0 rounded-full p-2.5 ${iconBg} ${iconColor} relative z-10`}
                  >
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-1.5">
                      <h3
                        className={`text-[15px] ${n.read ? "text-gray-700 font-semibold" : "text-gray-900 font-bold"}`}
                      >
                        {n.title}
                      </h3>
                      <span className="text-[11px] font-bold text-gray-400 whitespace-nowrap ml-2 mt-1">
                        {new Date(n.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <p
                      className={`text-[13px] leading-relaxed ${n.read ? "text-gray-500 font-medium" : "text-gray-600 font-medium"}`}
                    >
                      {n.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}

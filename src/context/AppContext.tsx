import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser, signInAnonymously } from "firebase/auth";
import { collection, doc, onSnapshot, query, where, addDoc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  utr: string;
  loanId: string;
  emiIds: string[];
  date: string;
  status: "pending" | "approved" | "rejected";
}

export interface EMIInstallment {
  id: string;
  month: number;
  dueDate: string;
  amount: number;
  status: "pending" | "paid";
}

export interface LoanRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  durationMonths: number;
  date: string;
  status: "pending" | "approved" | "rejected";
  processingFee: number;
  gst: number;
  netDisbursal: number;
  emi: number;
  totalRepayable: number;
  schedule?: EMIInstallment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  maxLoanLimit?: number;
}

export interface PaymentHistoryItem {
  id: string;
  userId: string;
  amount: number;
  date: string;
  utr: string;
  loanId: string;
  emiIds: string[];
}

export interface AppSettings {
  qrImageUrl: string;
}

interface AppContextType {
  currentUser: User;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  sendNotificationToUser: (userId: string, notification: Omit<Notification, "id" | "userId">) => void;
  markAsRead: (id: string) => void;
  unreadCount: number;

  paymentRequests: PaymentRequest[];
  approvePayment: (id: string, req: PaymentRequest) => Promise<void>;
  rejectPayment: (id: string, req: PaymentRequest) => Promise<void>;
  submitPaymentRequest: (req: Omit<PaymentRequest, "id" | "status">) => Promise<void>;

  loanRequests: LoanRequest[];
  userLoan: LoanRequest | undefined;
  applyLoan: (
    amount: number,
    durationMonths: number,
    processingFee: number,
    gst: number,
    netDisbursal: number,
    emi: number,
    totalRepayable: number,
  ) => void;
  approveLoan: (id: string) => void;
  rejectLoan: (id: string) => void;
  payEMIs: (loanId: string, emiIds: string[]) => void;
  updateLoan: (loanId: string, data: Partial<LoanRequest>) => void;
  updateLoanSchedule: (loanId: string, schedule: EMIInstallment[]) => void;

  paymentHistory: PaymentHistoryItem[];
  addPaymentHistory: (item: Omit<PaymentHistoryItem, "id">) => void;

  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => void;

  users: User[];
  updateUserLimit: (userId: string, limit: number) => void;

  totalUsers: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: "anonymous",
    name: "User",
    email: "user@example.com",
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    qrImageUrl: ""
  });

  useEffect(() => {
    let unsubUserDoc: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || "User",
          email: user.email || "user@example.com",
        });
        if (unsubUserDoc) unsubUserDoc();
        unsubUserDoc = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
          if (docSnap.exists()) {
             const data = docSnap.data();
             setCurrentUser(prev => ({ 
                ...prev, 
                name: data.name || prev.name,
                maxLoanLimit: data.maxLoanLimit 
             }));
          }
        }, (err) => console.error("Error fetching user data:", err));
      } else {
        setCurrentUser({
          id: "anonymous",
          name: "User",
          email: "user@example.com",
        });
        if (unsubUserDoc) unsubUserDoc();
      }
    });
    return () => {
      unsubAuth();
      if (unsubUserDoc) unsubUserDoc();
    };
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!currentUser.id || currentUser.id === "anonymous") return;

    const lgErr = (err: any) => console.error("Firestore error:", err);

    const unsubNotes = onSnapshot(query(collection(db, "notifications"), where("userId", "==", currentUser.id)), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
      setNotifications(data.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }, lgErr);

    // Load from Firestore
    const unsubLoans = onSnapshot(collection(db, "loans"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as LoanRequest));
      setLoanRequests(data);
    }, lgErr);

    const unsubPayments = onSnapshot(collection(db, "payment_history"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentHistoryItem));
      setPaymentHistory(data);
    }, lgErr);

    const unsubPaymentRequests = onSnapshot(collection(db, "payment_requests"), (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentRequest));
      setPaymentRequests(data);
    }, lgErr);

    const unsubSettings = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
      if (docSnap.exists()) {
        setAppSettings(docSnap.data() as AppSettings);
      }
    }, lgErr);

    let unsubUsers = () => {};
    if (currentUser.email === 'surendrabusiness02@gmail.com') {
      unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const data: User[] = [];
        snapshot.forEach(doc => data.push(doc.data() as User));
        setUsers(data);
      }, lgErr);
    }

    // Dummy notifications removed
    setNotifications([]);

    return () => {
      unsubLoans();
      unsubPayments();
      unsubPaymentRequests();
      unsubSettings();
      unsubUsers();
    };
  }, [currentUser.id]);

  const sendNotificationToUser = async (userId: string, notification: Omit<Notification, "id" | "userId">) => {
    try {
      await addDoc(collection(db, "notifications"), {
        ...notification,
        userId
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addNotification = async (notification: Omit<Notification, "id">) => {
    if (currentUser.id === "anonymous") return;
    try {
      await addDoc(collection(db, "notifications"), {
        ...notification,
        userId: currentUser.id
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (e) {
      console.error(e);
    }
  };

  const submitPaymentRequest = async (req: Omit<PaymentRequest, "id" | "status">) => {
    try {
      await addDoc(collection(db, "payment_requests"), { ...req, status: "pending", date: new Date().toISOString() });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const approvePayment = async (id: string, req: PaymentRequest) => {
    try {
      await updateDoc(doc(db, "payment_requests", id), { status: "approved" });
      await payEMIs(req.loanId, req.emiIds);
      await addPaymentHistory({
        userId: req.userId,
        amount: req.amount,
        date: new Date().toISOString(),
        utr: req.utr,
        loanId: req.loanId,
        emiIds: req.emiIds
      });
      // Add a notification for the user
      await addDoc(collection(db, "notifications"), {
        userId: req.userId,
        title: "Payment Approved!",
        message: `Your payment of ₹${req.amount} (UTR: ${req.utr}) has been approved.`,
        date: new Date().toISOString(),
        read: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  const rejectPayment = async (id: string, req: PaymentRequest) => {
    try {
      await updateDoc(doc(db, "payment_requests", id), { status: "rejected" });
      // Add a notification for the user
      await addDoc(collection(db, "notifications"), {
        userId: req.userId,
        title: "Payment Rejected",
        message: `Your payment of ₹${req.amount} (UTR: ${req.utr}) was rejected. Please re-verify.`,
        date: new Date().toISOString(),
        read: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  const applyLoan = async (
    amount: number,
    durationMonths: number,
    processingFee: number,
    gst: number,
    netDisbursal: number,
    emi: number,
    totalRepayable: number
  ) => {
    const schedule = Array.from({ length: durationMonths }).map((_, i) => {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      dueDate.setDate(5); // 5th of every month
      return {
        id: `emi-${i + 1}-${Date.now()}`,
        month: i + 1,
        dueDate: dueDate.toISOString(),
        amount: emi,
        status: "pending",
      };
    });

    const newRequest = {
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      durationMonths,
      date: new Date().toISOString(),
      status: "pending",
      processingFee,
      gst,
      netDisbursal,
      emi,
      totalRepayable,
      schedule,
    };
    
    try {
      await addDoc(collection(db, "loans"), newRequest);
      addNotification({
        title: "Loan Application Submitted",
        message: `Your loan application for ₹${amount} has been successfully submitted and is under review.`,
        date: new Date().toISOString(),
        read: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const approveLoan = async (id: string) => {
    try {
      await updateDoc(doc(db, "loans", id), { status: "approved" });
      const req = loanRequests.find((l) => l.id === id);
      if (req && req.userId === currentUser.id) {
        addNotification({
          title: "Loan Approved!",
          message: `Your loan request for ₹${req.amount} has been approved.`,
          date: new Date().toISOString(),
          read: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const rejectLoan = async (id: string) => {
    try {
      await updateDoc(doc(db, "loans", id), { status: "rejected" });
      const req = loanRequests.find((l) => l.id === id);
      if (req && req.userId === currentUser.id) {
        addNotification({
          title: "Loan Rejected",
          message: `Your loan request for ₹${req.amount} was rejected. Please contact support for more details.`,
          date: new Date().toISOString(),
          read: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const payEMIs = async (loanId: string, emiIds: string[]) => {
    const loan = loanRequests.find(l => l.id === loanId);
    if (!loan || !loan.schedule) return;

    const updatedSchedule = loan.schedule.map((emi) => {
      if (emiIds.includes(emi.id)) {
        return { ...emi, status: "paid" as const };
      }
      return emi;
    });

    try {
      await updateDoc(doc(db, "loans", loanId), { schedule: updatedSchedule });
      addNotification({
        title: "EMI Payment Successful",
        message: `Successfully paid ${emiIds.length} EMI installment(s).`,
        date: new Date().toISOString(),
        read: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateLoan = async (loanId: string, data: Partial<LoanRequest>) => {
    try {
      await updateDoc(doc(db, "loans", loanId), data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateLoanSchedule = async (loanId: string, schedule: EMIInstallment[]) => {
    try {
      await updateDoc(doc(db, "loans", loanId), { schedule });
    } catch (error) {
      console.error(error);
    }
  };

  const addPaymentHistory = async (item: Omit<PaymentHistoryItem, "id">) => {
    try {
      await addDoc(collection(db, "payment_history"), item);
    } catch (error) {
      console.error(error);
    }
  };

  const updateAppSettings = async (settings: Partial<AppSettings>) => {
    try {
      await setDoc(doc(db, "settings", "global"), settings, { merge: true });
    } catch (error) {
      console.error(error);
    }
  };

  const updateUserLimit = async (userId: string, limit: number) => {
    try {
      await updateDoc(doc(db, "users", userId), { maxLoanLimit: limit });
    } catch (error) {
      console.error(error);
    }
  };

  const userLoans = loanRequests.filter((l) => l.userId === currentUser.id);
  const activeUserLoan = userLoans.find(l => l.status === "pending" || (l.status === "approved" && l.schedule?.some(emi => emi.status === "pending")));
  const userLoan = activeUserLoan || userLoans[userLoans.length - 1]; // To fallback to the latest rejected/paid loan

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        notifications,
        addNotification,
        sendNotificationToUser,
        markAsRead,
        unreadCount,
        paymentRequests,
        approvePayment,
        rejectPayment,
        submitPaymentRequest,
        loanRequests,
        userLoan,
        applyLoan,
        approveLoan,
        rejectLoan,
        updateLoan,
        payEMIs,
        updateLoanSchedule,
        paymentHistory,
        addPaymentHistory,
        appSettings,
        updateAppSettings,
        users,
        updateUserLimit,
        totalUsers: users.length,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

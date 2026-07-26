import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { storage } from '@/lib/storage';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  type: 'social' | 'game' | 'referral';
  link?: string;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'withdraw' | 'reward' | 'upgrade';
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'rejected';
}

export interface GameState {
  points: number;
  energy: number;
  maxEnergy: number;
  pointsPerTap: number;
  multiTapLevel: number;
  energyCapLevel: number;
  rechargeLevel: number;
  totalTaps: number;
  lifetimePoints: number;
  tasksCompleted: number;
  friendsInvited: number;
  maxTps: number;
  username: string;
  tasks: Task[];
  transactions: Transaction[];
}

// ─── Upgrade Configs ─────────────────────────────────────────────────────────

export const MULTI_TAP_UPGRADES = [
  { cost: 0, value: 1, label: 'Level 1', description: '1 poin per ketuk' },
  { cost: 500, value: 2, label: 'Level 2', description: '2 poin per ketuk' },
  { cost: 2000, value: 4, label: 'Level 3', description: '4 poin per ketuk' },
  { cost: 5000, value: 6, label: 'Level 4', description: '6 poin per ketuk' },
  { cost: 15000, value: 10, label: 'Level 5 (MAX)', description: '10 poin per ketuk' },
];

export const ENERGY_CAP_UPGRADES = [
  { cost: 0, value: 500, label: 'Level 1', description: 'Kapasitas 500' },
  { cost: 1000, value: 1000, label: 'Level 2', description: 'Kapasitas 1.000' },
  { cost: 3000, value: 2000, label: 'Level 3', description: 'Kapasitas 2.000' },
  { cost: 8000, value: 3500, label: 'Level 4', description: 'Kapasitas 3.500' },
  { cost: 20000, value: 5000, label: 'Level 5 (MAX)', description: 'Kapasitas 5.000' },
];

export const RECHARGE_UPGRADES = [
  { cost: 0, value: 1, label: 'Level 1', description: '1 energi/detik' },
  { cost: 800, value: 2, label: 'Level 2', description: '2 energi/detik' },
  { cost: 2500, value: 4, label: 'Level 3', description: '4 energi/detik' },
  { cost: 7000, value: 6, label: 'Level 4', description: '6 energi/detik' },
  { cost: 18000, value: 10, label: 'Level 5 (MAX)', description: '10 energi/detik' },
];

export const VIP_PACKAGES = [
  { id: 'vip1', name: 'VIP 1', priceRupiah: 50000, points: 5000 },
  { id: 'vip2', name: 'VIP 2', priceRupiah: 85000, points: 7500 },
  { id: 'vip3', name: 'VIP 3', priceRupiah: 150000, points: 15000 },
];

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Ikuti Telegram',
    description: 'Bergabung channel Telegram resmi AltoTap',
    reward: 5000,
    completed: false,
    type: 'social',
    link: 'https://t.me/altotap',
  },
  {
    id: 't2',
    title: 'Ikuti Instagram',
    description: 'Follow akun Instagram @altotap untuk info terbaru',
    reward: 3000,
    completed: false,
    type: 'social',
    link: 'https://instagram.com',
  },
  {
    id: 't3',
    title: 'Ikuti Twitter/X',
    description: 'Follow Twitter/X @altotap dan dapatkan reward',
    reward: 2000,
    completed: false,
    type: 'social',
    link: 'https://twitter.com',
  },
  {
    id: 't4',
    title: 'Undang 1 Teman',
    description: 'Ajak teman pertamamu bergabung dengan link referral',
    reward: 5000,
    completed: false,
    type: 'referral',
  },
  {
    id: 't5',
    title: 'Ketuk 100 Kali',
    description: 'Lakukan 100 ketukan di halaman utama',
    reward: 1000,
    completed: false,
    type: 'game',
  },
  {
    id: 't6',
    title: 'Kumpulkan 10.000 Poin',
    description: 'Raih total 10.000 poin dari ketukan',
    reward: 2000,
    completed: false,
    type: 'game',
  },
  {
    id: 't7',
    title: 'Beli Upgrade Pertama',
    description: 'Tingkatkan kemampuan ketukmu di halaman Peningkatan',
    reward: 2000,
    completed: false,
    type: 'game',
  },
];

const DEFAULT_STATE: GameState = {
  points: 0,
  energy: 500,
  maxEnergy: 500,
  pointsPerTap: 1,
  multiTapLevel: 0,
  energyCapLevel: 0,
  rechargeLevel: 0,
  totalTaps: 0,
  lifetimePoints: 0,
  tasksCompleted: 0,
  friendsInvited: 0,
  maxTps: 0,
  username: 'Pengguna',
  tasks: DEFAULT_TASKS,
  transactions: [],
};

const STORAGE_KEY = '@altotap_v1';

// ─── Context ──────────────────────────────────────────────────────────────────

interface GameContextType {
  gameState: GameState;
  isLoaded: boolean;
  tap: () => { success: boolean; pointsEarned: number };
  buyUpgrade: (
    type: 'multiTap' | 'energyCap' | 'recharge'
  ) => { success: boolean; message: string };
  completeTask: (taskId: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => void;
  updateUsername: (name: string) => void;
  refillEnergy: () => void;
  addBonusPoints: (amount: number, description: string) => void;
}

export const GameContext = createContext<GameContextType>({
  gameState: DEFAULT_STATE,
  isLoaded: false,
  tap: () => ({ success: false, pointsEarned: 0 }),
  buyUpgrade: () => ({ success: false, message: '' }),
  completeTask: () => {},
  addTransaction: () => {},
  updateUsername: () => {},
  refillEnergy: () => {},
  addBonusPoints: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<GameState>;
          const merged: GameState = {
            ...DEFAULT_STATE,
            ...parsed,
            // Merge task completions with latest default list
            tasks: DEFAULT_TASKS.map(dt => {
              const saved = (parsed.tasks ?? []).find(t => t.id === dt.id);
              return saved ? { ...dt, completed: saved.completed } : dt;
            }),
          };
          setGameState(merged);
        }
      } catch {
        // Use defaults
      }
      setIsLoaded(true);
    })();
  }, []);

  // Energy recharge every second
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.energy >= prev.maxEnergy) return prev;
        const rate = RECHARGE_UPGRADES[prev.rechargeLevel]?.value ?? 1;
        return { ...prev, energy: Math.min(prev.energy + rate, prev.maxEnergy) };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const persist = useCallback((state: GameState) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      storage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 400);
  }, []);

  // Tap – returns result synchronously via mutable ref inside updater
  const tap = useCallback((): { success: boolean; pointsEarned: number } => {
    let result = { success: false, pointsEarned: 0 };

    setGameState(prev => {
      if (prev.energy <= 0) return prev;
      const pointsEarned = prev.pointsPerTap;
      result = { success: true, pointsEarned };
      const next: GameState = {
        ...prev,
        points: prev.points + pointsEarned,
        energy: Math.max(0, prev.energy - 1),
        totalTaps: prev.totalTaps + 1,
        lifetimePoints: prev.lifetimePoints + pointsEarned,
      };
      persist(next);
      return next;
    });

    return result;
  }, [persist]);

  const buyUpgrade = useCallback(
    (type: 'multiTap' | 'energyCap' | 'recharge'): { success: boolean; message: string } => {
      let outcome = { success: false, message: '' };

      setGameState(prev => {
        const genTx = (desc: string, cost: number): Transaction => ({
          id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
          type: 'upgrade',
          amount: -cost,
          description: desc,
          date: new Date().toISOString(),
          status: 'completed',
        });

        const unlockT7 = (tasks: Task[]) =>
          tasks.map(t => (t.id === 't7' ? { ...t, completed: true } : t));

        if (type === 'multiTap') {
          const next = prev.multiTapLevel + 1;
          if (next >= MULTI_TAP_UPGRADES.length) {
            outcome = { success: false, message: 'Sudah level maksimal' };
            return prev;
          }
          const cfg = MULTI_TAP_UPGRADES[next];
          if (prev.points < cfg.cost) {
            outcome = { success: false, message: 'Poin tidak cukup' };
            return prev;
          }
          outcome = { success: true, message: `Multi-tap ditingkatkan ke ${cfg.label}!` };
          const updated: GameState = {
            ...prev,
            points: prev.points - cfg.cost,
            multiTapLevel: next,
            pointsPerTap: cfg.value,
            tasks: unlockT7(prev.tasks),
            transactions: [genTx(`Upgrade Multi-tap ${cfg.label}`, cfg.cost), ...prev.transactions],
          };
          persist(updated);
          return updated;
        }

        if (type === 'energyCap') {
          const next = prev.energyCapLevel + 1;
          if (next >= ENERGY_CAP_UPGRADES.length) {
            outcome = { success: false, message: 'Sudah level maksimal' };
            return prev;
          }
          const cfg = ENERGY_CAP_UPGRADES[next];
          if (prev.points < cfg.cost) {
            outcome = { success: false, message: 'Poin tidak cukup' };
            return prev;
          }
          outcome = { success: true, message: `Kapasitas Energi ditingkatkan ke ${cfg.label}!` };
          const updated: GameState = {
            ...prev,
            points: prev.points - cfg.cost,
            energyCapLevel: next,
            maxEnergy: cfg.value,
            tasks: unlockT7(prev.tasks),
            transactions: [genTx(`Upgrade Kapasitas Energi ${cfg.label}`, cfg.cost), ...prev.transactions],
          };
          persist(updated);
          return updated;
        }

        if (type === 'recharge') {
          const next = prev.rechargeLevel + 1;
          if (next >= RECHARGE_UPGRADES.length) {
            outcome = { success: false, message: 'Sudah level maksimal' };
            return prev;
          }
          const cfg = RECHARGE_UPGRADES[next];
          if (prev.points < cfg.cost) {
            outcome = { success: false, message: 'Poin tidak cukup' };
            return prev;
          }
          outcome = { success: true, message: `Isi Ulang ditingkatkan ke ${cfg.label}!` };
          const updated: GameState = {
            ...prev,
            points: prev.points - cfg.cost,
            rechargeLevel: next,
            tasks: unlockT7(prev.tasks),
            transactions: [genTx(`Upgrade Isi Ulang ${cfg.label}`, cfg.cost), ...prev.transactions],
          };
          persist(updated);
          return updated;
        }

        return prev;
      });

      return outcome;
    },
    [persist]
  );

  const completeTask = useCallback(
    (taskId: string) => {
      setGameState(prev => {
        const task = prev.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return prev;
        const updated: GameState = {
          ...prev,
          points: prev.points + task.reward,
          lifetimePoints: prev.lifetimePoints + task.reward,
          tasksCompleted: prev.tasksCompleted + 1,
          tasks: prev.tasks.map(t => (t.id === taskId ? { ...t, completed: true } : t)),
          transactions: [
            {
              id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
              type: 'reward',
              amount: task.reward,
              description: `Hadiah Tugas: ${task.title}`,
              date: new Date().toISOString(),
              status: 'completed',
            },
            ...prev.transactions,
          ],
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id' | 'date'>) => {
      setGameState(prev => {
        const updated: GameState = {
          ...prev,
          transactions: [
            {
              ...tx,
              id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
              date: new Date().toISOString(),
            },
            ...prev.transactions,
          ],
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const updateUsername = useCallback(
    (name: string) => {
      setGameState(prev => {
        const updated = { ...prev, username: name };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const refillEnergy = useCallback(() => {
    setGameState(prev => {
      const updated = { ...prev, energy: prev.maxEnergy };
      persist(updated);
      return updated;
    });
  }, [persist]);

  const addBonusPoints = useCallback(
    (amount: number, description: string) => {
      setGameState(prev => {
        const updated: GameState = {
          ...prev,
          points: prev.points + amount,
          lifetimePoints: prev.lifetimePoints + amount,
          transactions: [
            {
              id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
              type: 'reward',
              amount,
              description,
              date: new Date().toISOString(),
              status: 'completed',
            },
            ...prev.transactions,
          ],
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  return (
    <GameContext.Provider
      value={{
        gameState,
        isLoaded,
        tap,
        buyUpgrade,
        completeTask,
        addTransaction,
        updateUsername,
        refillEnergy,
        addBonusPoints,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

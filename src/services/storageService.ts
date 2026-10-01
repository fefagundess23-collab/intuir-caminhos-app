import { UserProgressData, JournalEntry, PostPracticeState } from '../types';

const STORAGE_KEY = 'intuir_saindo_alerta_v1';

const DEFAULT_PROGRESS: UserProgressData = {
  completedDayNumbers: [],
  completedPracticesCount: 0,
  journalEntries: [],
  favoritePracticeIds: [],
  hasSeenWelcome: false,
};

export const storageService = {
  getProgress(): UserProgressData {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_PROGRESS;
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
      };
    } catch (err) {
      console.warn('Error reading from localStorage:', err);
      return DEFAULT_PROGRESS;
    }
  },

  saveProgress(data: UserProgressData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Error writing to localStorage:', err);
    }
  },

  markPracticeCompleted(params: {
    practiceId: string;
    dayNumber?: number;
    practiceTitle: string;
    feelingAfter: PostPracticeState;
    feelingLabel: string;
    note?: string;
  }): UserProgressData {
    const current = this.getProgress();
    const now = new Date().toISOString();

    const newCompletedDays =
      params.dayNumber && !current.completedDayNumbers.includes(params.dayNumber)
        ? [...current.completedDayNumbers, params.dayNumber].sort((a, b) => a - b)
        : current.completedDayNumbers;

    const newEntry: JournalEntry = {
      id: 'entry_' + Date.now(),
      practiceId: params.practiceId,
      dayNumber: params.dayNumber,
      practiceTitle: params.practiceTitle,
      feelingAfter: params.feelingAfter,
      feelingLabel: params.feelingLabel,
      note: params.note?.trim() || undefined,
      completedAt: now,
    };

    const updated: UserProgressData = {
      ...current,
      completedDayNumbers: newCompletedDays,
      completedPracticesCount: current.completedPracticesCount + 1,
      journalEntries: [newEntry, ...current.journalEntries],
      lastActiveDate: now,
    };

    this.saveProgress(updated);
    return updated;
  },

  toggleFavorite(practiceId: string): UserProgressData {
    const current = this.getProgress();
    const exists = current.favoritePracticeIds.includes(practiceId);
    const updatedFavorites = exists
      ? current.favoritePracticeIds.filter((id) => id !== practiceId)
      : [...current.favoritePracticeIds, practiceId];

    const updated: UserProgressData = {
      ...current,
      favoritePracticeIds: updatedFavorites,
    };

    this.saveProgress(updated);
    return updated;
  },

  setSeenWelcome(seen: boolean = true): UserProgressData {
    const current = this.getProgress();
    const updated: UserProgressData = {
      ...current,
      hasSeenWelcome: seen,
    };
    this.saveProgress(updated);
    return updated;
  },

  resetProgress(): UserProgressData {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
    return DEFAULT_PROGRESS;
  },
};

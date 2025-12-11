
import { FeedLog, User, JournalEntry } from '../types';

const USERS_KEY = 'momverse_users';
const CURRENT_USER_KEY = 'momverse_current_user';
const LOGS_KEY = 'momverse_feeding_logs';
const JOURNAL_KEY = 'momverse_journal';

// --- User & Auth Simulation ---

export const getStoredUsers = (): User[] => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveUser = (user: User & { password?: string }) => {
  const users = getStoredUsers();
  // Check if exists
  if (users.find(u => u.email === user.email)) {
    throw new Error("User already exists");
  }
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const loginUser = (email: string, password: string): User => {
  const users = getStoredUsers();
  // In a real app, we would hash passwords. Here we simulate checks.
  // For this mock, we just check if email exists in our "db"
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error("User not found");
  }
  // Simulating password check (in this mock, any password works if user exists, 
  // or you could store passwords in the object if you really wanted to simulate it fully)
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

// --- Feeding Logs ---

export const getFeedingLogs = (): FeedLog[] => {
  try {
    const data = localStorage.getItem(LOGS_KEY);
    const parsed = data ? JSON.parse(data) : [];
    // Restore dates
    return parsed.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }));
  } catch (e) {
    return [];
  }
};

export const saveFeedingLog = (log: FeedLog) => {
  const logs = getFeedingLogs();
  const newLogs = [log, ...logs];
  localStorage.setItem(LOGS_KEY, JSON.stringify(newLogs));
  return newLogs;
};

// --- Journal ---

export const getJournalEntries = (): JournalEntry[] => {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    const parsed = data ? JSON.parse(data) : [];
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }));
  } catch (e) {
    return [];
  }
};

export const saveJournalEntry = (entry: JournalEntry) => {
  const entries = getJournalEntries();
  const newEntries = [entry, ...entries];
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(newEntries));
  return newEntries;
};

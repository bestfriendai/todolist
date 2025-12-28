import { create } from 'zustand';
import { supabase } from '@/src/services/supabase';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  user_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: Priority;
  due_date: string | null;
  reminder_at: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
export type CreateCategoryInput = Omit<Category, 'id' | 'user_id' | 'created_at'>;

interface TaskFilters {
  categoryId?: string | null;
  priority?: Priority;
  isCompleted?: boolean;
  search?: string;
}

interface TaskState {
  tasks: Task[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;

  // Task actions
  fetchTasks: () => Promise<void>;
  createTask: (task: CreateTaskInput) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;

  // Category actions
  fetchCategories: () => Promise<void>;
  createCategory: (category: CreateCategoryInput) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Filter actions
  setFilters: (filters: TaskFilters) => void;
  clearFilters: () => void;

  // Clear error
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  categories: [],
  isLoading: false,
  error: null,
  filters: {},

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ tasks: data || [], isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: message, isLoading: false });
    }
  },

  createTask: async (taskData) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ tasks: [data, ...state.tasks] }));
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create task';
      set({ error: message });
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? data : t)),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update task';
      set({ error: message });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete task';
      set({ error: message });
      throw error;
    }
  },

  toggleComplete: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;

    const updates = {
      is_completed: !task.is_completed,
      completed_at: !task.is_completed ? new Date().toISOString() : null,
    };

    await get().updateTask(id, updates);
  },

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ error: message });
    }
  },

  createCategory: async (categoryData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryData)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ categories: [...state.categories, data] }));
      return data;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create category';
      set({ error: message });
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? data : c)),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update category';
      set({ error: message });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete category';
      set({ error: message });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }));
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => set({ error: null }),
}));

// ============================================
// SELECTORS
// ============================================

export const selectFilteredTasks = (state: TaskState): Task[] => {
  let tasks = state.tasks;
  const { filters } = state;

  if (filters.categoryId !== undefined) {
    tasks = tasks.filter((t) => t.category_id === filters.categoryId);
  }

  if (filters.priority) {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }

  if (filters.isCompleted !== undefined) {
    tasks = tasks.filter((t) => t.is_completed === filters.isCompleted);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description?.toLowerCase().includes(searchLower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  }

  return tasks;
};

export const selectTasksByCategory = (state: TaskState, categoryId: string | null): Task[] => {
  return state.tasks.filter((t) => t.category_id === categoryId);
};

export const selectTasksDueToday = (state: TaskState): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return state.tasks.filter((t) => {
    if (!t.due_date || t.is_completed) return false;
    const dueDate = new Date(t.due_date);
    return dueDate >= today && dueDate < tomorrow;
  });
};

export const selectTasksDueSoon = (state: TaskState, days: number): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(future.getDate() + days);

  return state.tasks.filter((t) => {
    if (!t.due_date || t.is_completed) return false;
    const dueDate = new Date(t.due_date);
    return dueDate >= today && dueDate <= future;
  });
};

export const selectOverdueTasks = (state: TaskState): Task[] => {
  const now = new Date();
  return state.tasks.filter((t) => {
    if (!t.due_date || t.is_completed) return false;
    return new Date(t.due_date) < now;
  });
};

export const selectCompletedTasks = (state: TaskState): Task[] => {
  return state.tasks.filter((t) => t.is_completed);
};

export const selectPendingTasks = (state: TaskState): Task[] => {
  return state.tasks.filter((t) => !t.is_completed);
};

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
  byCategory: Record<string, number>;
  completedThisWeek: number;
  streak: number;
}

export const selectTaskStats = (state: TaskState): TaskStats => {
  const tasks = state.tasks;
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const completed = tasks.filter((t) => t.is_completed);
  const pending = tasks.filter((t) => !t.is_completed);
  const overdue = tasks.filter((t) => {
    if (!t.due_date || t.is_completed) return false;
    return new Date(t.due_date) < now;
  });

  const completedThisWeek = completed.filter((t) => {
    if (!t.completed_at) return false;
    return new Date(t.completed_at) >= weekAgo;
  });

  // Calculate category distribution
  const byCategory: Record<string, number> = {};
  tasks.forEach((t) => {
    const catId = t.category_id || 'uncategorized';
    byCategory[catId] = (byCategory[catId] || 0) + 1;
  });

  return {
    total: tasks.length,
    completed: completed.length,
    pending: pending.length,
    overdue: overdue.length,
    completionRate: tasks.length > 0 ? (completed.length / tasks.length) * 100 : 0,
    byPriority: {
      low: tasks.filter((t) => t.priority === 'low').length,
      medium: tasks.filter((t) => t.priority === 'medium').length,
      high: tasks.filter((t) => t.priority === 'high').length,
    },
    byCategory,
    completedThisWeek: completedThisWeek.length,
    streak: 0, // TODO: Calculate actual streak
  };
};

// Form State Store using Zustand
// Persists user input across tier changes

import { create } from 'zustand';

export const useFormStore = create((set, get) => ({
  // Form data storage
  formData: {},
  
  // Intent state
  activeIntent: null,
  intentHistory: [],

  // Update a form field
  updateField: (intentId, fieldName, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [intentId]: {
          ...state.formData[intentId],
          [fieldName]: value
        }
      }
    }));
  },

  // Get form data for a specific intent
  getFormData: (intentId) => {
    return get().formData[intentId] || {};
  },

  // Clear form data for an intent
  clearFormData: (intentId) => {
    set((state) => {
      const newFormData = { ...state.formData };
      delete newFormData[intentId];
      return { formData: newFormData };
    });
  },

  // Clear all form data
  clearAllFormData: () => {
    set({ formData: {} });
  },

  // Set active intent
  setActiveIntent: (intent) => {
    set((state) => ({
      activeIntent: intent,
      intentHistory: [...state.intentHistory, {
        intent,
        timestamp: new Date().toISOString()
      }].slice(-20) // Keep last 20
    }));
  },

  // Get active intent
  getActiveIntent: () => {
    return get().activeIntent;
  },

  // Bulk update form data
  bulkUpdateFormData: (intentId, data) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [intentId]: {
          ...state.formData[intentId],
          ...data
        }
      }
    }));
  },

  // Export form state (for debugging/persistence)
  exportState: () => {
    return {
      formData: get().formData,
      activeIntent: get().activeIntent,
      intentHistory: get().intentHistory
    };
  },

  // Import form state
  importState: (state) => {
    set({
      formData: state.formData || {},
      activeIntent: state.activeIntent || null,
      intentHistory: state.intentHistory || []
    });
  }
}));

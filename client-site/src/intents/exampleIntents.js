// Example Intent Definitions
// These are intent objects that define UI independent of tier

export const INTENT_TYPES = {
  FORM: 'form',
  DASHBOARD: 'dashboard',
  MODAL: 'modal',
  LIST: 'list'
};

export const exampleIntents = {
  // Contact Form Intent
  contactForm: {
    id: 'contact-form-001',
    type: INTENT_TYPES.FORM,
    title: 'Contact Form',
    description: 'Reach out to us',
    fields: [
      {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'John Doe',
        required: true
      },
      {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'john@example.com',
        required: true
      },
      {
        id: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Your message here...',
        required: true,
        rows: 4
      },
      {
        id: 'priority',
        type: 'select',
        label: 'Priority',
        options: ['Low', 'Medium', 'High', 'Urgent'],
        required: false
      }
    ],
    actions: [
      {
        id: 'submit',
        label: 'Submit',
        type: 'primary'
      },
      {
        id: 'reset',
        label: 'Reset',
        type: 'secondary'
      }
    ]
  },

  // Dashboard Intent
  systemDashboard: {
    id: 'system-dashboard-001',
    type: INTENT_TYPES.DASHBOARD,
    title: 'System Dashboard',
    description: 'Monitor system resources',
    widgets: [
      {
        id: 'battery-widget',
        type: 'metric',
        label: 'Battery',
        icon: 'battery',
        valueKey: 'battery',
        unit: '%',
        thresholds: {
          critical: 10,
          warning: 25,
          good: 50
        }
      },
      {
        id: 'network-widget',
        type: 'metric',
        label: 'Network',
        icon: 'wifi',
        valueKey: 'networkType',
        displayFormat: 'badge'
      },
      {
        id: 'cpu-widget',
        type: 'metric',
        label: 'CPU Score',
        icon: 'cpu',
        valueKey: 'cpuScore',
        unit: '%',
        thresholds: {
          critical: 20,
          warning: 40,
          good: 60
        }
      },
      {
        id: 'fps-widget',
        type: 'metric',
        label: 'FPS',
        icon: 'activity',
        valueKey: 'fps',
        thresholds: {
          critical: 15,
          warning: 30,
          good: 45
        }
      },
      {
        id: 'memory-widget',
        type: 'metric',
        label: 'Memory',
        icon: 'database',
        valueKey: 'memoryUsed',
        secondaryKey: 'memory',
        unit: 'MB',
        displayFormat: 'progress'
      }
    ]
  },

  // User Profile Intent
  userProfile: {
    id: 'user-profile-001',
    type: INTENT_TYPES.FORM,
    title: 'User Profile',
    description: 'Update your profile information',
    fields: [
      {
        id: 'username',
        type: 'text',
        label: 'Username',
        placeholder: 'username',
        required: true
      },
      {
        id: 'bio',
        type: 'textarea',
        label: 'Bio',
        placeholder: 'Tell us about yourself',
        required: false,
        rows: 3
      },
      {
        id: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['Dark', 'Light', 'Auto'],
        required: false
      },
      {
        id: 'notifications',
        type: 'checkbox',
        label: 'Enable notifications',
        required: false
      }
    ],
    actions: [
      {
        id: 'save',
        label: 'Save Profile',
        type: 'primary'
      }
    ]
  },

  // Task List Intent
  taskList: {
    id: 'task-list-001',
    type: INTENT_TYPES.LIST,
    title: 'Tasks',
    description: 'Your task list',
    items: [
      {
        id: 'task-1',
        text: 'Complete project documentation',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-2',
        text: 'Review pull requests',
        status: 'in-progress',
        priority: 'medium'
      },
      {
        id: 'task-3',
        text: 'Update dependencies',
        status: 'pending',
        priority: 'low'
      },
      {
        id: 'task-4',
        text: 'Deploy to production',
        status: 'completed',
        priority: 'high'
      }
    ],
    actions: [
      {
        id: 'add-task',
        label: 'Add Task',
        type: 'primary'
      }
    ]
  }
};

// Default intent
export const defaultIntent = exampleIntents.contactForm;

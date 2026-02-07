module.exports = {
  apps: [
    {
      name: 'alphabyte-brain-server',
      script: './brain-server/server.js',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/brain-server-error.log',
      out_file: './logs/brain-server-out.log',
      log_file: './logs/brain-server-combined.log',
      time: true
    }
  ]
};

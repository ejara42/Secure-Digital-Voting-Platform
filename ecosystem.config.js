// PM2 Ecosystem Config
// Usage:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup

module.exports = {
    apps: [
        {
            name: "enbe-election-api",
            script: "./backend/server.js",
            cwd: "./backend",
            instances: "max",       // One process per CPU core
            exec_mode: "cluster",   // Load balancing across cores
            watch: false,           // Disable in production
            max_memory_restart: "512M",
            env: {
                NODE_ENV: "development",
                PORT: 5000,
            },
            env_production: {
                NODE_ENV: "production",
                PORT: 5000,
            },
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            error_file: "./logs/pm2-error.log",
            out_file: "./logs/pm2-out.log",
            merge_logs: true,
            // Auto-restart on crash with exponential back-off
            autorestart: true,
            restart_delay: 1000,
            max_restarts: 10,
            // Graceful shutdown
            kill_timeout: 5000,
            listen_timeout: 3000,
        },
    ],
};

const { spawn } = require('child_process');
const path = require('path');

// Start server
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start client
const client = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  server.kill();
  client.kill();
  process.exit();
}); 
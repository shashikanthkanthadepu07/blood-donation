const app = require('./api/index');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
🚀 LifeFlow Blood Donation API is running!
📡 Local Server: http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
🌐 Client Dev:   http://localhost:5173
  `);
});

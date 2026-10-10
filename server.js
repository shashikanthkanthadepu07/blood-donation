const path = require('path');
const express = require('express');
const app = require('./api/index');

const PORT = process.env.PORT || 5000;
const clientBuildPath = path.join(__dirname, 'client', 'dist');

app.use(express.static(clientBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
🚀 LifeFlow Blood Donation API is running!
📡 Local Server: http://localhost:${PORT}
🩺 Health Check: http://localhost:${PORT}/api/health
🌐 Client Dev:   http://localhost:5173
  `);
});

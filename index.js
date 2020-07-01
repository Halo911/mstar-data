const dotnev = require('dotenv');
const express = require('express');
const app = express();

//Load env vars
dotnev.config({ path: './config/config.env' });

app.use(express.json());

app.use('/api', require('./routes/api/csv'));

const port = process.env.PORT || 5000;

const server = app.listen(port, console.log(`Server started on port ${port}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

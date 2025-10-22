import dotenv from 'dotenv';
import app from './app.js';
import SingletonConnection from './config/singletonConnection.js';

dotenv.config();
const PORT = process.env.PORT || 3333;

SingletonConnection.getInstance();

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
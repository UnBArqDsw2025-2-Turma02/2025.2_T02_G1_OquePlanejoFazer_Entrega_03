import { connectDB } from './database.js';

let connectionInstance = null;
let isConnecting = false;

const SingletonConnection = {
  getInstance: async () => {
    if (connectionInstance) return connectionInstance;
    if (isConnecting) {
      return new Promise(resolve => setTimeout(() => resolve(SingletonConnection.getInstance()), 50));
    }
    isConnecting = true;
    connectionInstance = await connectDB(); 
    isConnecting = false;
    return connectionInstance;
  }
};

Object.freeze(SingletonConnection);
export default SingletonConnection;
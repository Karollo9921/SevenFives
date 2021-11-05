import dotenv from 'dotenv';

dotenv.config();

export default {
  url: process.env.NODE_ENV === 'development' ? "http://localhost:5000" : "https://seven-fives.herokuapp.com",
  urlForFrontend: process.env.NODE_ENV === 'development' ? "http://localhost:3000/api" : "https://seven-fives.herokuapp.com/api"
} 
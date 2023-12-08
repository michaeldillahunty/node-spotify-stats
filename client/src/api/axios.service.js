import axios from "axios";

axios.defaults.withCredentials = true;
const instance =  axios.create({
//   baseURL: 'http://localhost:8000', 
  timeout: 10000, 
  credientials: true,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': '*'
  },
});
export default instance;

import axios from 'axios'

axios.defaults.baseURL = 'https://api.devcury.kr';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
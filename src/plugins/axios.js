import axios from 'axios'

// axios의 기본 베이스를 정의 함.
//axios.defaults.baseURL = 'https://api.devcury.kr';
axios.defaults.baseURL = 'https://localhost:8090';
// post타입의 content-type을 정의.
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
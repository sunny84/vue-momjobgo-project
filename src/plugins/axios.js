import axios from 'axios'

// axios의 기본 베이스를 정의 함.
axios.defaults.baseURL = 'https://api.devcury.kr';
// post타입의 content-type을 정의.
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default axios;
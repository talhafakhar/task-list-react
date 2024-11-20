import {AxiosStatic} from 'axios';

const auth = {
    token: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}').token : null,
};

export function setupAxios(axios: AxiosStatic) {
    axios.defaults.headers.Accept = 'application/json'
    axios.interceptors.request.use(
        async (config) => {
            if (auth.token) {
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
            return config;
        },
        (err) => Promise.reject(err)
    );
}
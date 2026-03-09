import axios from 'axios';

// Récupère le token CSRF soit du meta tag, soit depuis le document
const getToken = () => {
    // Essayer d'abord le meta tag
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;
    
    // Fallback: chercher dans les cookies
    const cookieToken = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return undefined;
    };
    
    return cookieToken('XSRF-TOKEN');
};

const token = getToken();

if (token) {
    // Ajouter le token à tous les en-têtes
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    // Configuration spécifique pour chaque méthode
    axios.defaults.headers.post['X-CSRF-TOKEN'] = token;
    axios.defaults.headers.put['X-CSRF-TOKEN'] = token;
    axios.defaults.headers.patch['X-CSRF-TOKEN'] = token;
    axios.defaults.headers.delete['X-CSRF-TOKEN'] = token;
}

// Intercepteur pour ajouter le token à chaque requête
axios.interceptors.request.use(config => {
    const freshToken = getToken();
    if (freshToken) {
        config.headers['X-CSRF-TOKEN'] = freshToken;
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axios;

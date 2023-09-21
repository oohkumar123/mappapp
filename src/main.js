import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MapApi from './lib/MapApi.js';

const app = createApp(App)

app.config.globalProperties.MapApi = new MapApi();

app.use(store).use(router).mount('#app')

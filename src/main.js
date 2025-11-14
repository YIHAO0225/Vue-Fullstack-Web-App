import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router.js';
import axios from 'axios'
const app = createApp(App)

axios.defaults.baseURL = "http://localhost:3001/v1"

app.use(ElementPlus)
app.use(router).mount('#app')

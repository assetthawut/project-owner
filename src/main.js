import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'   // <- must be exact path and present
import router from './router'

createApp(App)
.use(router) 
.mount('#app')

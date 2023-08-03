import { createApp } from 'vue'
import * as Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@fortawesome/fontawesome-free/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './assets/main.css'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { useRoute } from 'vue-router'

const app = Vue.createApp(App)

app.use(router).use(store).use(Toast)

app.mount('#app')

library.add(fas);
app.component('font-awesome-icon', FontAwesomeIcon);

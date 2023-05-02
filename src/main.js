import { createApp } from 'vue';
import App from './App.vue';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "jquery/dist/jquery.min.js";
import router from "./router/index";
import { createPinia } from 'pinia';
import VueCookies from 'vue-cookies';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap";
import './assets/main.css';



createApp(App).use(router).use(VueCookies).use(createPinia()).mount('#app');
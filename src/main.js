import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 라우터 추가
import "./assets/tailwind.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

createApp(App)
  .use(router)   // 라우터 등록
  .mount("#app");
  

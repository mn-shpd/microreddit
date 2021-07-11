import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import store from "./store";
import io from "socket.io-client";

const app = createApp(App);
const socket = io();

app.config.globalProperties.$socketio = socket;

app.use(router);
app.use(store);

app.mount("#app");

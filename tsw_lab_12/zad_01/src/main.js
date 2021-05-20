import { createApp } from 'vue'
import App from './App.vue'
import router from './routes';
import SocketIO from 'socket.io-client'

const io = SocketIO('http://localhost:3000');
const app = createApp(App);
app.use(router);
app.config.globalProperties.$socketio = io;
app.mount('#app');


import { createApp } from 'vue'
import App from './App.vue'
import router from './routes';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import YoutubeIframe from '@techassi/vue-youtube-iframe';

const app = createApp(App);

app.use(router);
app.use(YoutubeIframe);

app.mount('#app')

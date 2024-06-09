import {createApp} from 'vue'
import 'vant/es/toast/style'
import App from './App.vue'
import { Tabbar, TabbarItem ,Icon,Cell,CellGroup,Form,Field,Swipe, SwipeItem,Card,Toast,Tag,TextEllipsis,ConfigProvider,Dialog} from 'vant';
import router from "./config/router";


const app = createApp(App);
app.use(Tabbar);
app.use(TabbarItem);
app.use(router);
app.use(Icon);
app.use(Cell);
app.use(CellGroup);
app.use(Form);
app.use(Field);
app.use(Swipe);
app.use(SwipeItem);
app.use(Card);
app.use(Toast);
app.use(Tag);
app.use(TextEllipsis);
app.use(Dialog);
app.use(ConfigProvider);
app.mount('#app');

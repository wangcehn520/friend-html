<template>
  <van-nav-bar :title="title"
               left-arrow
               @click-left="onClickLeft"
               @click-right="onClickRight">
  <template #right>
    <van-icon name="search" size="18" />
  </template>
  </van-nav-bar >
  <router-view/>
    <van-tabbar router v-model="active" @change="onChange" placeholder>
      <van-tabbar-item to="/" icon="home-o" name="index" >主页</van-tabbar-item>
      <van-tabbar-item to="/friend" icon="friends-o" name="friend" :badge=" Number(number)!== 0 ? number:''">伙伴</van-tabbar-item>
      <van-tabbar-item to="/posts" name=""posts>
        <template #icon="props">
          <van-icon name="add-o" size="40" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/messages" icon="chat-o" name="messages" >消息</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-circle-o" name="user" >我的</van-tabbar-item>
    </van-tabbar>


</template>


<script setup>
import {ref ,watchEffect,onMounted} from 'vue';
import {useRoute, useRouter} from "vue-router";
import routes from "../config/router";
import myAxios from "../plugins/myAxios";
import {getMessageNumber, setMessageNumber} from "../plugins/MyUtils";



const router = useRouter();
const route = useRoute();
const title = ref('主页');
let active = ref("index");
let number;

onMounted(async () =>{
    const res = await myAxios.get("/chat/getNewAddMessage");
    if (res.code === 0 && res.data !=null){
      setMessageNumber(res.data);
    }
    number = getMessageNumber();

})
watchEffect(()=>{
  active.value = route.path.split('/')[1] ? route.path.split('/')[1] :  "index";
})
const onChange = (e) => {
  active.value=e;
};
const onClickLeft = () => {
  router.back();

};
const onClickRight = () => {
  router.push('/search');
};

router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.options.routes.find((route) =>{
    return toPath == route.path
  })
  title.value = route?.title ?? '主页';

  if (to.path === '/'){
    return true;
  }

})

</script>

<style scoped>

</style>
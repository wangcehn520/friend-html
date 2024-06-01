<template>
  <van-cell clickable v-for="friend in friends">
    <template #right-icon>
      <van-icon name="chat-o" size="2rem" style="margin-top: 5px" @click="chatFriends(friend.friendId)"/>
    </template>
    <template #title >
      <span style="margin-left: 15px" v-text="friend.friendName"></span>
    </template>
    <template #icon>
      <van-image justify="center"
                 round
                 width="3rem"
                 height="3rem"
                 :src="friend.friendAvatarUrl.includes('http') ? friend.friendAvatarUrl :'/image/' + friend.friendAvatarUrl"
      />
    </template>
    <template #label >
      <span style="margin-left: 15px">这人暂未简介....</span>
    </template>
  </van-cell>

</template>

<script setup>
import {onMounted, ref} from 'vue';
import {getCurrentUser} from "../services/user";
import myAxios from "../plugins/myAxios";
import {showSuccessToast} from "vant";
import {useRouter} from "vue-router";


const router = useRouter();
const friends = ref([]);

onMounted(async () => {
  const current = await getCurrentUser();
  if (!current){
    window.location.href = '/user/login'
    return;
  }
  const userId = current.id;
  const res= await myAxios.get("/chat/RecentlyContacted/" + userId);
  if (res.code === 0 && res.message === 'ok'){
    friends.value = res.data;
    console.log(friends.value)
  }else {
    showFailToast({
      message:'获取失败',
      closeOnClick: true
    });
  }
})

const chatFriends = (friendId) =>{
  router.push({
    path:"/chat/privateChat",
    query:{
      friendId,
    }
  })
}


</script>

<style scoped>

</style>
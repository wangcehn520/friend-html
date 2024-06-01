<template>
  <van-tabs v-model:active="active">
    <van-tab title="好友">
      <van-cell title="新朋友" is-link to="/users/friendSonPages" >
        <template #value>
          <van-badge :content="0" style="margin-right: 25px" >
            <div class="child" />
          </van-badge>
        </template>
      </van-cell>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="我的好友" name="1" >
          <van-cell clickable v-for="friend in friends">
            <template #right-icon>
              <van-icon name="chat-o" size="2rem" style="margin-top: 5px" @click="chatFriend(friend.friendId)"/>
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
                         @click="searchFriend(friend.friendId)"
              />
            </template>
            <template #label >
              <span style="margin-left: 15px">这人暂未简介....</span>
            </template>
          </van-cell>
          <van-empty description="暂无好友" v-if="friends.length === 0"/>
        </van-collapse-item>
      </van-collapse>

    </van-tab>

    <van-tab title="发现">
      <van-cell to="/posts/dynamicPage" title="好友动态" is-link />
      <van-cell title="星球" is-link />
    </van-tab>

  </van-tabs>

</template>

<script setup>
import { ref,onMounted } from 'vue';
import {useRouter} from "vue-router";
import {getCurrentUser} from "../services/user";
import myAxios from "../plugins/myAxios";
import {showSuccessToast} from "vant";

const router = useRouter();
const active = ref(0);
const activeNames = ref(['1']);
const friends = ref([]);

onMounted( async () => {
  const current = await getCurrentUser();
  if (!current){
    window.location.href = '/user/login'
    return;
  }

  const res = await myAxios.get("/friend/searchFriends")
  if (res.code === 0 && res.message === 'ok'){
    friends.value = res.data;
  }else {
    showFailToast({
      message:'获取失败',
      closeOnClick: true
    });
  }

})


const chatFriend = (friendId) =>{
    router.push({
      path:"/chat/privateChat",
      query:{
        friendId,

      }
    })
}

const searchFriend = (userId) =>{
      router.push({
        path:'/users/searchOthers',
        query: {
          userId,
        }
      })
}

</script>

<style scoped>

</style>
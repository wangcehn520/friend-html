<template>
  <van-tabs v-model:active="active">

    <van-tab title="我收到的" >
    <template #title>
      <van-icon name="volume-o">
        我收到的
      </van-icon>
    </template>
    <template #badge>
        <van-badge :content="10">
          <div class="child" />
        </van-badge>
      </template>
      <van-cell v-for="user in userList">
        <template #right-icon v-if="user.status === '0'">
          <van-icon name="success" size="2rem" @click="agree(user.friendId)"/>
          <van-icon name="cross" size="2rem" @click="refuse(user.friendId)"/>
        </template>

        <template #right-icon v-if="user.status === '1'">
         <span>已同意</span>
        </template>

        <template #right-icon v-if="user.status === '2'">
          <span>已拒绝</span>
        </template>

        <template #title >
          <span style="margin-left: 15px" v-text="user.friendName"></span>
        </template>
        <template #icon>
          <van-image justify="center"
                     round
                     width="3rem"
                     height="3rem"
                     :src="user.friendAvatarUrl.includes('http') ? user.friendAvatarUrl :'/image/' + user.friendAvatarUrl"
          />
        </template>
        <template #label >
          <span style="margin-left: 15px">这人暂未简介....</span>
        </template>
      </van-cell>
    <van-empty description="暂无信息" v-if="userList.length === 0"/>
    </van-tab>

    <van-tab title="我申请的" >
      <template #title>
        <van-icon name="friends-o" @click="getSendMessage">
          我申请的
        </van-icon>
      </template>
      <van-cell @click="toUserIndex(friend.friendId)" v-for="friend in friendList">
        <template #right-icon v-if="friend.status === '0'">
          <span>等待验证</span>
        </template>

        <template #right-icon v-if="friend.status === '1'">
          <span>已同意</span>
        </template>

        <template #right-icon v-if="friend.status === '2'">
          <span>已拒绝</span>
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
      <van-empty description="暂无信息" v-if="friendList.length === 0" />
    </van-tab>
  </van-tabs>

</template>

<script setup>
import {onMounted,ref} from 'vue';
import myAxios from "../plugins/myAxios";
import {getCurrentUser} from "../plugins/MyTikenUtils";
import {showSuccessToast} from "vant";
import {useRouter} from "vue-router";



const router = useRouter();
const active = ref(0);
const userList = ref([]);
const friendList = ref([]);
/**
 * 获取好友申请
 */
onMounted(async () => {

  if (!getCurrentUser()){
    window.location.href = '/user/login'
  }
  const res = await myAxios.get("/friend/getAddFriendMessage")
  if (res.code === 0 && res.data != null){
    userList.value = res.data;
  }

})

/**
 * 拒绝添加好友
 * @returns {Promise<void>}
 */
const refuse = async (friendId) => {
  console.log(friendId)
  const res = await myAxios.get("/friend/refuse/" + friendId);
}

/**
 * 同意添加好友
 * @param id
 * @returns {Promise<void>}
 */
const agree = async (id) => {
  const res = await myAxios.get("/friend/agreeFriend/"+ id);
  console.log(res)
  if (res.code === 0 && res.message === 'ok'){
    window.location.reload();
    showSuccessToast("添加成功");
    return;
  }
  showFailToast("操作有误");
}


/***
 * 获取自己申请的信息
 * @returns {Promise<void>}
 */
const getSendMessage = async () =>{
  console.log(1111)
  const res = await myAxios.get("/friend/getSendMessage");
  if (res.code === 0 && res.message === 'ok'){
    friendList.value = res.data;
    console.log(friendList.value)
    showSuccessToast({
      message:'获取成功',
      closeOnClick: true
    });
  }else {
    showFailToast({
      message:'获取失败',
      closeOnClick: true
    });
  }
}

/**
 * 查看对方主页
 * @param userId
 * @returns {Promise<void>}
 */
const toUserIndex = (userId) => {
  console.log(userId)
  router.push({
    path:'/search/searchOthers',
    query: {
      userId,
    }
  })
}


</script>

<style scoped>

</style>
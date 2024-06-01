<template>
  <template v-if="user">
      <van-image justify="center" style="left:28%"
                 round
                 width="10rem"
                 height="10rem"
                 :src="user.avatarUrl"
                 @click="onClick('avatarUrl',user.avatarUrl)"
      />
    <van-cell></van-cell>
    <van-cell title="账号" :value="user.userAccount" />
    <van-cell title="用户名" is-link :value="user.username" @click="toEdit('username',user.username,'用户名')"/>
    <van-cell title="性别" is-link :value="user.gender===0 ? '女' : '男'" @click="toEdit('gender',user.gender===0 ? '女' : '男','性别') "/>
    <van-cell title="标签" is-link  @click="toEdit('tags',user.tags,'标签')">
      <template #value >
        <van-tag round plain type="primary" size="medium"  v-for="tag in user.tags" style="margin-top: 8px;margin-right: 8px">
          {{tag}}
        </van-tag>
      </template>
    </van-cell>
    <van-cell title="手机号" is-link :value="user.phone" @click="toEdit('phone',user.phone,'手机号')"/>
    <van-cell title="邮箱" is-link :value="user.email" @click="toEdit('email',user.email,'邮箱')"/>
    <van-cell title="创建时间"  :value="user.createTime" @click="toEdit('createTime',user.createTime,'创建时间')"/>
    <div style="margin: 16px;">
      <van-button v-if="!user.isMe && !user.isFriend" round block type="primary"@click="addFriend(user.id)" style="margin-bottom: 10px">
        添加加好友
      </van-button>

      <van-button v-if="user.isFriend" round block type="primary" @click="chat(user.id)" style="margin-bottom: 10px">
        私聊
      </van-button>

      <van-button v-if="user.isFriend" round block type="danger" @click="removeFriend(user.id)" >
        删除好友
      </van-button>

    </div>
  </template>

</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {showFailToast} from "vant";
import {getCurrentUser} from "../services/user";
const router =useRouter();
const route = useRoute();
const user = ref();
onMounted(async () =>{
  const res = await myAxios.get('/user/searchOthers/'+route.query.userId)
  if (res.code === 0 && res.message === 'ok'){
    console.log(res)
    user.value = res.data;
    user.value.tags = JSON.parse(user.value.tags);
    user.value.createTime = user.value.createTime.split("T")[0];
    user.value.avatarUrl = user.value.avatarUrl.includes('http') ? user.value.avatarUrl :'/image/' + res.data.avatarUrl;
  }else {
    showFailToast(res.message);
  }

})



const addFriend = async (id)=>{
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
  }
  const res = await myAxios.get('/friend/addFriend/' + id)
  if (res.code === 0 && res.data === "ok"){
    showSuccessToast("发送成功")
  }else {
    showFailToast(res.messasgee);
  }
}


const removeFriend = async (friendId)=>{
  console.log(friendId)
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
  }
  const res = await myAxios.get("/friend/delete/" + friendId)
  if (res.code === 0 && res.data === "ok"){
    showSuccessToast("删除成功");
    window.location.href = '/friend'
  }else {
    showFailToast(res.messasgee);
  }
}


const chat = (friendId) =>{
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
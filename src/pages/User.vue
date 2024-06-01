<template>

  <!-- 无数据时进行占位 -->
<template v-if="!user">
  <van-image justify="center"
             round
             width="10rem"
             height="10rem"
             src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
             style="left: 29%"
  />
      <van-cell></van-cell>
      <van-cell title="账号"/>
      <van-cell title="用户名" is-link/>
      <van-cell title="性别" is-link />
      <van-cell title="标签" is-link />
      <van-cell title="手机号" is-link />
      <van-cell title="邮箱" is-link />
      <van-cell title="创建时间"/>
    </template>
<!-- 有数据进行渲染 -->
<template v-if="user">

<!--  <van-uploader -->
<!--                :max-count="1"-->
<!--                style="left:30%"-->
<!--                :max-size="5000 * 1024"-->
<!--                @oversize="onOversize">-->
  <div class="image-container">
    <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
      <template #reference>
    <van-image justify="center"
               round
               width="10rem"
               height="10rem"
               :src="user.avatarUrl"
    />
      </template>
    </van-popover>
  </div>

<!--  </van-uploader>-->

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
  <van-cell title="注册时间"  :value="user.createTime" @click="toEdit('createTime',user.createTime,'创建时间')"/>
</template>
  <div style="margin: 16px;">
    <van-button round block type="primary"@click="loginOut()">
      退出登录
    </van-button>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from "vue-router";
import {ImagePreview, showFailToast, showImagePreview, showSuccessToast} from "vant";
import {ref} from "vue";
import { onMounted } from 'vue';
import myAxios from "../plugins/myAxios";
import {getCurrentUser} from "../services/user";

const user = ref();


onMounted(async ()=>{
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
    return;
  }
    user.value = currentUser;
    if (user.value.tags != ""){
      user.value.tags = JSON.parse(user.value.tags);
    }
    user.value.createTime = user.value.createTime.split("T")[0];
    user.value.avatarUrl = user.value.avatarUrl.includes('http') ? user.value.avatarUrl :'/image/' + user.value.avatarUrl;
    showSuccessToast('获取成功');

})

const router = useRouter();

const toEdit = (editKey: string, currentValue: string,editName: string) => {
      router.push({
        path: '/users/edit',
        query: {
          editKey,
          currentValue,
          editName,
        }
      })
    };

const loginOut =async () =>{
   const res =await myAxios.get("/user/loginout");
    if (res.code === 0){
      // router.push('/index');
      window.location.href = '/'
    }
    else {
      showFailToast('退出失败');
    }
    }

const onClick = (editKey: string, currentValue: string) =>{
  router.push({
    path:'/users/editAvatarUrl',
    query:{
      editKey,
      currentValue,
    }
  })
}

const showPopover = ref(false);

const search = (avatarUrl) =>{
  showImagePreview({
    images:[avatarUrl],
    showIndex:false,
  });
}

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: '查看头像' },
  { text: '修改头像' },
];

const onSelect = (actions) => {
  if (actions.text === '查看头像'){
    search(user.value.avatarUrl);
  }else {
    onClick('avatarUrl',user.value.avatarUrl)
  }

}

</script>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  /*width: 100%;*/
  /*height: 100%;*/
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 10px;
  box-sizing: border-box; /* 确保边框包含在宽高计算内 */
}
</style>
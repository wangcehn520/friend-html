<template>
  <form action="/">
    <van-search
        v-model="SearchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>

  <van-tabs>
    <van-tab>
      <template #title> <van-icon name="manager-o" color="#ee0a24"/> 用户</template>
      <van-cell clickable v-for="user in userList">
        <template #right-icon>
          <van-button
              icon="like-o"
              type="primary" size="small"
              plain
              @click="addFriend(user.id)"
              v-if="!(user.id === currentUser.id)"
          >
           添加
          </van-button>
        </template>
        <template #title >
          <span style="margin-left: 15px" v-text="user.username"></span>
        </template>
        <template #icon>
          <van-image justify="center"
                     round
                     width="3rem"
                     height="3rem"
                     :src="user.avatarUrl.includes('http') ? user.avatarUrl :'/image/' + user.avatarUrl"
                     @click="searchOthers(user.id)"
          />
        </template>
        <template #label >
          <span style="margin-left: 15px">这人暂未简介....</span>
        </template>
      </van-cell>
      <van-empty v-if="!userList || userList.length<1" description="暂无数据" />
    </van-tab>

    <van-tab>
      <template #title> <van-icon name="fire-o" color="#ee0a24"/> 文章</template>
      <van-card v-for="posts in postsList"
                @click-thumb ="searchOthers(posts.userId)"
                @click="searchDetails(posts.id)"
                style="background-color: white;"
      >
        <template #title>
          <p style="font-size: 14px;font-weight: bold" v-text="posts.title"></p>
        </template>

        <template #thumb >
          <van-image justify="center"
                     round
                     width="80px"
                     height="80px"
                     :src="posts.avatarUrl.includes('http') ? posts.avatarUrl :'/image/' + posts.avatarUrl"
          />
        </template>

        <template #desc>
          <van-text-ellipsis :content="posts.content" rows="3"/>
        </template>

        <template #tags>
          <van-tag plain type="danger" style="margin-right: 8px;margin-top: 8px" v-for="tag in posts.tags">
            {{tag}}
          </van-tag>
        </template>

        <template #num>
          <van-cell value="公开"></van-cell>
        </template>

      </van-card>
      <van-empty v-if="!postsList || postsList.length<1" description="暂无数据" />
    </van-tab>

    <van-tab>
      <template #title> <van-icon name="friends-o" color="#ee0a24"/> 圈子</template>
      <van-empty description="暂无数据" />
    </van-tab>
  </van-tabs>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import {showFailToast, showSuccessToast, Toast} from 'vant';
import myAxios from "../plugins/myAxios";
import {useRouter} from "vue-router";
import {getCurrentUser} from "../services/user";


const SearchText = ref('');
const userList = ref([]);
const postsList = ref([]);
const router = useRouter();
let currentUser;

onMounted(async () =>{
  currentUser = await getCurrentUser();
})

const onSearch = async (searchText) => {
  const res = await myAxios.get("/search/list/" + searchText);
  if (res.code === 0 && res.message === "ok"){
   userList.value = res.data.userList;
    for (let posts of res.data.postsList) {
      posts.tags = JSON.parse(posts.tags);
      if (posts.images !==""){
        posts.images = JSON.parse(posts.images);
      }
    }
   postsList.value = res.data.postsList;
   return;
  }
  showFailToast({
    message:'获取失败',
    closeOnClick: true
  });
};

const onCancel = () => {
  SearchText.value = ''
};
/**
 * 查看他人主页
 */
const searchOthers = (userId) =>{
  router.push({
    path: '/users/searchOthers',
    query: {
      userId,
    }
  })
}

/**
 * 查看文章详情
 * @param postsId
 */
const searchDetails = (postsId) =>{
  router.push({
    path:"posts/postsDetails",
    query:{
      postsId
    }
  })
}

const addFriend = async (id)=>{
  if (!currentUser){
    window.location.href = '/user/login'
  }
  const res = await myAxios.get('/friend/addFriend/' + id)
  if (res.code === 0 && res.data === "ok"){
    showSuccessToast({
      message:'发送成功',
      closeOnClick: true
    });
  }else {
    showFailToast(res.messasgee);
  }
}

</script>

<style scoped>

</style>
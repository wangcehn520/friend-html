<template>
  <van-card v-for="posts in postsList"
            style=" box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.039),
                5px 5px 6px rgba(0, 0, 0, 0.057),
                10px 9px 12px rgba(0, 0, 0, 0.07),
                18px 16px 22px rgba(0, 0, 0, 0.083),
                33px 31px 41px rgba(0, 0, 0, 0.101);
                background-color: white;"
            @click-thumb ="searchOthers(posts.userId)"
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
      <van-text-ellipsis :content="posts.content" rows="3" @click="searchDetails(posts.id)"/>
    </template>

    <template #tags>
      <van-tag plain type="danger" style="margin-right: 8px;margin-top: 8px" v-for="tag in posts.tags">
        {{tag}}
      </van-tag>
    </template>

    <template #num>
      {{posts.createTime}}
    </template>
    <template #footer>
      <van-icon
          name="like"
          :color="posts.isLike ? 'red' : 'gray'"
          class="like-icon"
          :class="{ 'liked': posts.isLike }"
      >
        {{posts.likeNumber === '0' ? '' : posts.likeNumber}}
      </van-icon>
    </template>
  </van-card>
  <van-empty v-if="!postsList || postsList.length < 1" description="暂无数据" />
</template>

<script setup>
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";
import { ref,onMounted } from 'vue';

const router = useRouter();
const postsList = ref([]);

onMounted(async ()=>{
  const postsListData = await myAxios.get('/posts/getFriendsPosts')
  if (postsListData.code === 0 && postsListData.message === "ok"){
    postsListData.data.forEach(posts =>{
      posts.tags = JSON.parse(posts.tags);
      if (posts.images !==""){
        posts.images = JSON.parse(posts.images);
      }
      let str1=posts.createTime.split("T")[0];
      let str2=posts.createTime.split("T")[1].split(".")[0];
      posts.createTime = str1 +" "+ str2;
      postsList.value = postsListData.data;
    })

  }else {
    showFailToast('获取失败');
  }

});

/**
 * 查看他人主页
 */
const searchOthers = ( userId) =>{
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
    path:"/posts/postsDetails",
    query:{
      postsId
    }
  })
}


</script>

<style scoped>

</style>
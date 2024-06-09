<template>
    <van-tabs>
      <van-tab>
        <template #title> <van-icon name="smile-o" color="#1989fa"/> 每 日 推 荐</template>
        <van-card v-for="posts in postsList"
                  style=" box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.039),
                5px 5px 6px rgba(0, 0, 0, 0.057),
                10px 9px 12px rgba(0, 0, 0, 0.07),
                18px 16px 22px rgba(0, 0, 0, 0.083),
                33px 31px 41px rgba(0, 0, 0, 0.101);
                background-color: white;"

                  @click-thumb ="searchOther(posts.userId)"
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
            <van-cell value="公开"></van-cell>
          </template>

          <template #footer>
            <van-icon
                name="like"
                :color="posts.isLike ? 'red' : 'gray'"
                class="like-icon"
                :class="{ 'liked': posts.isLike }"
                @click="likeClick(posts.id)"
            >
              {{posts.likeNumber === '0' ? '' : posts.likeNumber}}
            </van-icon>
          </template>

        </van-card>
        <van-empty v-if="!postsList || postsList.length < 1" description="暂无数据" />
      </van-tab>

      <van-tab to="/comment">
        <template #title> <van-icon name="fire-o" color="#ee0a24"/> 公 告</template>
      </van-tab>
    </van-tabs>
</template>

<script setup lang="ts">


import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {useRouter} from "vue-router";
import { ref,onMounted } from 'vue';
import {getCurrentUser} from "../plugins/MyTikenUtils";

const router = useRouter();
const postsList = ref([]);
console.log(getCurrentUser())

onMounted(async ()=>{
 const postsListData = await myAxios.get('/posts/list')
       if (postsListData.code === 0 && postsListData.data.length != 0){
         postsListData.data.forEach(posts =>{
           posts.tags = JSON.parse(posts.tags);
           if (posts.images !==""){
             posts.images = JSON.parse(posts.images);
           }
           postsList.value = postsListData.data;

         })

       }else {
         showFailToast('获取失败');
       }

});

/**
 * 查看他人主页
 */
const searchOther = ( userId:number) =>{
     router.push({
      path: '/search/searchOthers',
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

.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
.liked {
  color: red; /* 改变图标颜色为红色 */
}

.like-icon {
  font-size: 18px; /* 增大图标大小 */
}

.like-icon:not(.liked) {
  padding: 4px; /* 可根据需要调整填充 */
}

</style>
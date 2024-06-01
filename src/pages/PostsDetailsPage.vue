<template>
  <div>
    <!-- 文章封面图片 -->
    <van-grid :column-num="1" v-if="posts.images.length === 1">
      <van-grid-item v-for="value in posts.images.length" :key="value" icon="photo-o">
<!--         :src="posts.avatarUrl.includes('http') ? posts.avatarUrl : '/image/'+ posts.avatarUrl"-->
<!--         src="/image/2024-05-28\661cf914-208e-40c3-ac28-8cc475d2ac3a.jpg"-->
        <template #icon>
          <van-image
              :src="posts.images.includes('http') ? posts.images : '/image/'+ posts.images"
          />
        </template>

      </van-grid-item>
    </van-grid>

    <van-grid :column-num="2" v-if="posts.images.length === 2">
      <van-grid-item v-for="(image,value) in posts.images" :key="value" icon="photo-o">
        <!--         :src="posts.avatarUrl.includes('http') ? posts.avatarUrl : '/image/'+ posts.avatarUrl"-->
        <!--         src="/image/2024-05-28\661cf914-208e-40c3-ac28-8cc475d2ac3a.jpg"-->
        <template #icon>
          <van-image  :src="image.includes('http') ? image : '/image/'+ image">
          </van-image>
        </template>

      </van-grid-item>
    </van-grid>

    <van-grid :column-num="2" v-if="posts.images.length >= 3">
      <van-grid-item v-for="(image,value) in posts.images" :key="value" icon="photo-o">
        <!--         :src="posts.avatarUrl.includes('http') ? posts.avatarUrl : '/image/'+ posts.avatarUrl"-->
        <!--         src="/image/2024-05-28\661cf914-208e-40c3-ac28-8cc475d2ac3a.jpg"-->
        <template #icon>
          <van-image
              :src="image.includes('http') ? image : '/image/'+ image"
          />
        </template>

      </van-grid-item>
    </van-grid>
    <!-- 文章标题 -->
    <van-cell :title="posts.title" />
    <!-- 文章内容 -->
    <div class="article-content">
      <p id="content"></p>
    </div>

    <!-- 文章发布时间和作者信息 -->
    <van-cell-group>
      <van-cell @click="searchOthers(posts.userId)" title="作者" :value="posts.userName" is-link>
      </van-cell>
      <van-cell title="发布时间" :value="posts.createTime" />
      <van-cell title="标签">
        <template #value>
          <van-tag plain type="danger" style="margin-right: 8px;margin-top: 8px" v-for="tag in posts.tags">
            {{tag}}
          </van-tag>
        </template>
      </van-cell>

    </van-cell-group>

    <!-- 操作按钮 -->
    <div class="button-group">
      <van-button
          icon="like-o"
          type="primary" size="small"
          :plain="!posts.isLike"
          @click="likeClick(posts.id)"

      >
        {{!posts.isLike ? '点赞' : '取消点赞'}} {{posts.likeNumber === '0' ? '' : posts.likeNumber}}
      </van-button>
      <van-button
          icon="star-o"
          type="primary" size="small"
          plain
          @click="showTest(posts.id)"
      >
        分享
      </van-button>
    </div>

    <div class="comment-section">
      <div class="input-container">
        <van-field v-model="newComment" placeholder="恶语伤人心，请谨言慎行....." />
        <van-button type="primary" @click="submitComment">评论</van-button>
      </div>
      <van-list>
        <van-cell-group>
          <div
              v-for="(comment, index) in comments"
              :key="index"
              class="comment"
          >
            <van-image
                :src="comment.avatarUrl"
                width="40px"
                height="40px"
                round
                class="avatar"
                @click="searchOthers(comment.userId)"
            />
            <div class="comment-content">
              <div class="author">{{ comment.author }}</div>
              <div class="text">{{ comment.comment }}</div>
            </div>
          </div>
        </van-cell-group>
        <van-empty v-if="!comments || comments.length < 1" description="暂未评论" />
      </van-list>
    </div>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {showFailToast, showSuccessToast} from "vant";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";


let posts =ref({
  id: '',
  title: '',
  content: '',
  images: [],
  tags: [],
  likeNumber: '',
  avatarurl: '',
  userName: '',
});
let comments= ref([]);
let commentPage = {
  userId:'',
  avatarUrl:'',
  author:'',
  postsId:'',
  comment:'',
}
let postsId = 0;
const route = useRoute();
const router = useRouter();
let newComment =  '';


onMounted(async ()=>{
  postsId = route.query.postsId;
  commentPage.postsId = postsId;
  const postsListData = await myAxios.get('/posts/getById/' + postsId)
  const commentsList = await myAxios.get("/posts/getComment/" + postsId);
    if (postsListData.code === 0 && postsListData.message ==="ok" ){

      postsListData.data.tags = JSON.parse(postsListData.data.tags);
      if (postsListData.data.images !== ""){
        postsListData.data.images = JSON.parse(postsListData.data.images);
      }
      let str1=postsListData.data.createTime.split("T")[0];
      let str2=postsListData.data.createTime.split("T")[1].split(".")[0];
      postsListData.data.createTime = str1 +" "+ str2;
      postsListData.data.content=postsListData.data.content.replace(/\n/g, '<br>');
      document.getElementById('content').innerHTML = postsListData.data.content;
      postsListData.data.avatarUrl = postsListData.data.avatarUrl.includes('http') ? postsListData.data.avatarUrl : '/image/'+ postsListData.data.avatarUrl;
      posts.value = postsListData.data;
     if (postsListData.code === 0 && postsListData.message ==='ok'){
       for (let comments of commentsList.data) {
         let str3 = comments.createTime.split("T")[0];
         let str4 = comments.createTime.split("T")[1].split(".")[0];
         comments.createTime = str3 +" "+ str4;
         comments.avatarUrl = comments.avatarUrl.includes('http') ? comments.avatarUrl : '/image/'+ comments.avatarUrl;
       }
       comments.value = commentsList.data;
     }
    }else {
      showFailToast("获取失败");
    }
});

/**
 * 点赞功能
 */
const likeClick= async (postsId) => {
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
    return;
  }
  const res = await myAxios.get("/posts/like/" + postsId);
  if (res.code === 0 && res.message === "ok"){
    //可优化
    const postsListData = await myAxios.get('/posts/getById/'+ postsId)
    if (postsListData.code === 0 && postsListData.data.length !== null){
      postsListData.data.tags = JSON.parse(postsListData.data.tags);
        if (postsListData.data.images !==""){
          postsListData.data.images = JSON.parse(postsListData.data.images);
        }
        posts.value = postsListData.data;
        isPlain.value =  !posts.isLike;
    }else {
      showFailToast('获取失败');
    }
    showSuccessToast("点赞成功");

  }else {
    showFailToast("点赞失败");
  }
}

/**
 * 分享
 */
const showTest = () =>{

}


/**
 * 评论功能
 */
const submitComment = async () => {
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
    return;
  }
  if (newComment.trim() === '') {
    showFailToast('评论不能为空');
    return;
  }
  const res = await myAxios.post("/posts/comment",{
    userId: currentUser.id,
    avatarUrl: currentUser.avatarUrl,
    author:  currentUser.username,
    postsId: commentPage.postsId,
    comment: newComment,
  });
  commentPage.author = currentUser.username;
  commentPage.userId = currentUser.id;
  commentPage.avatarUrl = currentUser.avatarUrl.includes('http') ? currentUser.avatarUrl : '/image/'+ currentUser.avatarUrl;
  commentPage.comment = newComment;
  comments.value.push(commentPage);
  this.newComment = '';


}

/**
 * 看出他人主页
 * @returns {Promise<void>}
 */
const searchOthers = (userId) =>{
   router.push({
    path: '/users/searchOthers',
    query: {
      userId,
    }
  })
}
</script>

<style>
.article-content {
  padding: 16px;
  line-height: 1.6;
}

.button-group {
  display: flex;
  justify-content: space-around;
  padding: 16px;
}
.comment-section {
  padding: 16px;
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.van-field {
  flex: 1;
}

.van-button {
  margin-left: 8px;
}

.comment {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.avatar {
  margin-right: 8px;
}

.comment-content {
  display: flex;
  flex-direction: column;
  max-width: calc(100% - 48px);
}

.author {
  font-weight: bold;
  margin-bottom: 4px;
}

.text {
  color: #606266;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>

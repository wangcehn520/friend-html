<template>
  <div class="image-container">
    <van-popover v-model:show="showPopover" :actions="actions" @select="onSelect">
      <template #reference>
  <van-image
      round
      width="100px"
      height="100px"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"

  />
      </template>
    </van-popover>
  </div>


</template>

<script setup>
import { ref } from 'vue';
import { showImagePreview } from 'vant';

const search = () =>{
  showImagePreview({
    images:['/image/2024-05-28\\17c9649e-f47a-4ed3-b837-5cb49b97152d.jpg'],
    showIndex:false,
  });
}
let isLiked = ref(false);
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const showPopover = ref(false);

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: '查看头像' },
  { text: '修改头像' },
];

const onSelect = (actions) => {
  // if (actions.text === '查看头像'){
  //   search();
  // }
  search();
}
</script>

<style scoped>
.liked {
  color: red; /* 改变图标颜色为红色 */
}

.like-icon {
  font-size: 10px; /* 增大图标大小 */
}

.like-icon:not(.liked) {
  padding: 4px; /* 可根据需要调整填充 */
}

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







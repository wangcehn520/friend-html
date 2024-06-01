<template>
  <van-form @submit="onSubmit1">
    <van-cell-group inset >
      <van-field
          v-model="RefData.title"
          label-width="50px"
          name="title"
          label="标题"
          placeholder="请输入标题"
          :rules="[{ required: true, message: '请填写标题' }]"
      />
      <van-field
          label="内容"
          label-width="50px"
          v-model="RefData.content"
          rows="4"
          name="content"
          autosize
          type="textarea"
          maxlength="500"
          placeholder="请输入内容"
          :rules="[{ required: true, message: '请输入内容' }]"
          show-word-limit
      />
      <van-field name="uploader" label="上传图片" >
        <template #input>
          <van-uploader v-model="arrayImages" max-count="9" preview-size="60" :after-read="afterRead"/>
        </template>
      </van-field>
      <van-field
          label="标签"
          label-width="50px"
          v-model="RefData.tags"
          rows="2"
          name="tags"
          autosize
          type="textarea"
          maxlength="30"
          placeholder="请输入标签，标签与标签之间用英文’,‘分隔."
          :rules="[{ required: true, message: '请输入内容' }]"
          show-word-limit
      />
      <van-field name="authority" label="权限" preview-size="40px">
        <template #input>
          <van-radio-group v-model="RefData.authority" direction="horizontal">
            <van-radio name="1">公开</van-radio>
            <van-radio name="2">仅好友可见</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        发布
      </van-button>
    </div>
  </van-form>


</template>

<script setup>
import { ref } from 'vue';
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
const initData = {
  title:'',
  content:'',
  images:'',
  tags:'',
  authority:'1',
}

let arrayImages = ref([]);
let resultImages = [];
const RefData = ref({...initData});

const afterRead = async (file) => {
  const files = Array.isArray(file) ? file : [file];
  files.forEach((item) => {
    // 这里可以添加你的上传逻辑，比如使用 FormData 上传
    const formData = new FormData();
    formData.append('file', item.file);
    uploadFile(formData);
  });
}

const uploadFile = async (formData) =>{
  const res = await  myAxios.post('/upload/file',formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res.code === 0 && res.message === 'ok'){
    resultImages.push(res.data);
    showSuccessToast({
      message:'上传成功',
      closeOnClick: true
    });
  }else {
    showFailToast('上传失败');
  }
}

const onSubmit1 = async () =>{
    RefData.value.images = resultImages.toString();
   const result = await myAxios.post('/posts/add',RefData.value);
   if (result.code === 0 && result.data === "ok"){
     showSuccessToast({
       message:'发布成功',
       closeOnClick: true
     });
     window.location.href = '/';
   }else {
     showFailToast('发布失败');
   }
}


</script>

<style scoped>

</style>
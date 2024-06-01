<template>
  <van-form @submit="onSubmit" >
    <van-uploader v-model="fileList" multiple max-count="1" style="left: 40%" :after-read="afterRead"/>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>

</template>

<script lang="ts" setup>
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from '../plugins/myAxios.js'
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user";

const router =useRouter();
const route = useRoute();


const fileList = ref([{url: route.query.currentValue}]);
const afterRead = (file) =>{
  console.log(file)
  const formData = new FormData();
  formData.append('file', file.file);
  myAxios.post('/upload/file',formData,{
      headers: {
    'Content-Type': 'multipart/form-data'
  }
})
}

const onSubmit = async () => {

  let currentUser = await getCurrentUser();

};


</script>

<style scoped>

</style>
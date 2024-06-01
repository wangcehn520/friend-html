<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset >
      <van-field name="avatarUrl" >
        <template #input>
          <van-uploader  v-model="registerData.avatarUrl" max-count="1"
                         :after-read="afterRead" upload-text="点击上传头像" preview-size="120"
                         style="left: 30%;"

          />
        </template>

      </van-field>

      <van-field
          v-model="registerData.username"
          label-width="60px"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填输入用户名' }]"
      />
      <van-field
          v-model="registerData.userAccount"
          label-width="60px"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填输入账号' }]"
      />
      <van-field
          v-model="registerData.email"
          label-width="60px"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱，可以为空"
          :rules="[{ required: true, message: '请填输入账号' }]"
      />
      <van-field
          v-model="registerData.phone"
          label-width="60px"
          name="phone"
          label="手机号"
          placeholder="请输入手机号，可以为空"
      />
      <van-field name="gender" label="性别"  label-width="60px">
        <template #input>
          <van-radio-group v-model="registerData.gender" direction="horizontal">
            <van-radio name="1">男</van-radio>
            <van-radio name="0">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-field
          v-model="registerData.userPassword"
          label-width="60px"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填输入密码' }]"
      />
      <van-field
          v-model="registerData.truePassword"
          label-width="60px"
          name="truePassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[{ required: true, message: '请再次输入密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
    </div>
  </van-form>
</template>

<script setup>
import {ref} from 'vue';
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
const initData = {
  username:'',
  userAccount :'',
  userPassword:'',
  avatarUrl:[],
  gender:'1',
  phone:'',
  email:'',
  truePassword:'',
}
let imagesUrl = '';

const registerData = ref({...initData})
const onSubmit = async () =>{
  registerData.value.avatarUrl = imagesUrl;

   const res = await myAxios.post('/user/register',registerData.value)
    if (res.code === 0 && res.data === "ok"){
      window.location.href = '/user/login';
      showSuccessToast("注册成功");
    }
  showFailToast(res.messsage);
}


const afterRead = async (file) => {
  const formData = new FormData();
  formData.append('file', file.file);
   const res = await  myAxios.post('/upload/file',formData,{
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  if (res.code === 0 && res.message === 'ok'){
    imagesUrl = res.data;
    showSuccessToast('上传成功');
  }else {
    showFailToast('上传失败');
  }
}



</script>

<style scoped>

</style>
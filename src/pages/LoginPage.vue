<template>

<!--  style="justify-content: center;margin-top: 10%; margin-bottom: 10%; box-sizing: border-box;"-->
<div  class="image-container">
  <van-image justify="center"
             round
             width="10rem"
             height="10rem"
             src="../public/image/4.jpg"
  />
</div>
  <van-form @submit="onLogin">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit" style="margin-bottom: 10px">
        登录
      </van-button>
      <van-cell title="" to="/users/register" value="还没有账号？点击注册"></van-cell>
    </div>

  </van-form>



</template>

<script setup>
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import { useGlobalState } from '../plugins/globalState';
const userAccount = ref('');
const userPassword = ref('');
const { globalVariable, setGlobalVariable } = useGlobalState();
const onLogin = async () =>{
  const response=await myAxios.post("/user/login",{
    userAccount:userAccount.value,
    userPassword:userPassword.value,
  })
  if (response.code === 0 && response.data != ''){
    showSuccessToast({
      message:'登录成功',
      closeOnClick: true
    });
    setGlobalVariable(1);
    window.location.href ='/';
  }else {
    showFailToast('登录失败');
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
  margin-top: 10%;
  margin-bottom: 10%;
  box-sizing: border-box; /* 确保边框包含在宽高计算内 */
}
</style>
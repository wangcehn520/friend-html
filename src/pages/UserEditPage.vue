<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="editUser.currentValue"
          :name="editUser.editKey"
          :label="editUser.label"
          :placeholder="editUser.label"
      />


    </van-cell-group>
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
const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  label: route.query.editName,
});



const onSubmit = async () => {
  let currentUser = await getCurrentUser();
  if (editUser.value.editKey === "gender"){
    editUser.value.currentValue = editUser.value.currentValue === "男" ? "1" : "0";
  }
  const res = await myAxios.post('/user/update', {
    'id': currentUser.id,
    [editUser.value.editKey]: editUser.value.currentValue,
  })
   if (res.code === 0){
     history.back();
   }
};


</script>

<style scoped>

</style>
<template>
<div id="scrollbox">

</div>
<div class="chat-input"  >
    <van-field v-model="inputValue"
               placeholder="请输入消息"
               rows="1"
               style="overflow-y: auto;"
               show-word-limit
    />

    <van-button style="width: 80px;height: 40px;" type="primary" size="normal" @click="send" >发送</van-button>
  </div>
</template>

<script setup>
import { ref,onMounted,nextTick } from 'vue';
import {getCurrentUser} from "../services/user";
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios";

/**
 * 前端传给后端的信息数据包
 * @type {{avatarUrl: string, fromUserId: string, author: string, type: string, toUserId: string, content: string}}
 */
const messagePage = {
  toUserId:'',
  fromUserId:'',
  type:'',
  content: '',
  author:'',
  avatarUrl:'',
}

const messages = ref([]);

const inputValue = ref('');
const route = useRoute();
let sid = 0;
let websocket = null;
let meId = '';

onMounted(async () => {
  let currentUser = await getCurrentUser();
  if (!currentUser){
    window.location.href = '/user/login'
    return;
  }
  meId =currentUser.id;
  messagePage.fromUserId = currentUser.id;
  messagePage.toUserId = route.query.friendId;
  messagePage.author = currentUser.username;
  messagePage.avatarUrl = currentUser.avatarUrl;
  messagePage.type = 1;
  sid=currentUser.id;
  const friendId = messagePage.toUserId;
  const res = await myAxios.get("/chat/message/"+ friendId);
  for (let datum of res.data) {
    messages.value.push(JSON.parse(datum));
  }
  init();
  setMessageInnerHTML(messages.value)
})

 const init = async () =>{
   websocket = new WebSocket("ws://localhost:8101/api/ws/" + sid);;

//连接发生错误的回调方法
   websocket.onerror = function(){
     console.log("连接错误");
   };

//连接成功建立的回调方法
   websocket.onopen = function(event){
     console.log("ok")
   }

//接收到消息的回调方法
   websocket.onmessage = function(event){
    //  console.log(event.data)
    // messages.value.push(JSON.parse(event.data));
    //  console.log(messages.value)

   }

//连接关闭的回调方法
   websocket.onclose = function(){
     console.log("连接关闭");
   }

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
   window.onbeforeunload = function(){
     websocket.close();
   }



//关闭连接
   function closeWebSocket(){
     websocket.close();
   }
 }

//将消息显示在网页上
function setMessageInnerHTML(innerHTML) {
  console.log(meId)
  console.log(innerHTML)
  let html = '';
  if (Array.isArray(innerHTML)) {
    for (let innerHTMLElement of innerHTML) {
      if (innerHTMLElement.fromUserId === meId) {
        html += `
    <div class="message self" >
    <div class="myInfo info" >
      <img class="avatar"  :alt=${innerHTMLElement.author}  src='/image/2024-05-25/0a3ae1c1-79fa-4715-9c56-4378cef9f37d.jpg'>
    </div>
        <p class="text" >${innerHTMLElement.content}</p>
    </div>
`
      } else {
        html += `
    <div class="container">
    <img src="/image/2024-05-25/0a3ae1c1-79fa-4715-9c56-4378cef9f37d.jpg"  class="avatar">
    <div class="text-content">
    <div class="nickname">${innerHTMLElement.author}</div>
    <p class="text">${innerHTMLElement.content}</p>
    </div>
</div>
`
      }
    }
  }else {
    html += `
    <div class="message self" >
    <div class="myInfo info" >
      <img class="avatar"  :alt=${innerHTML.author}  src='/image/2024-05-25/0a3ae1c1-79fa-4715-9c56-4378cef9f37d.jpg'>
    </div>
        <p class="text" >${innerHTML.content}</p>
    </div>
`
  }
  document.getElementById('scrollbox').innerHTML += html;
  nextTick(() => {
    const scrollbox = document.getElementById('scrollbox');
    scrollbox.scrollTop = scrollbox.scrollHeight;
  });
}

//发送消息
  function send(){
    if (inputValue.value.trim()) {
     messagePage.content=inputValue.value;
      websocket.send(JSON.stringify(messagePage));
      setMessageInnerHTML(JSON.parse(JSON.stringify(messagePage)));
     inputValue.value = '';
    }


}



</script>

<style>
@import "../assets/css/chat.css";

#scrollbox {
  display: flex;
  flex-direction: column;
  height: 76vh;
  width: 100%;
  overflow-y: scroll;
}
.chat-message-list {
  flex: 1;
  overflow-y: scroll;
}
.chat-input {
  position: sticky;
  display: flex;
  align-items: center;
  padding: 10px;

}
.chat-input van-field {
  flex: 1;
  margin-right: 10px;
}

.container {
  display: flex;
  align-items: center; /* 垂直方向居中对齐 */
  margin: 10px 10px;
}
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px; /* 给头像和文本之间添加一些间距 */
}
.text {
  padding: 10px;
  border-radius: 10px;
  background-color: #eee;
  word-wrap: break-word;
  word-break: break-all;
  max-width: 230px; /* 设置文本框的最大宽度 */
  margin-bottom: 2px;
}
.nickname {
  /*font-weight: normal; !* 设置昵称的字体加粗 *!*/
  margin-bottom: -10px; /* 给昵称和文本之间添加一些间距 */
  font-size: 14px;
}
.text-content {
  display: flex;
  flex-direction: column; /* 使昵称和文本在垂直方向上排列 */
}
</style>

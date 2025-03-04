<template>
  <p>{{ bot_info.bot_name }}</p>
  <div class="chat-box" v-loading="loading">
    <!-- 聊天消息展示区域 -->
    <div class="chat-messages" id="message_box">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="{
          'self-message': message.role == 'user',
          'other-message': message.role != 'user',
        }"
      >
        <span>{{ message.content }}</span>
      </div>
    </div>
    <!-- 输入框和发送按钮 -->
    <div class="chat-input">
      <el-input
        v-model="inputMessage"
        placeholder="请输入消息"
        @keyup.enter="sendMessage"
        @disabled="input_box_disable"
      ></el-input>
      <el-button @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import { type Message } from "../model";
import { useStore } from "vuex";
import axios from "axios";
import { url, api_config, add_query_data } from "../api";
import { validateResponse } from "../utils";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const props = defineProps({
  bot_info: {
    type: Object,
    required: true,
  },
});
const store = useStore();
const conversation_id = ref("");
// 存储聊天消息的数组
const loading = ref(true);
const input_box_disable = ref(false);

const messages = ref<Message[]>([
  {
    bot_id: "737363834493434****",
    chat_id: "747363834493434****",
    content: "智能体对接完成",
    content_type: "text",
    conversation_id: "737363834493434****",
    created_at: 1,
    id: "737363834493437****",
    meta_data: {},
    role: "bot",
    type: "",
    updated_at: "1716809829",
    section_id: "",
  },
]);

// 监听messages的变化，更新滚动条位置
watch(
  messages,
  (value) => {
    nextTick(() => {
      var message = document.getElementById("message_box");
      console.log(value.length);
      if (message != null) {
        message.scrollTop = message.scrollHeight;
        console.log(message.scrollTop);
        console.log(message.scrollHeight);
      }
    });
  },
  {
    deep: true,
  }
);

const base_message_model: Message = {
  bot_id: props.bot_info.bot_id,
  chat_id: "0",
  content: "",
  content_type: "text",
  conversation_id: conversation_id.value,
  created_at: 0,
  id: "",
  role: "user",
  type: "question",
  updated_at: "",
  meta_data: {},
  section_id: "0",
};
// 存储用户输入的消息
const inputMessage = ref("");

// 发送消息的方法，调用一次智能体的对话api
// axios 基于 XMLHttpRequest是不支持流式的，流式请求使用 fetch
const sendMessage = async () => {
  if (inputMessage.value.trim()) {
    input_box_disable.value = true;
    console.log("send message");
    let new_user_messgae: Message = {
      bot_id: props.bot_info.bot_id,
      chat_id: "0",
      content: "",
      content_type: "text",
      conversation_id: conversation_id.value,
      created_at: 0,
      id: "",
      role: "user",
      type: "question",
      updated_at: "",
      meta_data: {},
      section_id: "0",
    };
    new_user_messgae.content = inputMessage.value;
    inputMessage.value = "";
    messages.value.push(new_user_messgae);
    let new_assistant_message_index = -1;
    await fetchEventSource(
      add_query_data(url.chat, { conversation_id: conversation_id.value }),
      {
        method: "POST",
        headers: api_config.headers,
        body: JSON.stringify({
          bot_id: props.bot_info.bot_id,
          user_id: "114514",
          stream: true,
          additional_messages: [
            {
              role: "user",
              content: new_user_messgae.content,
              content_type: "text",
            },
          ],
        }),

        async onmessage(ev) {
          // ev.data里面是实时传递过来的数据
          // 根据后端返回的数据，我这里需要将字符串转成对象

          let obj = JSON.parse(ev.data);
          // 拿到具体的内容
          console.log(ev);
          // console.log(obj.content);
          if (ev.event != "conversation.message.completed") {
            if (obj.role === "assistant" && obj.type === "answer") {
              if (new_assistant_message_index == -1) {
                let new_ai_message: Message = { ...base_message_model };
                new_ai_message.bot_id = obj.bot_id;
                new_ai_message.chat_id = obj.chat_id;
                new_ai_message.content = obj.content;
                new_ai_message.content_type = "text";
                new_ai_message.conversation_id = obj.conversation_id;
                new_ai_message.id = obj.id;
                new_ai_message.role = obj.role;
                new_ai_message.section_id = obj.section_id;
                new_ai_message.type = obj.type;
                messages.value.push(new_ai_message);
                new_assistant_message_index = messages.value.length;
                console.log(messages.value);
              } else {
                console.log("add new content");
                messages.value[new_assistant_message_index - 1].content +=
                  obj.content;
              }
            }
          }
        },
        //会话发送完毕时触发
        onclose() {
          console.log("on close");
          input_box_disable.value = false;
          // 这里可以写结束时，你需要做的事，如果没有，可以删除
        },
      }
    );
  }
};

onMounted(() => {
  // 加载页面
  console.log(props.bot_info);
  console.log(store.getters.get_latest_conversation_id(props.bot_info.bot_id));
  conversation_id.value = store.getters.get_latest_conversation_id(
    props.bot_info.bot_id
  );
  if (conversation_id.value === undefined) {
    axios.post(url.conversation_created, {}, api_config).then((response) => {
      if (validateResponse(response)) {
        store.commit("update_bot_conversation_map", {
          bot_id: props.bot_info.bot_id,
          conversation_id: response.data.data.id,
        });
        conversation_id.value = response.data.data.id;
        loading.value = false;
        console.log(response.data);
      } else {
        console.error(response.data.msg);
      }
    });
  } else {
    // 存在conversation, 获取其历史消息
    axios
      .post(
        add_query_data(url.message_list, {
          conversation_id: conversation_id.value,
        }),
        { order: "desc" },
        api_config
      )
      .then((response) => {
        if (validateResponse(response)) {
          console.log(response.data);
          for (let i = response.data.data.length - 1; i >= 0; i--) {
            messages.value.push(response.data.data[i]);
          }
        } else {
          console.error(response.data.msg);
        }
      });
    loading.value = false;
  }
});
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 70vh;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 10px;
  /* max-width: 500px; 根据需要调整最大宽度 */
  margin: 0 auto; /* 居中显示 */
}

.self-message,
.other-message {
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 70%; /* 设置最大宽度 */
  word-wrap: break-word;
  line-height: 1.5;
}

.self-message {
  background-color: #e0f7fa;
  align-self: flex-end; /* 向左对齐 */
  border: 1px solid #b2ebf2;
}

.other-message {
  background-color: #f1f8e9;
  align-self: flex-start; /* 向右对齐 */
  border: 1px solid #c8e6c9;
}

.self-message span,
.other-message span {
  display: inline-block;
  max-width: 100%;
  overflow-wrap: break-word;
}

.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ccc;
}

.chat-input el-input {
  flex: 1;
  margin-right: 10px;
}
</style>

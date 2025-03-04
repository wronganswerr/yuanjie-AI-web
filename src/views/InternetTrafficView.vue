<template>
  <div
    class="common-layout"
    style="
      min-height: 600px;
      background-color: white;
      border-style: solid;
      border-width: 1px;
    "
  >
    <el-container>
      <el-container>
        <el-aside
          width="20%"
          style="
            background-color: gray;
            text-align: center;
            padding-top: 20px;
            padding-left: 10px;
            padding-right: 10px;
            min-height: 600px;
          "
        >
          <el-card
            v-for="(i, index) in SpaceBotsArray"
            :key="index"
            style="margin: 10px; margin: 0px; background-color: white"
            @click="ChooseBot(index)"
          >
            <p>{{ i.bot_name }}</p>
          </el-card>
          <!-- 暂时使用按钮代替 -->
        </el-aside>
        <el-container>
          <el-main>
            <ChatBox
              v-if="been_choosed_bot_index >= 0"
              :bot_info="SpaceBotsArray[been_choosed_bot_index]"
            ></ChatBox>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { url, api_config, add_query_data } from "../api";
import { validateResponse } from "../utils";
import ChatBox from "../components/ChatBox.vue";
import { type SpaceBots } from "../model";

const SpaceBotsArray = ref<SpaceBots[]>([]);
const been_choosed_bot_index = ref(-1);
const space_id_list: Array<string> = [
  "7471540524902596608",
  "7445190888428732451",
  "7474519955556679699",
  "7473377751219863602",
];
onMounted(() => {
  for (let i = 0; i < space_id_list.length; i++) {
    axios
      .get(
        add_query_data(url.get_bot_list, { space_id: space_id_list[i] }),
        api_config
      )
      .then((response) => {
        console.log(response);
        if (validateResponse(response)) {
          SpaceBotsArray.value = response.data.data.space_bots;
          // been_choosed_bot_id.value = SpaceBotsArray.value[0].bot_id;
          been_choosed_bot_index.value = 0;
          console.log(SpaceBotsArray.value[0]);
        } else {
          console.error(response.data.msg);
        }
      });
  }
});

const ChooseBot = (index: number) => {
  console.log(index);
  been_choosed_bot_index.value = index;
};
</script>

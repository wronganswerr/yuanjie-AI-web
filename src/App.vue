<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-menu
          id="1"
          mode="horizontal"
        >
          <div style="padding: 10px">
            <p style="font-size: 20px; font-weight: 900; margin: 10px">元界AI</p>
          </div>
          <el-menu-item index="/">
            <router-link to="/" class="no-underline"
              ><strong> 首页 </strong>
            </router-link>
          </el-menu-item>
          <el-menu-item index="/internet_traffic">
            <router-link to="/internet_traffic" class="no-underline"
              ><strong>流量</strong>
            </router-link>
          </el-menu-item>
          <el-menu-item index="/sale">
            <router-link to="/sale" class="no-underline"
              ><strong>销售</strong>
            </router-link>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-container>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import { useStore } from "vuex";
const store = useStore();
onMounted(() => {
  console.log('app init');
  store.commit('init_bot_conversation_map');
})
</script>


<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

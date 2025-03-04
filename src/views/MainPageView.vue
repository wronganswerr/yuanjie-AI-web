<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const url = ref("https://lhc-blog-use.oss-cn-beijing.aliyuncs.com/blog/2023202412142327834.png");
</script>

<template>
  <div class="bottom">
    <img :src="url" alt="loding img failed" />
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
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
.bottom {
  width: 100%;
  /* height: 100%; */
  height: 90vh;
  /* background-color: black; */
  /* overflow: hidden; */
  /* text-align: center; */
  border: 1px var(--el-border-color);
  border-radius: 0;
}
img {
  width: 95%;
  height: 90%;
  object-fit: contain;
}
</style>

<script setup>
import { RouterView, useRouter } from 'vue-router';
import { watch } from 'vue';
import { useUserInfo } from './stores/userInfo';

const userInfo = useUserInfo();
const router = useRouter();

watch(
  () => userInfo.user?.empId,
  (newVal) => {
    if (!newVal && router.currentRoute.value.path !== '/login') {
      alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
      router.push('/login');
    }
  },
  { immediate: true }
);
</script>

<template>
    <RouterView />
</template>

<style>
body {
    -ms-overflow-style: none;
}
body::-webkit-scrollbar {
    display: none;
}
</style>

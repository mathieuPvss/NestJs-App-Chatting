<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <div class="h-screen w-screen">
    <Toaster />
    <RouterView />
  </div>
</template>

<style scoped></style>

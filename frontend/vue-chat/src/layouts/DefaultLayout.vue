<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <SidebarProvider>
    <AppSidebar>
      <main class="bg-gradient-to-b from-gray-50 to-gray-100 h-screen">
        <SidebarTrigger />
        <RouterView />
      </main>
    </AppSidebar>
  </SidebarProvider>
</template>

<style scoped>
/* Styles spécifiques au layout si besoin */
</style>

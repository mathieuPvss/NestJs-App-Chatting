<script setup lang="ts">
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'
import { Home, Users } from 'lucide-vue-next'
import AppFooterSidebar from './AppFooterSidebar.vue'

const items = [
  {
    title: 'Accueil',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Amis',
    url: '/friends',
    icon: Users,
  },
]

const user = useAuthStore().user
</script>

<template>
  <div class="flex h-screen w-full">
    <Sidebar>
      <SidebarHeader>
        <div class="flex items-center gap-2">
          <img src="../assets/logo.jpg" alt="Logo" class="w-10 h-10 rounded-lg aspect-square" />
          <h1 class="text-2xl font-bold">PingUp</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton asChild>
                  <a :href="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <AppFooterSidebar v-if="user" :user="user" />
      </SidebarFooter>
    </Sidebar>

    <div class="flex-1 overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

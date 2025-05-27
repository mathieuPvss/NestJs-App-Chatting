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
import {
  Home,
  Users,
  MessageSquare,
  UserPlus,
  UserCheck,
  Group as GroupIcon,
} from 'lucide-vue-next'
import AppFooterSidebar from './AppFooterSidebar.vue'
import { ref, onMounted } from 'vue'
import { ChevronUp } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { friendshipService, type GetAllFriendsResponse } from '@/services/friendshipService'
import { groupService } from '@/services/groupService'
import type { Group } from '@/models/Group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus } from 'lucide-vue-next'

const activeMenu = ref<string | null>(null)

const toggleMenu = (menuName: string) => {
  activeMenu.value = activeMenu.value === menuName ? null : menuName
}

const friendAvatar = ref('https://randomuser.me/api/portraits/men/1.jpg')

const groups = ref<Group[]>([])
const conversations = ref<GetAllFriendsResponse[]>([])

const user = useAuthStore().user

onMounted(async () => {
  try {
    const [friends, userGroups] = await Promise.all([
      friendshipService.getAllFriends(),
      groupService.getUserGroups(),
    ])
    conversations.value = friends
    groups.value = userGroups
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  }
})
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
              <!-- Accueil -->
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <RouterLink to="/home" class="flex items-center gap-2">
                    <Home class="w-5 h-5" />
                    <span>Accueil</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <!-- Menu Amitiés -->
              <SidebarMenuItem>
                <SidebarMenuButton
                  @click="toggleMenu('friends')"
                  class="flex items-center justify-between w-full"
                >
                  <div class="flex items-center gap-2">
                    <Users class="w-5 h-5" />
                    <span>Amitiés</span>
                  </div>
                  <ChevronUp
                    class="w-4 h-4 transform transition-transform"
                    :class="{ 'rotate-180': activeMenu === 'friends' }"
                  />
                </SidebarMenuButton>
                <div v-if="activeMenu === 'friends'" class="pl-6 space-y-2 mt-2">
                  <RouterLink
                    to="/friends"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <UserCheck class="w-4 h-4" />
                    <span>Mes amis</span>
                  </RouterLink>
                  <RouterLink
                    to="/new-friends-request"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <UserPlus class="w-4 h-4" />
                    <span>Demandes d'amis</span>
                  </RouterLink>
                  <RouterLink
                    to="/my-friends-request"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <UserPlus class="w-4 h-4" />
                    <span>Mes demandes</span>
                  </RouterLink>
                </div>
              </SidebarMenuItem>

              <!-- Menu Groupes -->
              <SidebarMenuItem>
                <SidebarMenuButton
                  @click="toggleMenu('groups')"
                  class="flex items-center justify-between w-full"
                >
                  <div class="flex items-center gap-2">
                    <GroupIcon class="w-5 h-5" />
                    <span>Groupes</span>
                  </div>
                  <ChevronUp
                    class="w-4 h-4 transform transition-transform"
                    :class="{ 'rotate-180': activeMenu === 'groups' }"
                  />
                </SidebarMenuButton>
                <div v-if="activeMenu === 'groups'" class="pl-6 space-y-2 mt-2">
                  <RouterLink
                    to="/new-group"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Plus class="w-4 h-4" />
                    <span>Nouveau groupe</span>
                  </RouterLink>
                  <RouterLink
                    v-for="group in groups"
                    :key="group.id"
                    :to="'/group-chat/' + group.id"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Avatar>
                      <AvatarFallback>{{ group.name.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <span>{{ group.name }}</span>
                  </RouterLink>
                </div>
              </SidebarMenuItem>

              <!-- Menu Messages -->
              <SidebarMenuItem>
                <SidebarMenuButton
                  @click="toggleMenu('messages')"
                  class="flex items-center justify-between w-full"
                >
                  <div class="flex items-center gap-2">
                    <MessageSquare class="w-5 h-5" />
                    <span>Messages</span>
                  </div>
                  <ChevronUp
                    class="w-4 h-4 transform transition-transform"
                    :class="{ 'rotate-180': activeMenu === 'messages' }"
                  />
                </SidebarMenuButton>
                <div v-if="activeMenu === 'messages'" class="pl-6 space-y-2 mt-2">
                  <RouterLink
                    v-for="conv in conversations"
                    :key="conv.friendshipId"
                    :to="'/chat/' + conv.friend.id"
                    class="flex items-center gap-2 text-sm hover:text-primary"
                  >
                    <Avatar>
                      <AvatarImage :src="friendAvatar" />
                      <AvatarFallback>{{ conv.friend.username.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <span>{{ conv.friend.username }}</span>
                  </RouterLink>
                </div>
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

<style scoped>
.transform {
  transition: transform 0.2s ease-in-out;
}
</style>

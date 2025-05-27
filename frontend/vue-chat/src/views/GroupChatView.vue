<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Group } from '@/models/Group'
import type { GroupMessage } from '@/models/GroupMessage'
import { chatService } from '@/services/chatService'
import { groupMessageService } from '@/services/groupMessageService'
import { groupService } from '@/services/groupService'
import { useAuthStore } from '@/stores/auth'
import { Settings, X } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { friendshipService } from '@/services/friendshipService'
import router from '@/router'

const route = useRoute()
const groupId = ref(route.params.groupId as string)
const authStore = useAuthStore()
const userId = authStore.user?.id

const group = ref<Group | null>(null)
const messages = ref<GroupMessage[]>([])
const newMessage = ref('')
const isOwner = ref(false)
const searchQuery = ref('')
const friendsList = ref<{ id: string; username: string }[]>([])
const searchResults = ref<{ id: string; username: string }[]>([])
const isLoading = ref(false)

function formatTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  chatService.sendGroupMessage({ groupId: groupId.value, content: newMessage.value })
  newMessage.value = ''
}

const loadFriends = async () => {
  try {
    const friends = await friendshipService.getAllFriends()
    friendsList.value = friends.map((friend) => ({
      id: friend.friend.id,
      username: friend.friend.username,
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des amis:', error)
    toast.error('Impossible de charger la liste des amis')
  }
}

const searchUsers = () => {
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  const query = searchQuery.value.toLowerCase()
  searchResults.value = friendsList.value.filter(
    (friend) =>
      friend.username.toLowerCase().includes(query) &&
      !group.value?.members?.some((member) => member.id === friend.id),
  )
}

const addMember = async (user: { id: string; username: string }) => {
  try {
    await groupService.addMember(groupId.value, user.id)
    const updatedGroup = await groupService.getGroupById(groupId.value)
    group.value = updatedGroup
    toast.success(`${user.username} a été ajouté au groupe`)
  } catch (error) {
    console.error("Erreur lors de l'ajout du membre:", error)
    toast.error("Impossible d'ajouter le membre")
  }
  searchQuery.value = ''
  searchResults.value = []
}

const removeMember = async (userId: string) => {
  try {
    await groupService.removeMember(groupId.value, userId)
    const updatedGroup = await groupService.getGroupById(groupId.value)
    group.value = updatedGroup
    toast.success('Le membre a été retiré du groupe')
  } catch (error) {
    console.error('Erreur lors du retrait du membre:', error)
    toast.error('Impossible de retirer le membre')
  }
}

async function loadGroupConversation(id: string) {
  try {
    chatService.offGroup('new_group_message')
    chatService.disconnect()
    chatService.connect()

    const groupData = await groupService.getGroupById(id)
    group.value = groupData
    isOwner.value = groupData.ownerId === userId

    const messagesResponse = await groupMessageService.getGroupMessages(id)
    messages.value = messagesResponse.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    chatService.onGroup('new_group_message', (msg: GroupMessage) => {
      if (msg.groupId === id) {
        messages.value.push(msg)
      }
    })

    await loadFriends()
  } catch (error) {
    console.error('Erreur lors du chargement du groupe:', error)
    toast.error('Impossible de charger le groupe')
  }
}

const leaveGroup = async () => {
  await groupService.leaveGroup(groupId.value)
  router.push('/home')
}

watch(
  () => route.params.groupId,
  (newId) => {
    groupId.value = newId as string
    loadGroupConversation(newId as string)
  },
)

onMounted(async () => {
  await loadGroupConversation(groupId.value)
})

onUnmounted(() => {
  chatService.offGroup('new_group_message')
  chatService.disconnect()
})
</script>

<template>
  <Card class="h-[95vh] m-2 gap-0 p-0">
    <CardHeader class="flex flex-row items-center gap-4 px-6 py-4 border-b">
      <Avatar>
        <AvatarImage :src="'https://randomuser.me/api/portraits/men/1.jpg'" />
        <AvatarFallback>{{ group?.name?.[0] || 'G' }}</AvatarFallback>
      </Avatar>
      <div class="flex-1">
        <div class="font-semibold text-lg">{{ group?.name }}</div>
        <div class="text-xs text-gray-500">{{ group?.members?.length || 0 }} membres</div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings class="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le groupe</DialogTitle>
            <DialogDescription>
              <template v-if="isOwner">
                <div class="space-y-4">
                  <div class="space-y-2">
                    <Label>Membres actuels</Label>
                    <div class="flex flex-wrap gap-2">
                      <div
                        v-for="member in group?.members"
                        :key="member.id"
                        class="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
                      >
                        {{ member.username }}
                        <Button
                          v-if="member.id !== group?.ownerId"
                          variant="ghost"
                          size="sm"
                          @click="removeMember(member.id)"
                          class="h-4 w-4 p-0"
                        >
                          <X class="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <Label>Ajouter des membres</Label>
                    <Input
                      v-model="searchQuery"
                      placeholder="Rechercher parmi vos amis..."
                      @input="searchUsers"
                      class="w-full"
                    />
                    <div v-if="searchResults.length > 0" class="mt-2 border rounded-md">
                      <div
                        v-for="user in searchResults"
                        :key="user.id"
                        class="p-2 hover:bg-accent cursor-pointer"
                        @click="addMember(user)"
                      >
                        {{ user.username }}
                      </div>
                    </div>
                    <div
                      v-else-if="searchQuery.length >= 2"
                      class="mt-2 text-sm text-muted-foreground"
                    >
                      Aucun ami trouvé
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="w-full flex justify-center">
                  <Button variant="destructive" @click="leaveGroup"> Quitter le groupe </Button>
                </div>
              </template>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardContent class="flex-1 overflow-y-auto px-6 py-4 space-y-6 bg-gray-50">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex"
        :class="msg.senderId === userId ? 'justify-end' : 'justify-start'"
      >
        <div
          class="flex items-end gap-2"
          :class="msg.senderId === userId ? 'flex-row-reverse' : ''"
        >
          <div
            :class="
              msg.senderId === userId ? 'bg-black text-white' : 'bg-white text-gray-900 border'
            "
            class="rounded-xl px-4 py-3 max-w-xs shadow-sm"
          >
            <div
              class="text-xs mb-1"
              :class="msg.senderId === userId ? 'hidden' : 'text-gray-500'"
              :style="{ color: msg.sender.color }"
            >
              {{ msg.sender.username || 'Utilisateur inconnu' }}
            </div>
            <div class="whitespace-pre-line" :style="{ color: msg.sender.color }">
              {{ msg.content }}
            </div>
            <div class="text-xs text-right mt-1 text-gray-400">{{ formatTime(msg.createdAt) }}</div>
          </div>
        </div>
      </div>
    </CardContent>

    <CardFooter class="flex items-center gap-2 px-6 py-4 border-t">
      <form @submit.prevent="sendMessage" class="flex items-center gap-2 w-full">
        <Input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1" />
        <Button type="submit" variant="default" class="ml-2"> Envoyer </Button>
      </form>
    </CardFooter>
  </Card>
</template>

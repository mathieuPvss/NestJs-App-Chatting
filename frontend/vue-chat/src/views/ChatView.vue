<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { chatService } from '@/services/chatService'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { userService } from '@/services/userService'
import { messageService } from '@/services/MessageService'
import type { Message } from '@/models/Message'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'vue-sonner'

const route = useRoute()
const friendId = ref(route.params.friendId as string)
const authStore = useAuthStore()
const userId = authStore.user?.id
const friendName = ref('')
const friendInitials = ref('')

const friendAvatar = ref('https://randomuser.me/api/portraits/men/1.jpg')

const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

function formatTime(date: string | Date) {
  const d = new Date(date)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  chatService.sendPrivateMessage({ recipientId: friendId.value, content: newMessage.value })
  newMessage.value = ''
}

async function loadConversation(id: string) {
  try {
    chatService.off('new_private_message')
    chatService.off('private_message_sent')

    chatService.disconnect()
    chatService.connect()

    const messagesResponse = await messageService.getConversation(id)
    messages.value = messagesResponse.sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    const friend = await userService.findOne(id)
    friendName.value = friend.username
    friendInitials.value = friend.username
      .split(' ')
      .map((n) => n[0])
      .join('')

    chatService.on('new_private_message', (msg) => {
      if (
        (msg.senderId === id && msg.recipientId === userId) ||
        (msg.senderId === userId && msg.recipientId === id)
      ) {
        messages.value.push(msg)
        scrollToBottom()
      }
    })

    chatService.on('private_message_sent', (msg) => {
      if (msg.recipientId === id) {
        messages.value.push(msg)
        scrollToBottom()
      }
    })
  } catch (error) {
    console.error('Erreur lors du chargement de la conversation:', error)
    toast.error('Impossible de charger la conversation')
  }
}

watch(
  () => route.params.friendId,
  (newId) => {
    friendId.value = newId as string
    loadConversation(newId as string)
  },
)

onMounted(async () => {
  await loadConversation(friendId.value)
})

onUnmounted(() => {
  chatService.off('new_private_message')
  chatService.off('private_message_sent')
  chatService.disconnect()
})

watch(messages, scrollToBottom)
</script>

<template>
  <Card class="h-[95vh] m-2 gap-0 p-0">
    <CardHeader class="flex flex-row items-center gap-4 px-6 py-4 border-b">
      <Avatar>
        <AvatarImage :src="friendAvatar" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <div class="flex-1">
        <div class="font-semibold text-lg">{{ friendName }}</div>
        <div class="text-xs text-gray-500">Actif il y a 2 min</div>
      </div>
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

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Mes amis</h1>
    <div class="flex items-center justify-between mb-6">
      <Input
        type="text"
        placeholder="Rechercher un ami"
        class="rounded-md border-solid border-2 border-gray-300 p-1"
      />
      <Button>Ajouter un ami</Button>
    </div>
    <ul class="space-y-4">
      <li
        v-for="friend in friends"
        :key="friend.id"
        class="flex items-center justify-between bg-white rounded-lg shadow p-4"
      >
        <div class="flex items-center space-x-4">
          <Avatar>
            <AvatarImage :src="friend.avatar" />
            <AvatarFallback>{{ friend.username.charAt(0) }}</AvatarFallback>
          </Avatar>
          <span class="font-semibold text-lg">{{ friend.username }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <Button @click="sendMessage(friend)" variant="outline"> Message </Button>
          <Button @click="removeFriend(friend)" variant="destructive"> Supprimer </Button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const friends = ref([
  {
    id: 1,
    username: 'JeanDupont',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    username: 'MarieCurie',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
])

function sendMessage(friend) {
  alert(`Envoyer un message à ${friend.username}`)
}

function removeFriend(friend) {
  alert(`Supprimer ${friend.username} de la liste d'amis`)
}
</script>

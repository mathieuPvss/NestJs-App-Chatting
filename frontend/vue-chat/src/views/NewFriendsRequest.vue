<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { friendshipService } from '@/services/friendshipService'
import { toast } from 'vue-sonner'
import type { GetReceivedRequestsResponse } from '@/services/friendshipService'

const friendRequests = ref<GetReceivedRequestsResponse[]>([])

onMounted(async () => {
  try {
    const requests = await friendshipService.getReceivedRequests()
    friendRequests.value = requests
  } catch (error) {
    toast.error("Erreur lors du chargement des demandes d'amis")
  }
})

async function acceptRequest(requestId: string) {
  try {
    await friendshipService.acceptFriendRequest(requestId)
    friendRequests.value = friendRequests.value.filter((request) => request.id !== requestId)
    toast.success("Demande d'ami acceptée")
  } catch (error) {
    toast.error("Erreur lors de l'acceptation de la demande")
  }
}

async function rejectRequest(requestId: string) {
  try {
    await friendshipService.rejectFriendRequest(requestId)
    friendRequests.value = friendRequests.value.filter((request) => request.id !== requestId)
    toast.success("Demande d'ami refusée")
  } catch (error) {
    toast.error('Erreur lors du refus de la demande')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Demandes d'amis</h1>
    <div v-if="friendRequests.length === 0" class="text-center text-gray-500 py-8">
      Aucune demande d'ami en attente
    </div>
    <ul v-else class="space-y-4">
      <li
        v-for="request in friendRequests"
        :key="request.id"
        class="flex items-center justify-between bg-white rounded-lg shadow p-4"
      >
        <div class="flex items-center space-x-4">
          <Avatar>
            <AvatarFallback>{{ request.requester.charAt(0) }}</AvatarFallback>
          </Avatar>
          <span class="font-semibold text-lg">{{ request.requester }}</span>
        </div>
        <div class="flex items-center space-x-2">
          <Button
            @click="acceptRequest(request.id)"
            variant="default"
            class="bg-green-600 hover:bg-green-700"
          >
            Accepter
          </Button>
          <Button @click="rejectRequest(request.id)" variant="destructive"> Refuser </Button>
        </div>
      </li>
    </ul>
  </div>
</template>

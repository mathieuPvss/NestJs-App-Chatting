<script setup lang="ts">
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FriendshipStatus } from '@/models/Friendship'
import { friendshipService, type GetSentRequestsResponse } from '@/services/friendshipService'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

const friendRequests = ref<GetSentRequestsResponse[]>([])

const pendingRequests = computed(() =>
  friendRequests.value.filter((request) => request.status === FriendshipStatus.PENDING),
)

const rejectedRequests = computed(() =>
  friendRequests.value.filter((request) => request.status === FriendshipStatus.REJECTED),
)

onMounted(async () => {
  try {
    const requests = await friendshipService.getSentRequests()
    friendRequests.value = requests
  } catch (error) {
    toast.error("Erreur lors du chargement des demandes d'amis")
  }
})

async function deleteRequest(requestId: string) {
  try {
    await friendshipService.removeFriend(requestId)
    friendRequests.value = friendRequests.value.filter((request) => request.id !== requestId)
    toast.success("Demande d'ami supprimée")
  } catch (error) {
    toast.error('Erreur lors de la suppression de la demande')
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Mes demandes d'amis</h1>

    <!-- Demandes en attente -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-4">Demandes en attente</h2>
      <div v-if="pendingRequests.length === 0" class="text-center text-gray-500 py-4">
        Aucune demande en attente
      </div>
      <ul v-else class="space-y-4">
        <li
          v-for="request in pendingRequests"
          :key="request.id"
          class="flex items-center justify-between bg-white rounded-lg shadow p-4"
        >
          <div class="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{{ request.recipient.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div>
              <span class="font-semibold text-lg">{{ request.recipient }}</span>
              <p class="text-sm text-gray-500">En attente de réponse</p>
            </div>
          </div>
          <Button @click="deleteRequest(request.id)" variant="destructive"> Annuler </Button>
        </li>
      </ul>
    </div>

    <Separator class="my-8" />

    <!-- Demandes refusées -->
    <div>
      <h2 class="text-xl font-semibold mb-4">Demandes refusées</h2>
      <div v-if="rejectedRequests.length === 0" class="text-center text-gray-500 py-4">
        Aucune demande refusée
      </div>
      <ul v-else class="space-y-4">
        <li
          v-for="request in rejectedRequests"
          :key="request.id"
          class="flex items-center justify-between bg-white rounded-lg shadow p-4"
        >
          <div class="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{{ request.recipient.charAt(0) }}</AvatarFallback>
            </Avatar>
            <div>
              <span class="font-semibold text-lg">{{ request.recipient }}</span>
              <p class="text-sm text-red-500">Demande refusée</p>
            </div>
          </div>
          <Button @click="deleteRequest(request.id)" variant="destructive"> Supprimer </Button>
        </li>
      </ul>
    </div>
  </div>
</template>

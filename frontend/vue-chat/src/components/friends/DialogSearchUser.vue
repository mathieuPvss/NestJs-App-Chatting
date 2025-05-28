<script setup lang="ts">
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { friendshipService } from '@/services/friendshipService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

defineExpose({ openDialogFunction })

const authStore = useAuthStore()

const openDialog = ref(false)
const searchQuery = ref('')
const searchResult = ref<{ id: string; username: string }>()
const sentRequests = ref(new Set())

const handleSearch = async () => {
  if (searchQuery.value.length < 2) {
    searchResult.value = undefined
    return
  }

  try {
    const response = await userService.searchUser(searchQuery.value)
    searchResult.value = response
  } catch (error) {
    console.error('Erreur lors de la recherche:', error)
  }
}

const sendFriendRequest = async (userId: string) => {
  try {
    await friendshipService.sendFriendRequest({
      requesterId: authStore.user?.id ?? '',
      recipientId: userId,
    })

    sentRequests.value.add(userId)
    toast.success("Demande d'ami envoyée avec succès")
  } catch (error: any) {
    if (error.response?.status === 409) {
      toast.error('Une demande ou une amitié existe déjà entre ces utilisateurs')
    } else {
      toast.error("Erreur lors de l'envoi de la demande d'ami")
    }
  }
}

const isRequestSent = (userId: string) => {
  return sentRequests.value.has(userId)
}

function openDialogFunction() {
  openDialog.value = true
}
</script>

<template>
  <Dialog v-model:open="openDialog">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rechercher un utilisateur</DialogTitle>
      </DialogHeader>

      <div class="w-full max-w-md mx-auto space-y-4">
        <Input v-model="searchQuery" type="text" @input="handleSearch" class="w-full" />

        <div
          v-if="searchResult"
          class="border border-gray-200 rounded-md shadow-sm divide-y divide-gray-100"
        >
          <div
            :key="searchResult.id"
            class="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <span class="text-gray-800 font-medium">
              {{ searchResult.username }}
            </span>
            <Button
              @click="sendFriendRequest(searchResult.id)"
              :disabled="isRequestSent(searchResult.id)"
              :variant="isRequestSent(searchResult.id) ? 'secondary' : 'default'"
            >
              {{ isRequestSent(searchResult.id) ? 'Demande envoyée' : 'Ajouter' }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { friendshipService } from '@/services/friendshipService'
import DialogSearchUser from '@/components/friends/DialogSearchUser.vue'
import { toast } from 'vue-sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const dialogAddBlockRef = ref<InstanceType<typeof DialogSearchUser> | null>(null)

const friends = ref<
  {
    friendshipId: string
    id: string
    username: string
    avatar: string
  }[]
>([])

const friendToDelete = ref<{ friendshipId: string; username: string } | null>(null)

onMounted(async () => {
  const response = await friendshipService.getAllFriends()

  const avatarsRes = await fetch('https://randomuser.me/api/?results=' + response.length)
  const avatarsData = await avatarsRes.json()

  friends.value = response.map((entry, index) => {
    const friend = entry.friend
    const avatar = avatarsData.results[index].picture.large

    return {
      friendshipId: entry.friendshipId,
      username: friend.username,
      id: friend.id,
      avatar,
    }
  })
})

function sendMessage(friend) {
  alert(`Envoyer un message à ${friend.username}`)
}

async function removeFriend(friendshipId: string) {
  try {
    await friendshipService.removeFriend(friendshipId)
    friends.value = friends.value.filter((f) => f.friendshipId !== friendshipId)
    toast.success('Ami supprimé avec succès')
  } catch (error) {
    toast.error("Erreur lors de la suppression de l'ami")
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">Mes amis</h1>
    <div class="flex items-center justify-between mb-6">
      <Input
        type="text"
        placeholder="Rechercher un ami"
        class="rounded-md border-solid border-2 border-gray-300 p-1"
      />
      <Button @click="dialogAddBlockRef?.openDialogFunction()">Ajouter un ami</Button>
    </div>
    <div v-if="friends.length === 0" class="text-center text-gray-500 py-4">Aucun ami trouvé</div>
    <ul v-else class="space-y-4">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Supprimer</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Vous ne pourrez plus voir les messages de cet ami.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction @click="removeFriend(friend.friendshipId)">
                  Continuer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </li>
    </ul>
    <DialogSearchUser ref="dialogAddBlockRef" />
  </div>
</template>

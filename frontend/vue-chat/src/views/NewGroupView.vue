<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { friendshipService } from '@/services/friendshipService'
import { groupService } from '@/services/groupService'
import { useAuthStore } from '@/stores/auth'
import { Loader2, X } from 'lucide-vue-next'
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  name: '',
  description: '',
})

const searchQuery = ref('')
const friendsList = ref<{ id: string; username: string }[]>([])
const searchResults = ref<{ id: string; username: string }[]>([])
const selectedMembers = ref<{ id: string; username: string }[]>([])
const isLoading = ref(false)

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
      !selectedMembers.value.some((member) => member.id === friend.id),
  )
}

const addMember = (user: { id: string; username: string }) => {
  if (!selectedMembers.value.some((member) => member.id === user.id)) {
    selectedMembers.value.push(user)
  }
  searchQuery.value = ''
  searchResults.value = []
}

const removeMember = (user: { id: string; username: string }) => {
  selectedMembers.value = selectedMembers.value.filter((member) => member.id !== user.id)
}

const handleSubmit = async () => {
  if (selectedMembers.value.length === 0) {
    toast.error('Veuillez ajouter au moins un membre au groupe')
    return
  }

  isLoading.value = true
  try {
    const group = await groupService.createGroup({
      name: formData.name,
      ownerId: authStore.user?.id ?? '',
      memberIds: selectedMembers.value.map((member) => member.id),
    })
    toast.success('Le groupe a été créé avec succès')
    router.push(`/group-chat/${group.id}`)
  } catch (error) {
    console.error('Erreur lors de la création du groupe:', error)
    toast.error('Impossible de créer le groupe')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadFriends()
})
</script>

<template>
  <div class="container mx-auto p-4">
    <Card class="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Créer un nouveau groupe</CardTitle>
        <CardDescription
          >Remplissez les informations pour créer un nouveau groupe de discussion</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label for="name">Nom du groupe</Label>
            <Input
              id="name"
              v-model="formData.name"
              placeholder="Entrez le nom du groupe"
              required
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <Label>Membres du groupe</Label>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="member in selectedMembers"
                :key="member.id"
                class="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full"
              >
                {{ member.username }}
                <Button variant="ghost" size="sm" @click="removeMember(member)" class="h-4 w-4 p-0">
                  <X class="h-3 w-3" />
                </Button>
              </div>
            </div>
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
            <div v-else-if="searchQuery.length >= 2" class="mt-2 text-sm text-muted-foreground">
              Aucun ami trouvé
            </div>
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Création en cours...' : 'Créer le groupe' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

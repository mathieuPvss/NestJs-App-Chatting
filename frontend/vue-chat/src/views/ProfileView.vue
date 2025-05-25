<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import { userService } from '@/services/userService'
import { authService } from '@/services/authService'

const authStore = useAuthStore()

const formData = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const isEditing = ref(false)

const handleSubmit = async () => {
  if (formData.value.newPassword && formData.value.newPassword !== formData.value.confirmPassword) {
    toast.error('Les mots de passe ne correspondent pas.')
    return
  }
  const dataToSend = {
    username: formData.value.username,
    email: formData.value.email,
    oldPassword: formData.value.oldPassword,
    newPassword: formData.value.newPassword,
  }

  try {
    if (authStore.user?.id && authStore.refreshToken) {
      const responseUser = await userService.update(authStore.user.id, dataToSend)

      if (responseUser.status === 200) {
        authStore.user = responseUser.data
        const response = await authService.refresh(authStore.refreshToken)
        authStore.setToken(response.data.access_token, response.data.refresh_token)
        authStore.decodeToken()
        toast.success('Profil mis à jour')
      }
    }
    isEditing.value = false
  } catch (error: any) {
    console.log(error)
    if (error.response?.status === 403) {
      toast.error('Mot de passe incorrect')
    } else {
      toast.error('Une erreur est survenue lors de la mise à jour du profil.')
    }
  }
}
</script>

<template>
  <div class="container mx-auto p-6">
    <Card class="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Mon Profil</CardTitle>
        <CardDescription>
          Gérez vos informations personnelles et votre mot de passe
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informations personnelles -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Informations personnelles</h3>

            <div class="space-y-2">
              <Label for="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                v-model="formData.username"
                :disabled="!isEditing"
                placeholder="Votre nom d'utilisateur"
              />
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                :disabled="!isEditing"
                placeholder="Votre email"
              />
            </div>
          </div>

          <!-- Changement de mot de passe -->
          <div v-if="isEditing" class="space-y-4">
            <h3 class="text-lg font-medium">Changer le mot de passe</h3>

            <div class="space-y-2">
              <Label for="currentPassword">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                v-model="formData.oldPassword"
                type="password"
                placeholder="Votre mot de passe actuel"
              />
            </div>

            <div class="space-y-2">
              <Label for="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                v-model="formData.newPassword"
                type="password"
                placeholder="Votre nouveau mot de passe"
              />
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Confirmez votre nouveau mot de passe"
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter class="flex justify-end space-x-4">
        <Button v-if="!isEditing" variant="outline" @click="isEditing = true"> Modifier </Button>
        <template v-else>
          <Button variant="outline" @click="isEditing = false"> Annuler </Button>
          <Button type="submit" @click="handleSubmit"> Enregistrer </Button>
        </template>
      </CardFooter>
    </Card>
  </div>
</template>

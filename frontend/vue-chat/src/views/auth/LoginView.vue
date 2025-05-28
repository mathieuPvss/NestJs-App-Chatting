<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { toTypedSchema } from '@vee-validate/zod'
import { ArrowRight, Lock, LogIn, Mail } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const authStore = useAuthStore()
const formSchema = toTypedSchema(
  z.object({
    email: z.string().email('Veuillez entrer une adresse email valide'),
    password: z.string().min(3, 'Le mot de passe doit contenir au moins 3 caractères'),
  }),
)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await authStore.login(values.email, values.password)
    if (response.success) {
      toast.success('Connexion réussie !', {
        description: 'Bienvenue sur PingUp',
        duration: 3000,
      })
      router.push('/home')
    }
  } catch (error) {
    const errorMessage = 'Une erreur est survenue lors de la connexion'
    toast.error('Erreur de connexion', {
      description: errorMessage,
      duration: 4000,
    })
  }
})
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
  >
    <Card class="w-full max-w-md shadow-xl border-0">
      <CardHeader class="space-y-1">
        <div class="flex items-center justify-center mb-4">
          <LogIn class="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle class="text-3xl font-bold text-center text-gray-900"> Connexion </CardTitle>
        <CardDescription class="text-center text-gray-600">
          Entrez vos identifiants pour accéder à votre compte PingUp
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-gray-700">Email</FormLabel>
              <FormControl>
                <div class="relative">
                  <Mail
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <Input
                    type="email"
                    placeholder="exemple@pingup.com"
                    class="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    v-bind="componentField"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-red-500 text-sm" />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-gray-700">Mot de passe</FormLabel>
              <FormControl>
                <div class="relative">
                  <Lock
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    class="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    v-bind="componentField"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-red-500 text-sm" />
            </FormItem>
          </FormField>
          <Button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Se connecter
            <ArrowRight class="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div class="w-full text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?
          <router-link
            to="/auth/register"
            class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
          >
            Créer un compte
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

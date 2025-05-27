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
import { authService } from '@/services/authService'
import { toTypedSchema } from '@vee-validate/zod'
import { ArrowRight, Lock, Mail, Palette, User, UserPlus } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email('Veuillez entrer une adresse email valide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    color: z.string().default('#000000'),
  }),
)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await authService.register(
      values.email,
      values.password,
      values.username,
      values.color,
    )
    if (response.status === 201) {
      toast.success('Inscription réussie !', {
        description: 'Vous pouvez maintenant vous connecter',
        duration: 3000,
      })
      router.push('/auth/login')
    }
  } catch (error: any) {
    if (error.status === 409) {
      toast.error("Erreur d'inscription", {
        description: 'Cet email est déjà utilisé',
        duration: 4000,
      })
    } else {
      toast.error("Erreur d'inscription", {
        description: "Une erreur est survenue lors de l'inscription",
        duration: 4000,
      })
    }
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
          <UserPlus class="h-12 w-12 text-blue-600" />
        </div>
        <CardTitle class="text-3xl font-bold text-center text-gray-900"> Inscription </CardTitle>
        <CardDescription class="text-center text-gray-600">
          Créez votre compte PingUp en remplissant le formulaire ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-gray-700">Nom d'utilisateur</FormLabel>
              <FormControl>
                <div class="relative">
                  <User
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <Input
                    type="text"
                    placeholder="johndoe"
                    class="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    v-bind="componentField"
                  />
                </div>
              </FormControl>
              <FormMessage class="text-red-500 text-sm" />
            </FormItem>
          </FormField>
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
                    placeholder="john@example.com"
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
          <FormField v-slot="{ componentField }" name="color" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel class="text-gray-700">Couleur de vos messages</FormLabel>
              <FormControl>
                <div class="relative">
                  <Palette
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  />
                  <Input
                    type="color"
                    class="pl-10 h-10 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
            S'inscrire
            <ArrowRight class="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div class="w-full text-center text-sm text-gray-600">
          Vous avez déjà un compte ?
          <router-link
            to="/auth/login"
            class="text-blue-600 hover:text-blue-700 font-medium ml-1 transition-colors duration-200"
          >
            Se connecter
          </router-link>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

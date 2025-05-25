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
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { authService } from '@/services/authService'
import { toast } from 'vue-sonner'

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
    email: z.string().email('Veuillez entrer une adresse email valide'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  }),
)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const response = await authService.register(values.email, values.password, values.username)
  if (response.status === 201) {
    toast.success('Inscription réussie')
    router.push('/auth/login')
  } else {
    toast.error('Inscription échouée')
  }
})
</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">Inscription</CardTitle>
        <CardDescription>
          Créez votre compte en remplissant le formulaire ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <form class="w-2/3 space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <FormControl>
                <Input type="text" placeholder="johndoe" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="john@example.com" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit">S'inscrire</Button>
        </form>
      </CardContent>
      <CardFooter>
        <div class="mt-4 text-center text-sm w-full">
          Vous avez déjà un compte ?
          <a href="/auth/login" class="underline">Connexion</a>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

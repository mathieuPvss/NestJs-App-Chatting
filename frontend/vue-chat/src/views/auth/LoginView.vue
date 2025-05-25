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
import { useForm } from 'vee-validate'
import * as z from 'zod'
const authStore = useAuthStore()
const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(3),
  }),
)

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  const response = await authStore.login(values.email, values.password)
  if (response.success) {
    router.push('/home')
  }
})
</script>

<template>
  <div class="flex justify-center items-center h-full w-full">
    <Card class="w-full max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl"> Connexion </CardTitle>
        <CardDescription>
          Entrez votre email ci-dessous pour vous connecter à votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <form class="w-2/3 space-y-6" @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="email" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" placeholder="mapa@example.com" v-bind="componentField" />
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
          <Button type="submit"> Se connecter </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div class="mt-4 text-center text-sm">
          Vous n'avez pas de compte ?
          <a href="/auth/register" class="underline"> Inscription </a>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>

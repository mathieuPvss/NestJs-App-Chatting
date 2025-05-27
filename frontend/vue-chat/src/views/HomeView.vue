<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          <MessageSquare class="inline-block mr-2 h-10 w-10 text-blue-600" />
          Bienvenue sur PingUp!
        </h1>
        <div class="mt-4">
          <p v-if="authStore.user" class="text-lg text-gray-700">
            <User class="inline-block mr-2 h-5 w-5 text-green-600" />
            Connecté en tant que {{ authStore.user.username }}
          </p>
          <p v-else class="text-lg text-gray-700">
            <LogIn class="inline-block mr-2 h-5 w-5 text-blue-600" />
            Veuillez vous connecter ou vous inscrire pour commencer à chatter
          </p>
        </div>
      </div>

      <!-- Fonctionnalités -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Sparkles class="h-6 w-6 text-yellow-500 mr-2" />
          Fonctionnalités
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <MessageCircle class="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 class="font-medium text-gray-900">Chat en temps réel</h3>
              <p class="text-gray-600">Discutez instantanément avec vos amis</p>
            </div>
          </div>
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <Users class="h-6 w-6 text-purple-600 mr-3 mt-1" />
            <div>
              <h3 class="font-medium text-gray-900">Groupes de discussion</h3>
              <p class="text-gray-600">Créez et rejoignez des groupes</p>
            </div>
          </div>
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <UserPlus class="h-6 w-6 text-green-600 mr-3 mt-1" />
            <div>
              <h3 class="font-medium text-gray-900">Gestion des amis</h3>
              <p class="text-gray-600">Envoyez et gérez vos demandes d'amis</p>
            </div>
          </div>
          <div class="flex items-start p-4 bg-gray-50 rounded-lg">
            <UserCog class="h-6 w-6 text-orange-600 mr-3 mt-1" />
            <div>
              <h3 class="font-medium text-gray-900">Profil personnalisé</h3>
              <p class="text-gray-600">Personnalisez votre profil à votre goût</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import {
  MessageSquare,
  User,
  LogIn,
  Sparkles,
  MessageCircle,
  Users,
  UserPlus,
  UserCog,
} from 'lucide-vue-next'

const authStore = useAuthStore()
</script>

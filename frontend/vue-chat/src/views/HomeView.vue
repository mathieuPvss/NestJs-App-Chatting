<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold mb-4">Bienvenue sur PingUp!</h1>
    <p v-if="authStore.user">Vous êtes connecté en tant que {{ authStore.user.username }}.</p>
    <p v-else>Veuillez vous connecter ou vous inscrire pour commencer à chatter.</p>
    <!-- Contenu principal de la page d'accueil ici -->
    <div class="mt-8">
      <h2 class="text-2xl font-semibold mb-3">Fonctionnalités à venir :</h2>
      <ul class="list-disc list-inside text-left max-w-md mx-auto">
        <li>Discuter avec des amis en temps réel</li>
        <li>Créer et rejoindre des groupes de discussion</li>
        <li>Envoyer et recevoir des demandes d'amis</li>
        <li>Gérer les requêtes d'amis (accepter/refuser)</li>
        <li>Personnaliser son profil</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

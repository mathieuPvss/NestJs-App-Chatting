import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'

class ChatService {
  private socket: Socket | null = null
  private messageHandlers: Map<string, (data: any) => void> = new Map()

  connect() {
    const authStore = useAuthStore()
    const token = authStore.token

    if (!token) {
      throw new Error('Non authentifié')
    }

    this.socket = io(import.meta.env.VITE_NEST_BACKEND_URL || 'http://localhost:3000', {
      auth: {
        token,
      },
    })

    this.setupEventListeners()
  }

  private setupEventListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connecté au serveur de chat')
    })

    this.socket.on('disconnect', () => {
      console.log('Déconnecté du serveur de chat')
    })

    this.socket.on('error', (error) => {
      console.error('Erreur de socket:', error)
    })

    // Écouteurs pour les messages privés
    this.socket.on('new_private_message', (message) => {
      const handler = this.messageHandlers.get('new_private_message')
      if (handler) handler(message)
    })

    this.socket.on('private_message_sent', (message) => {
      const handler = this.messageHandlers.get('private_message_sent')
      if (handler) handler(message)
    })

    // Écouteurs pour les messages de groupe
    this.socket.on('new_group_message', (message) => {
      const handler = this.messageHandlers.get('new_group_message')
      if (handler) handler(message)
    })

    this.socket.on('group_message_sent', (message) => {
      const handler = this.messageHandlers.get('group_message_sent')
      if (handler) handler(message)
    })
  }

  // Méthodes pour envoyer des messages
  sendPrivateMessage(data: { recipientId: string; content: string }) {
    if (!this.socket) throw new Error('Socket non connecté')
    this.socket.emit('private_message', data)
  }

  sendGroupMessage(data: { groupId: string; content: string }) {
    if (!this.socket) throw new Error('Socket non connecté')
    this.socket.emit('group_message', data)
  }

  // Méthodes pour gérer les groupes
  joinGroup(groupId: string) {
    if (!this.socket) throw new Error('Socket non connecté')
    this.socket.emit('join_group', { groupId })
  }

  leaveGroup(groupId: string) {
    if (!this.socket) throw new Error('Socket non connecté')
    this.socket.emit('leave_group', { groupId })
  }

  // Méthodes pour gérer les événements
  on(event: string, handler: (data: any) => void) {
    this.messageHandlers.set(event, handler)
  }

  off(event: string) {
    this.messageHandlers.delete(event)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const chatService = new ChatService()

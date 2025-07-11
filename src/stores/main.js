import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const userName = ref('')
  const userEmail = ref('')

  const userAvatar = computed(() => '/user.svg')

  const isFieldFocusRegistered = ref(false)

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function $reset() {
    userEmail.value = ''
    userName.value = ''
  }

  return {
    userName,
    userEmail,
    userAvatar,
    isFieldFocusRegistered,
    setUser,
    $reset
  }
})

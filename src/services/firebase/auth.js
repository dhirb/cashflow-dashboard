import { AUTH_UNKNOWN } from '@/const/auth'
import { useMainStore } from '@/stores/main'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { reactive } from 'vue'
import app from './init'

const auth = getAuth(app)

const authState = reactive({
  auth,
  authenticated: AUTH_UNKNOWN,
  loading: true
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsub = auth.onAuthStateChanged((user) => {
      authState.loading = authState.loading ? !authState.loading : authState.loading

      if (user) {
        const mainStore = useMainStore()
        mainStore.setUser({
          email: user.email,
          name: user.displayName ?? user.email
        })
      }

      unsub()
      resolve(user)
    }, reject)
  })
}

const signIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}

const isUserSignedIn = async () => {
  try {
    return (await getCurrentUser()) !== null
  } catch (error) {
    return false
  }
}

const userSignOut = () => {
  signOut(auth).then(() => {
    const mainStore = useMainStore()
    mainStore.$reset()

    authState.authenticated = AUTH_UNKNOWN
    window.localStorage.clear()
    window.location.replace('/login')
  })
}

export const useAuth = () => {
  return {
    authState,
    getCurrentUser,
    isUserSignedIn,
    signIn,
    userSignOut
  }
}

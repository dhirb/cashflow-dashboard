<script setup>
import FooterBar from '@/components/FooterBar.vue'
import NavBar from '@/components/NavBar.vue'
import menuNavBar from '@/menuNavBar.js'
import { useAuth } from '@/services/firebase/auth'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const layoutAsidePadding = ''

const { userSignOut } = useAuth()
const darkModeStore = useDarkModeStore()

const router = useRouter()

const isAsideMobileExpanded = ref(false)
const isAsideLgActive = ref(false)

router.beforeEach(() => {
  isAsideMobileExpanded.value = false
  isAsideLgActive.value = false
})

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set()
  }

  if (item.isLogout) {
    userSignOut()
  }
}
</script>

<template>
  <div
    :class="{
      'overflow-hidden lg:overflow-visible': isAsideMobileExpanded
    }"
  >
    <div
      :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
      class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
      <NavBar
        :menu="menuNavBar"
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        @menu-click="menuClick"
      >
      </NavBar>
      <slot />
      <FooterBar> </FooterBar>
    </div>
  </div>
</template>

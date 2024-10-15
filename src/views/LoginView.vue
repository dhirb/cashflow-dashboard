<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import { useAuth } from '@/services/firebase/auth'
import LoadingBackdrop from '@/components/utils/LoadingBackdrop.vue'
import ErrorCard from '@/components/ErrorCard.vue'

const form = reactive({
  email: '',
  pass: '',
  isLoading: false,
  error: undefined
})

const { signIn } = useAuth()
const router = useRouter()

const submit = async () => {
  try {
    form.isLoading = true
    await signIn(form.email, form.pass)
    router.replace('/projects')
  } catch (error) {
    form.error = error
  } finally {
    form.isLoading = false
  }
}
</script>

<template>
  <LoadingBackdrop v-model="form.isLoading" text="Logging in" />
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <div v-if="form.error" class="mb-8">
        <ErrorCard>
          {{ state.errorMsg }}
        </ErrorCard>
      </div>
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

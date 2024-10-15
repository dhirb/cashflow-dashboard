<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import ErrorCard from '@/components/ErrorCard.vue'
import LoadingBackdrop from '@/components/utils/LoadingBackdrop.vue'
import SectionMain from '@/components/SectionMain.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useDb } from '@/services/firebase/project'
import { timestampToYmd } from '@/services/utils/formatter'
import { useCashflowStore } from '@/stores/cashflow'
import { mdiPlus } from '@mdi/js'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const { createProject, getAllProjects } = useDb()
const cashflowStore = useCashflowStore()

onMounted(() => {
  getAllProjects()
})

const addProject = async () => {
  const projectId = await createProject()
  router.push(`/projects/${projectId}`)
}

const projects = computed(() => cashflowStore.projects)
const perPage = ref(10)
const currentPage = ref(0)

const projectsPaginated = computed(() =>
  projects.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(projects.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})
</script>

<template>
  <LoadingBackdrop v-model="cashflowStore.isLoading" />
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton title="Cashflow"
        ><BaseButton :icon="mdiPlus" @click.prevent="addProject"
      /></SectionTitleLineWithButton>

      <ErrorCard v-if="cashflowStore.error">{{ cashflowStore.error }}</ErrorCard>
      <CardBox v-if="projects.length === 0">
        <CardBoxComponentEmpty />
      </CardBox>
      <CardBox v-else class="mb-6" has-table>
        <table aria-describedby="List of projects">
          <thead>
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Description</th>
              <th class="text-center">Owner</th>
              <th class="text-center">Created</th>
              <th class="text-center">Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projectsPaginated" :key="project.id">
              <td data-label="Project Name" class="lg:w-24 text-center">
                <RouterLink :to="`/projects/${project.id}`" class="text-info">{{
                  project.name
                }}</RouterLink>
              </td>
              <td data-label="Description" class="lg:w-24 text-center">
                {{ project.description }}
              </td>
              <td data-label="Owner" class="lg:w-8 text-center">
                {{ project.createdBy }}
              </td>
              <td data-label="Created" class="lg:w-8 text-center">
                {{ timestampToYmd(project.createdAt) }}
              </td>
              <td data-label="Updated" class="lg:w-8 text-center whitespace-nowrap">
                {{ timestampToYmd(project.updatedAt) }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton
                v-for="page in pagesList"
                :key="page"
                :active="page === currentPage"
                :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                small
                @click="currentPage = page"
              />
            </BaseButtons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>

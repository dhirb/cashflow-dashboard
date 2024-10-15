import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCashflowStore = defineStore('cashflow', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  function setError(newError) {
    error.value = newError
  }

  function setProjects(newProjects) {
    projects.value = newProjects
  }

  function setProject(newProject) {
    currentProject.value = newProject
  }

  function setLoading(loading) {
    isLoading.value = loading
  }

  function $reset() {
    projects.value = []
    currentProject.value = null
    error.value = null
    isLoading.value = false
  }

  return {
    error,
    isLoading,
    currentProject,
    projects,
    setError,
    setLoading,
    setProjects,
    setProject,
    $reset
  }
})

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  initializeFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { useAuth } from './auth'
import app from './init'
import { DEFAULT_CASHFLOW_PROJECT } from '@/const/project'
import { useCashflowStore } from '@/stores/cashflow'
import { v7 as uuidv7 } from 'uuid'

const auth = useAuth()
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
})

const projectsColRef = collection(db, 'projects')
const getProjectDocRef = (projectId) => doc(db, 'projects', projectId)

const getAllProjects = async () => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)
    const currentUser = await auth.getCurrentUser()

    const snapshot = await getDocs(
      query(
        projectsColRef,
        where('isActive', '==', true),
        where('allowedUsers', 'array-contains', currentUser.uid),
        orderBy('updatedAt', 'desc')
      )
    )
    const allProjects = snapshot.docs.flatMap((doc) => doc.data())

    cashflowStore.setProjects(allProjects)
    cashflowStore.setError(null)
  } catch (error) {
    cashflowStore.setProjects([])
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

const getProject = async (projectId) => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)

    return onSnapshot(getProjectDocRef(projectId), (doc) => {
      cashflowStore.setProject(doc.data())
      cashflowStore.setError(null)
    })
  } catch (error) {
    cashflowStore.setProject(null)
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

const createProject = async () => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)

    const currentUser = await auth.getCurrentUser()
    const newDocRef = doc(projectsColRef)

    const data = {
      ...DEFAULT_CASHFLOW_PROJECT,
      id: newDocRef.id,
      allowedUsers: [currentUser.uid],
      createdAt: new Date(),
      createdBy: currentUser.email,
      updatedAt: new Date(),
      updatedBy: currentUser.email
    }
    await setDoc(newDocRef, data)

    return newDocRef.id
  } catch (error) {
    cashflowStore.setProject(null)
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

const updateProject = async (projectId, changeSet) => {
  const updatedBy = (await auth.getCurrentUser()).email
  return updateDoc(getProjectDocRef(projectId), { ...changeSet, updatedAt: new Date(), updatedBy })
}

const deleteProject = async (projectId) => {
  const updatedBy = (await auth.getCurrentUser()).email
  return updateDoc(getProjectDocRef(projectId), {
    isActive: false,
    updatedAt: new Date(),
    updatedBy
  })
}

const addCashflowEntry = async (projectId, entry) => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)

    const updatedBy = (await auth.getCurrentUser()).email
    await updateDoc(getProjectDocRef(projectId), {
      entries: arrayUnion({ ...entry, id: uuidv7() }),
      updatedAt: new Date(),
      updatedBy
    })
  } catch (error) {
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

const updateCashflowEntry = async (projectId, entry, initialEntry) => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)

    const updatedBy = (await auth.getCurrentUser()).email

    // Remove initial entry first
    await updateDoc(getProjectDocRef(projectId), {
      entries: arrayRemove(initialEntry)
    })
    await updateDoc(getProjectDocRef(projectId), {
      entries: arrayUnion(entry),
      updatedAt: new Date(),
      updatedBy
    })
  } catch (error) {
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

const deleteCashflowEntry = async (projectId, entry) => {
  const cashflowStore = useCashflowStore()

  try {
    cashflowStore.setLoading(true)

    const updatedBy = (await auth.getCurrentUser()).email
    await updateDoc(getProjectDocRef(projectId), {
      entries: arrayRemove(entry),
      updatedAt: new Date(),
      updatedBy
    })
  } catch (error) {
    cashflowStore.setError(error)
  } finally {
    cashflowStore.setLoading(false)
  }
}

export const useDb = () => {
  return {
    addCashflowEntry,
    createProject,
    deleteProject,
    deleteCashflowEntry,
    updateCashflowEntry,
    getAllProjects,
    getProject,
    updateProject
  }
}

import { useNavStore } from '@/stores/NavStore'
import { useAuthStore } from '@/stores/AuthStore'

export function useFilteredNavItems() {
  const NavStore = useNavStore()
  const AuthStore = useAuthStore()
  return computed(() => {
    return NavStore.items.filter((i) => {
      if (i.role === 'DEPRECATED') return false
      if (i.role && AuthStore.user?.permissions && !AuthStore.user.permissions.includes(i.role)) {
        return false
      }
      return true
    })
  })
}

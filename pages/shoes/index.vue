<script setup>
definePageMeta({
  middleware: [
    'auth',
    defineNuxtRouteMiddleware((_to, _from) => {
      const now = new Date()
      return navigateTo(`/shoes/${now.getFullYear()}/${now.getMonth() + 1}`)
    }),
  ],
})
</script>

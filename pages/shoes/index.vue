<script setup>
definePageMeta({
  middleware: [
    'auth',
    defineNuxtRouteMiddleware(() => {
      const now = new Date()
      return navigateTo(`/shoes/${now.getFullYear()}/${now.getMonth() + 1}`)
    }),
  ],
})
</script>

<script setup>
definePageMeta({
  middleware: () => {
    const now = new Date()
    return navigateTo(`/managers/${now.getFullYear()}/${now.getMonth() + 1}`)
  },
})
</script>

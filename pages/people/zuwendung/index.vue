<script setup>
definePageMeta({
  middleware: () => {
    const now = new Date()
    let zuwendung = 'urlaubsgeld'
    const weihnachstgeldMonate = [9, 10, 11, 12]
    if (weihnachstgeldMonate.includes(now.getMonth() + 1)) {
      zuwendung = 'weihnachstgeld'
    }
    return navigateTo(`/people/zuwendung/${now.getFullYear()}/${zuwendung}`)
  },
})
</script>

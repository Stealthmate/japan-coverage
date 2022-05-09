<template>
  <svg class="hidden" width="0" height="0">
    <defs>
      <filter v-for="(icon, i) in icons" :key="i" :id="icon">
        <feImage :href="`./icons/${icon}.png`" result="texture-img" preserveAspectRatio="xMinYMid meet"/>
      </filter>
    </defs>
  </svg>
</template>

<script>
export default {
  name: 'IconPatterns',
  computed: {
    icons() {
      return [
        'castle',
        'pond',
        'lake'
      ]
    }
  }
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
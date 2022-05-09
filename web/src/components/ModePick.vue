<template>
  <v-layout class="modePick d-flex flex-row justify-center">
    <v-btn
      v-for="(v, i) in values"
      :key="i"
      :class="`mx-1 customBtn ${value === v.value ? 'toggled' : ''}`"
      @click="() => toggle(v.value)"
    >
      {{ v.text }}
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  name: 'ModePick',
  props: {
    value: { type: String, default() { return undefined; }},
    values: { type: Array }
  },
  methods: {
    toggle(v) {
      this.$emit('input', v);
    }
  }
}
</script>

<style scoped>
.modePick {
  position: fixed;
  bottom: 10px;
  width: 300px;
  height: 30px;
  left: calc(50% - 150px);
  z-index: 1000;
}
.customBtn {
  background-color: #061741 !important;
  color: #551 !important;
}

.customBtn.toggled {
  background-color: #551 !important;
}
</style>
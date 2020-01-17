<template lang="pug">
  v-menu( v-model="periodeMenu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px")
    template(v-slot:activator="{ on }")
      v-icon(v-on="on") mdi-pencil
    v-date-picker(v-model="periode" type="month" locale="id" scrollable @input="periodeMenu = false")
</template>

<script>
export default {
	data: () => ({
		periode: null,
		periodeMenu: false,
  }),
  watch: {
    periode(val){
      this.$emit('update', this.periode)
    }
  }
}
</script>
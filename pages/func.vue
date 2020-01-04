<script>
import Example2 from '@/components/Example2'
export default {
  components: {
    Example2,
  }
}
</script>

<template>
  <div>
    <hr class="separator" />
    <Example2 />
  </div>
</template>

<style lang="scss">
.separator {
  margin: 3em 0;
  border-color: lightgray;
  border-width: 0.5px;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
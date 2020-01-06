<template lang="pug">
  v-layout( column justify-center align-center)
    v-flex.text-center( xs12 sm8 md6)
      v-card
        v-card-text
          template(v-if="show")
            Example2
          template(v-else)
            .headline.text-center Welcome
            hr.my-3
            blockquote.blockquote &#8220;First, solve the problem. Then, write the code.&#8221;
            .text-xs-right
              em
                small &mdash; John Leider &mdash;
        v-card-actions
          v-spacer
          v-btn(color="primary" @click="show=!show") {{ !show ? "Continue" : "Back"}}
</template>

<script>
import Example2 from '@/components/Example2'
export default {
  data: () =>({
    show: false
  }),
  components: {
    Example2,
  }
}
</script>

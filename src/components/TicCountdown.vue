<template>
  <div class="countdown">
      {{ $t('game.actions.label_coutdown') }} <span>{{ counter.toString().padStart(2,'0') }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      counter: 0,
      counterId: null,
      continue: true
    }
  },

  methods: {
    start (time) {
      // Reset current countdown
      this.stop()
      this.counter = time
      this.continue = true

      this.counterId = setInterval(() => {
        if (this.counter > 0 && this.continue) {
          this.counter--
        } else {
          this.$emit('finalized')
          this.stop()
        }
      }, 1000)
    },

    stop () {
      this.continue = false
      clearInterval(this.counterId)
      this.counterId = null
    }
  }
}
</script>

<style>
.countdown {
  background-color: #fff;
  border-top: 1px solid #E4E4E4;
  border-bottom: 1px solid #E4E4E4;
  border-left: 2px solid #F85A6A;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  padding: 2px 10px;
  position: absolute;
  right: 0;
  bottom: -55px;
  z-index: 2000;
}

.countdown span {
  color: #F85A6A;
  font-family: var(--font-secondary);
}
</style>

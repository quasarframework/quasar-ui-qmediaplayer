<template>
  <section class="flex flex-center bg-blue-10 text-white shadow-10">
    <div class="landing-page__container">
      <div class="landing-page__splash row justify-around items-center">
        <h2 class="text-weight-bold text-blue-2 q-pa-sm" style="padding-left: 20px;">QMediaPlayer,<br>HTML5 Media<br>player for your<br>Quasar apps</h2>
        <div class="q-pa-sm">
          <img
            src="/qmediaplayer.png"
            class="shadow-10 rounded-borders"
            style="max-width: 340px;"
          />
        </div>
      </div>
    </div>
    <div class="full-width row justify-center q-pb-xl">
      <q-btn
        to="/all-about-qmediaplayer/what-is-qmediaplayer"
        no-caps
        class="bg-red-8"
      >
        <div class="row justify-around items-center" style="width: 140px;">
          <div>Get started</div>
          <q-icon :name="biArrowRightCircle"/>
        </div>
      </q-btn>
    </div>
  </section>

</template>

<script>
import { defineComponent, computed } from 'vue'
import { useQuasar } from 'quasar'
import {
  biArrowRightCircle
} from '@quasar/extras/bootstrap-icons'

export default defineComponent({
  name: 'Landing Page Content',

  setup () {
    const $q = useQuasar()

    const layout = computed(() => {
      return $q.screen.lt.sm ? 'dense' : ($q.screen.lt.md ? 'comfortable' : 'loose')
    })

    return {
      layout,
      biArrowRightCircle
    }
  }
})
</script>

<style lang="sass" scoped>
.landing-page-container
  position: relative
  margin: 0 auto
  @media (max-width: $breakpoint-xs-max)
    max-width: 340px
    width: 340px
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    max-width: 480px
    width: 480px
  @media (min-width: $breakpoint-lg-min)
    max-width: 960px
    width: 960px

.landing-page__splash
  @media (max-width: $breakpoint-xs-max)
    padding: 0
  @media (min-width: $breakpoint-sm-min) and (max-width: $breakpoint-md-max)
    padding: 30px 0 60px
  @media (min-width: $breakpoint-lg-min)
    padding: 50px 0 100px

.landing-page__splash--content
  max-width: 500px

</style>

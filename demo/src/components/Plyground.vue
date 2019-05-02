<template>
  <div class="row justify-left" style="width: 100%;">
    <q-dialog v-model="displayLocale">
      <q-card style="min-width: 300px;">
        <q-toolbar class="bg-blue-8 text-grey-1">
          <q-toolbar-title>
            Current local: <strong>{{ displayedLocale }}</strong>
          </q-toolbar-title>
        </q-toolbar>
        <q-card-section class="text-caption">
          Enter a new locale:
        </q-card-section>
        <q-card-section>
          <q-input v-model="locale" autofocus label="Locale"></q-input>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-btn
      dense
      label="Change locale"
      @click="displayLocale = true"
      class="col-12"
    ></q-btn>
    <q-toggle
      class="col-12"
      v-model="fiveDayWorkWeek"
      label="5 day work week"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="firstDayMonday"
      label="Week starts on Monday"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="shortMonthLabel"
      label="Short month label"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="shortWeekdayLabel"
      label="Short weekday label"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="shortIntervalLabel"
      label="Short interval label"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="format24h"
      label="24hr interval labels"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="showWorkWeeks"
      label="Show work weeks"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="hideHeader"
      label="Hide header"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="showMonthLabel"
      label="Show month label"
    ></q-toggle>
    <q-toggle
      class="col-12"
      v-model="showDayOfYearLabel"
      label="Show Day of Year Label"
    ></q-toggle>
    <div class="col-12 q-px-md">
      <span class="text-body2" >Interval Range (daily)</span>
      <q-range
        v-model="intervalRange"
        :min="0"
        :max="24"
        :step="intervalRangeStep"
        label
        :left-label-value="leftLabelRange"
        :right-label-value="rightLabelRange"
      />
    </div>
    <div class="col-12 q-px-md q-pb-sm">
      <span class="text-body2" >Interval Step</span>
      <div class="q-gutter-sm">
        <q-radio v-model="intervalRangeStep" :val="1" label="60 min" />
        <q-radio v-model="intervalRangeStep" :val="0.5" label="30 min" />
        <q-radio v-model="intervalRangeStep" :val="0.25" label="15 min" />
      </div>
    </div>
    <div class="col-12 q-px-md q-pb-sm">
      <span class="text-body2" >Interval height (daily)</span>
      <q-slider
        v-model="intervalHeight"
        :min="20"
        :max="100"
        label
        :label-value="intervalHeight + 'px'"
      />
    </div>
    <div class="col-12 q-px-md q-pb-sm">
      <span class="text-body2" >Day height (monthly)</span>
      <q-slider
        v-model="dayHeight"
        :min="50"
        :max="200"
        label
        :label-value="dayHeight + 'px'"
      />
    </div>
    <q-toggle
      class="col-12"
      v-model="enableThemes"
      label="Enable themes"
    ></q-toggle>
    <q-select
      outlined
      dense
      emit-value
      map-options
      label="Change theme"
      v-model="theme"
      :options="themesList"
      :disable="enableThemes !== true"
      class="col-12"
    ></q-select>

  </div>
</template>

<script>
import { Platform } from 'quasar'
import themes from '../util/themes'
export default {
  name: 'Playground',
  data () {
    return {
      displayLocale: false
    }
  },
  mounted () {
    if (Platform.is.mobile) {
      this.shortMonthLabel = true
      this.shortWeekdayLabel = true
      this.shortIntervalLabel = true
      this.format24h = true
    }
  },
  computed: {
    leftLabelRange () {
      const a = Math.floor(this.intervalRange.min)
      const b = Number((this.intervalRange.min % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    rightLabelRange () {
      const a = Math.floor(this.intervalRange.max)
      const b = Number((this.intervalRange.max % 1).toFixed(2))
      const c = 60 * b
      return a + ':' + (c < 10 ? c + '0' : c)
    },
    displayedLocale () {
      if (this.locale === void 0 || this.locale === '') {
        return 'en-US'
      }
      return this.locale
    },
    locale:
    {
      get () {
        return this.$store.state.mediaplayer.locale
      },
      set (locale) {
        this.$store.commit('mediaplayer/locale', locale)
      }
    },
    fiveDayWorkWeek: {
      get () {
        return this.$store.state.mediaplayer.fiveDayWorkWeek
      },
      set (b) {
        this.$store.commit('mediaplayer/fiveDayWorkWeek', b)
      }
    },
    firstDayMonday: {
      get () {
        return this.$store.state.mediaplayer.firstDayMonday
      },
      set (b) {
        this.$store.commit('mediaplayer/firstDayMonday', b)
      }
    },
    shortMonthLabel: {
      get () {
        return this.$store.state.mediaplayer.shortMonthLabel
      },
      set (b) {
        this.$store.commit('mediaplayer/shortMonthLabel', b)
      }
    },
    showDayOfYearLabel: {
      get () {
        return this.$store.state.mediaplayer.showDayOfYearLabel
      },
      set (b) {
        this.$store.commit('mediaplayer/showDayOfYearLabel', b)
      }
    },
    shortWeekdayLabel: {
      get () {
        return this.$store.state.mediaplayer.shortWeekdayLabel
      },
      set (b) {
        this.$store.commit('mediaplayer/shortWeekdayLabel', b)
      }
    },
    shortIntervalLabel: {
      get () {
        return this.$store.state.mediaplayer.shortIntervalLabel
      },
      set (b) {
        this.$store.commit('mediaplayer/shortIntervalLabel', b)
      }
    },
    format24h: {
      get () {
        return this.$store.state.mediaplayer.format24h
      },
      set (b) {
        this.$store.commit('mediaplayer/format24h', b)
      }
    },
    hideHeader: {
      get () {
        return this.$store.state.mediaplayer.hideHeader
      },
      set (b) {
        this.$store.commit('mediaplayer/hideHeader', b)
      }
    },
    showMonthLabel: {
      get () {
        return this.$store.state.mediaplayer.showMonthLabel
      },
      set (b) {
        this.$store.commit('mediaplayer/showMonthLabel', b)
      }
    },
    showWorkWeeks: {
      get () {
        return this.$store.state.mediaplayer.showWorkWeeks
      },
      set (b) {
        this.$store.commit('mediaplayer/showWorkWeeks', b)
      }
    },
    intervalRange: {
      get () {
        return this.$store.state.mediaplayer.intervalRange
      },
      set (range) {
        this.$store.commit('mediaplayer/intervalRange', range)
      }
    },
    intervalRangeStep: {
      get () {
        return this.$store.state.mediaplayer.intervalRangeStep
      },
      set (step) {
        this.$store.commit('mediaplayer/intervalRangeStep', step)
      }
    },
    intervalHeight: {
      get () {
        return this.$store.state.mediaplayer.intervalHeight
      },
      set (height) {
        this.$store.commit('mediaplayer/intervalHeight', height)
      }
    },
    dayHeight: {
      get () {
        return this.$store.state.mediaplayer.dayHeight
      },
      set (height) {
        this.$store.commit('mediaplayer/dayHeight', height)
      }
    },
    enableThemes: {
      get () {
        return this.$store.state.mediaplayer.enableThemes
      },
      set (b) {
        this.$store.commit('mediaplayer/enableThemes', b)
      }
    },
    themes: {
      get () {
        return themes
      }
    },
    theme:
    {
      get () {
        return this.$store.state.mediaplayer.theme
      },
      set (theme) {
        this.$store.commit('mediaplayer/theme', theme)
      }
    },
    themesList () {
      const list = []
      this.themes.forEach((theme) => {
        list.push({
          label: theme.name,
          value: { ...theme }
        })
      })
      return list
    }
  }
}
</script>

<style>
</style>

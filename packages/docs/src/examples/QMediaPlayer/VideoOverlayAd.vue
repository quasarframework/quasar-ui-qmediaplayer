<template>
  <div class="q-pa-md q-gutter-md">
    <q-banner rounded class="bg-blue-grey-9 text-white">
      Use the overlay slot for interactive promotions, consent prompts, calls to action, or
      sponsored placements. While the overlay is visible, clicks inside the video frame do not
      toggle playback.
    </q-banner>

    <q-media-player
      class="video-overlay-ad-player"
      type="video"
      :sources="sources"
      :poster="poster"
      :toggle-play-on-click="adVisible === false"
      bottom-controls
    >
      <template #overlay>
        <transition name="overlay-ad">
          <q-card v-if="adVisible" flat bordered class="overlay-ad-card text-white shadow-8">
            <q-btn
              dense
              round
              flat
              icon="close"
              aria-label="Dismiss sponsored message"
              class="overlay-ad-card__close"
              @click="adVisible = false"
            />

            <div class="text-overline text-cyan-2">Sponsored</div>
            <div class="text-h6 q-mt-xs">Build immersive media experiences</div>
            <p class="q-mt-sm q-mb-md text-body2">
              Add your own overlay content without sacrificing QMediaPlayer controls.
            </p>

            <q-btn
              outline
              color="white"
              no-caps
              label="Learn more"
              href="https://github.com/quasarframework/quasar-ui-qmediaplayer"
              target="_blank"
              rel="noopener noreferrer"
            />
          </q-card>
        </transition>
      </template>
    </q-media-player>

    <q-btn
      v-if="adVisible === false"
      outline
      color="primary"
      no-caps
      label="Show overlay again"
      @click="adVisible = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QMediaPlayer } from '@quasar/quasar-ui-qmediaplayer'
import '@quasar/quasar-ui-qmediaplayer/dist/index.css'

defineOptions({ name: 'VideoOverlayAd' })

const adVisible = ref(true)
const poster = '/media/TearsOfSteel/TearsOfSteel.jpeg'
const sources = [
  {
    src: 'https://archive.org/download/Tears-of-Steel/tears_of_steel_720p.mp4',
    type: 'video/mp4',
  },
]
</script>

<style scoped lang="scss">
.overlay-ad-card {
  position: absolute;
  left: 1rem;
  bottom: 6rem;
  width: min(360px, calc(100% - 2rem));
  padding: 1.25rem;
  border-color: rgba(255, 255, 255, 0.25);
  background:
    radial-gradient(circle at top left, rgba(0, 188, 212, 0.35), transparent 38%),
    linear-gradient(135deg, rgba(0, 33, 61, 0.94), rgba(4, 72, 92, 0.88));
  backdrop-filter: blur(8px);
  pointer-events: auto;
  z-index: 1;
}

.overlay-ad-card__close {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
}

.overlay-ad-enter-active,
.overlay-ad-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.overlay-ad-enter-from,
.overlay-ad-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.video-overlay-ad-player :deep(.q-media__overlay-window) {
  z-index: 3;
  pointer-events: none;
}

@media (max-width: 600px) {
  .overlay-ad-card {
    right: 1rem;
    bottom: 5.5rem;
    width: auto;
  }
}
</style>

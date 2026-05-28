<template>
  <section class="landing-page markdown-brand">
    <header class="hero">
      <img src="/qmediaplayer-logo.svg" alt="QMediaPlayer Logo" class="hero-logo" />
      <h1 class="hero-title">QMediaPlayer</h1>

      <div class="row justify-center">
        <p class="hero-subtitle">
          {{ siteConfig.description }}
        </p>
      </div>

      <div class="hero-buttons">
        <router-link
          to="/getting-started/introduction"
          class="hero-button q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--no-uppercase q-btn--rounded q-btn--dense"
        >
          <div
            class="hero-button__content row justify-around items-center q-btn__content text-center col items-center q-anchor--skip"
          >
            <span class="hero-button__label">Get Started</span>
            <q-icon :name="biArrowRightCircle" />
          </div>
        </router-link>

        <router-link
          to="/other/upgrade-guide"
          class="hero-button q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--no-uppercase q-btn--rounded q-btn--dense"
        >
          <div
            class="hero-button__content row justify-around items-center q-btn__content text-center col items-center q-anchor--skip"
          >
            <span class="hero-button__label">Upgrade Guide</span>
          </div>
        </router-link>

        <a
          href="https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/v3-beta"
          target="_blank"
          rel="noopener noreferrer"
          class="hero-button q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle q-btn--actionable q-focusable q-hoverable q-btn--no-uppercase q-btn--rounded q-btn--dense"
        >
          <div
            class="hero-button__content row justify-around items-center q-btn__content text-center col items-center q-anchor--skip"
          >
            <q-icon :name="fabGithub" class="q-mr-sm" />
            <span class="hero-button__label">GitHub Repo</span>
          </div>
        </a>
      </div>
    </header>

    <div class="byline">
      <p>
        Build refined HTML5 audio and video players for Quasar applications with captions,
        fullscreen support, themes, custom icons, and language packs.
      </p>
    </div>

    <q-separator />

    <div class="byline">
      <p>
        Don't forget to check out the
        <a href="https://github.com/quasarframework/quasar-ui-qmediaplayer" target="_blank">
          QMediaPlayer GitHub repo
        </a>
        and the
        <a href="https://github.com/hawkeye64/md-plugins" target="_blank">
          @md-plugins GitHub repo
        </a>
        for the shared documentation tooling behind this site.
      </p>
      <p>
        This site is built with
        <a
          href="https://www.npmjs.com/package/@md-plugins/quasar-app-extension-q-press"
          target="_blank"
        >
          Q-Press
        </a>
        , the <code>@md-plugins</code> app extension for Quasar documentation sites. Install it, set
        it up, choose a theme, and start your own site!
      </p>
    </div>

    <q-separator />

    <div class="byline">
      <p>
        We hope you find this documentation helpful. If you have any questions or need further
        assistance, please reach out through the QMediaPlayer repository or GitHub Discussions.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { fabGithub } from "@quasar/extras/fontawesome-v7";
import { biArrowRightCircle } from "@quasar/extras/bootstrap-icons";
import siteConfig from "../../siteConfig";
</script>

<style lang="scss" scoped>
.landing-page {
  color: #263238;
}

.hero {
  background: linear-gradient(135deg, $brand-primary, $brand-secondary);
  color: white;
  text-align: center;
  padding: 50px 20px;
}

.hero-logo {
  max-width: 200px;
  margin-bottom: 20px;
  border-radius: 28%;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5.5rem);
  line-height: 1.1;
  font-weight: 700;
  margin: 0;
  padding: 0.2em 0;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.hero-subtitle {
  max-width: 660px;
  font-size: 1.2em;
  line-height: 1.4;
  font-weight: 700;
  margin: 0;
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
}

.hero-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.hero-button {
  background: white;
  color: $brand-primary;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.hero-button:hover {
  background: #f0f0f0;
}

.hero-button__content {
  flex-wrap: nowrap;
  width: 120px;
}

.hero-button__label {
  white-space: nowrap;
}

.byline {
  text-align: center;
  font-size: 1.2em;
  margin: 20px auto;
  max-width: 760px;
  color: #35495e;
  padding: 0 20px;
}

body.body--dark .byline {
  color: #f0f0f0;
}

.byline a {
  color: $brand-primary;
  font-weight: 700;
}

body.body--dark .byline a {
  color: #8ee8ff;
}
</style>

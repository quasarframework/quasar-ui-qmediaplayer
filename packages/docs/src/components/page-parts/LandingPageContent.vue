<template>
  <section class="landing-page markdown-brand">
    <header class="hero">
      <div class="hero__mesh hero__mesh--left" />
      <div class="hero__mesh hero__mesh--right" />

      <div class="hero__grid">
        <div class="hero__copy">
          <div class="hero__eyebrow">{{ heroEyebrow }}</div>
          <img :src="logoSrc" :alt="logoAlt" class="hero-logo" />
          <h1 class="hero-title">{{ productName }}</h1>

          <p class="hero-subtitle">{{ siteConfig.description }}</p>
          <p class="hero-lede">{{ heroLede }}</p>

          <div class="hero-buttons">
            <q-btn
              to="/getting-started/introduction"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--solid"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
                <span class="hero-button__label">Get Started</span>
                <span class="hero-button__slot">
                  <q-icon :name="biArrowRightCircle" />
                </span>
              </div>
            </q-btn>

            <q-btn
              to="/other/upgrade-guide"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--ghost"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
                <span class="hero-button__label">Upgrade Guide</span>
                <span class="hero-button__slot">
                  <q-icon name="upgrade" />
                </span>
              </div>
            </q-btn>

            <q-btn
              :href="githubTreeUrl"
              target="_blank"
              rel="noopener noreferrer"
              no-caps
              rounded
              unelevated
              class="hero-button hero-button--ghost"
            >
              <div class="hero-button__content q-anchor--skip">
                <span class="hero-button__slot">
                  <q-icon :name="fabGithub" />
                </span>
                <span class="hero-button__label">GitHub Repo</span>
                <span class="hero-button__slot hero-button__slot--empty" aria-hidden="true" />
              </div>
            </q-btn>
          </div>

          <div class="hero-pills">
            <span v-for="pill in heroPills" :key="pill" class="hero-pill">
              {{ pill }}
            </span>
          </div>
        </div>

        <div class="hero__visual">
          <div class="preview-panel">
            <div class="preview-panel__header">
              <span class="preview-panel__kicker">{{ previewKicker }}</span>
              <span class="preview-panel__note">Docs and app-ready</span>
            </div>

            <div class="preview-panel__body">
              <div class="preview-panel__copy">
                <h2>{{ previewTitle }}</h2>
                <p>{{ previewBody }}</p>
              </div>

              <div
                class="preview-stack"
                :class="{ 'preview-stack--single': previewImages.length === 1 }"
              >
                <div
                  v-for="(image, index) in previewImages"
                  :key="image.src"
                  class="preview-card"
                  :class="index === 0 ? 'preview-card--primary' : 'preview-card--secondary'"
                >
                  <q-img :src="image.src" :alt="image.alt" fit="contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="feature-section">
      <div class="section-heading">
        <div class="section-heading__eyebrow">Included</div>
        <h2 class="section-heading__title">{{ sectionTitle }}</h2>
        <p class="section-heading__text">{{ sectionText }}</p>
      </div>

      <div class="feature-grid">
        <article v-for="feature in featureCards" :key="feature.title" class="feature-card">
          <div class="feature-card__icon">
            <q-icon :name="feature.icon" />
          </div>
          <h3 class="feature-card__title">{{ feature.title }}</h3>
          <p class="feature-card__body">{{ feature.body }}</p>
        </article>
      </div>
    </section>

    <section class="resource-section">
      <article class="resource-card resource-card--primary">
        <div class="resource-card__eyebrow">Ecosystem</div>
        <h2 class="resource-card__title">
          Built in the same docs workflow as the other md-plugins sites
        </h2>
        <p class="resource-card__body">
          This site runs on Q-Press and the shared md-plugins tooling, so {{ productName }}'s docs,
          examples, and navigation fit into the same family as the sibling Quasar UI projects.
        </p>

        <div class="resource-card__actions">
          <a :href="githubRepoUrl" target="_blank" rel="noopener noreferrer" class="resource-link">
            <q-icon :name="fabGithub" />
            <span>{{ productName }} Repo</span>
          </a>

          <a
            href="https://github.com/hawkeye64/md-plugins"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-link"
          >
            <q-icon name="hub" />
            <span>md-plugins</span>
          </a>

          <a
            href="https://www.npmjs.com/package/@md-plugins/quasar-app-extension-q-press"
            target="_blank"
            rel="noopener noreferrer"
            class="resource-link"
          >
            <q-icon name="description" />
            <span>Q-Press</span>
          </a>
        </div>
      </article>

      <article class="resource-card resource-card--secondary">
        <div class="resource-card__eyebrow">Need Help?</div>
        <h2 class="resource-card__title">
          Start with the intro, then move into the usage patterns
        </h2>
        <p class="resource-card__body">
          The docs move from installation to practical player setup quickly. If something feels off,
          GitHub Discussions and the repo issue tracker are still the best places to surface it.
        </p>

        <div class="resource-list">
          <div v-for="item in supportItems" :key="item.title" class="resource-list__item">
            <div class="resource-list__title">{{ item.title }}</div>
            <div class="resource-list__body">{{ item.body }}</div>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { fabGithub } from "@quasar/extras/fontawesome-v7";
import { biArrowRightCircle } from "@quasar/extras/bootstrap-icons";
import siteConfig from "../../siteConfig";

const productName = "QMediaPlayer";
const logoSrc = "/qmediaplayer-logo.svg";
const logoAlt = "QMediaPlayer Logo";
const githubTreeUrl = "https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/v3-beta";
const githubRepoUrl = "https://github.com/quasarframework/quasar-ui-qmediaplayer";
const heroEyebrow = "Vue 3 + Quasar 2";
const heroLede =
  "Build refined audio and video experiences for Quasar apps with captions, fullscreen flows, themes, and custom player chrome that feels product-ready.";
const previewKicker = "HTML5 Playback";
const previewTitle = "Media controls that look like part of the app, not a bolted-on widget";
const previewBody =
  "QMediaPlayer wraps HTML5 playback in a Quasar-friendly surface so audio and video experiences can ship with stronger styling, subtitles, language support, and predictable controls.";
const sectionTitle = "A focused media player for audio, video, and app-ready playback UI";
const sectionText =
  "QMediaPlayer keeps the problem narrow: play media well, expose the right controls, and make captions, themes, and custom icons feel natural inside a Quasar app.";

const heroPills = ["Audio", "Video", "Captions", "Fullscreen", "Themes"];

const previewImages = [
  {
    src: "/qmediaplayer.png",
    alt: "QMediaPlayer preview",
  },
];

const featureCards = [
  {
    icon: "play_circle",
    title: "Audio and Video",
    body: "Handle both playback modes in the same UI family instead of building separate player experiences.",
  },
  {
    icon: "subtitles",
    title: "Caption and Track Support",
    body: "Work with subtitle files and language-aware playback flows for more usable media experiences.",
  },
  {
    icon: "fullscreen",
    title: "Fullscreen Ready",
    body: "Support larger-screen playback without reworking the control model when users need to focus on the media.",
  },
  {
    icon: "palette",
    title: "Themes and Branding",
    body: "Match player surfaces to the rest of your Quasar application instead of leaving media in a generic skin.",
  },
  {
    icon: "translate",
    title: "Language Packs",
    body: "Adjust labels and supporting copy for apps that need localized playback controls and captions.",
  },
  {
    icon: "extension",
    title: "Custom Icons and Controls",
    body: "Tune the player chrome so the controls feel intentional in dashboards, education tools, and content apps.",
  },
];

const supportItems = [
  {
    title: "Introduction First",
    body: "Start with the introduction and installation docs to choose the right setup path for Vue and Quasar projects.",
  },
  {
    title: "Usage Before Customization",
    body: "Use the main development guide first, then layer in themes, captions, and media options once playback is working.",
  },
  {
    title: "Discussions + Issues",
    body: "Questions, bugs, and feature requests are easiest to track in the QMediaPlayer repo and GitHub Discussions.",
  },
];
</script>

<style lang="scss" scoped>
.landing-page {
  --landing-border: rgba(229, 245, 255, 0.14);
  --landing-border-strong: rgba(229, 245, 255, 0.22);
  --landing-surface: rgba(18, 31, 43, 0.74);
  --landing-surface-strong: rgba(24, 41, 58, 0.88);
  --landing-text-soft: rgba(229, 245, 255, 0.8);
  --landing-shadow: 0 28px 60px rgba(8, 18, 26, 0.28);
  padding: 28px clamp(16px, 2.4vw, 34px) 42px;
  color: #1f303b;
}

.hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  padding: clamp(24px, 4vw, 44px);
  border: 1px solid var(--landing-border);
  border-radius: 34px;
  background:
    radial-gradient(circle at top left, rgba(122, 209, 255, 0.2), transparent 34%),
    radial-gradient(circle at 82% 20%, rgba(241, 250, 255, 0.08), transparent 20%),
    linear-gradient(145deg, rgba(19, 34, 48, 0.96), rgba(10, 18, 27, 0.96));
  box-shadow: var(--landing-shadow);
}

.hero__mesh {
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(241, 250, 255, 0.12), transparent 68%);
  filter: blur(10px);
  pointer-events: none;
}

.hero__mesh--left {
  top: -90px;
  left: -70px;
}

.hero__mesh--right {
  right: -40px;
  bottom: -90px;
}

.hero__grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 24px;
  align-items: center;
  grid-template-columns: minmax(0, 1.06fr) minmax(320px, 0.94fr);
}

.hero__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.hero__eyebrow,
.section-heading__eyebrow,
.resource-card__eyebrow,
.preview-panel__kicker {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 14px;
  border: 1px solid var(--landing-border-strong);
  border-radius: 999px;
  background: rgba(241, 250, 255, 0.08);
  color: #c9ecff;
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.resource-card__eyebrow {
  margin-bottom: 14px;
}

.hero-logo {
  width: clamp(84px, 11vw, 120px);
  border-radius: 28px;
  box-shadow: 0 24px 48px rgba(9, 18, 27, 0.32);
}

.hero-title {
  margin: 0;
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  font-size: clamp(3.2rem, 8vw, 6rem);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.05em;
  color: #f7fcff;
}

.hero-subtitle {
  max-width: 620px;
  margin: 0;
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  line-height: 1.45;
  font-weight: 700;
  color: #ebf8ff;
}

.hero-lede {
  max-width: 580px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--landing-text-soft);
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 12px;
  padding-top: 6px;
  margin-bottom: 6px;
}

.hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 6px;
}

.hero-button {
  min-height: 50px;
  padding: 0 18px;
  border: 1px solid transparent;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    background-color 0.22s ease,
    border-color 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease;
}

.hero-button:hover,
.resource-link:hover {
  transform: translateY(-1px);
}

.hero-button :deep(.q-btn__content) {
  width: 100%;
  min-width: 0;
}

.hero-button--solid {
  background: #effaff;
  color: #142230;
  box-shadow: 0 18px 30px rgba(9, 18, 27, 0.2);
}

.hero-button--ghost {
  background: rgba(241, 250, 255, 0.08);
  border-color: var(--landing-border-strong);
  color: #f7fcff;
}

.hero-button__content {
  display: grid;
  grid-template-columns: 1.5rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  column-gap: 12px;
  min-width: 0;
  width: 100%;
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
}

.hero-button__slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
}

.hero-button__slot--empty {
  visibility: hidden;
}

.hero-button__slot :deep(.q-icon) {
  font-size: 1.3rem;
}

.hero-button__label {
  white-space: nowrap;
  text-align: center;
}

.hero-pill {
  padding: 8px 12px;
  border: 1px solid rgba(241, 250, 255, 0.12);
  border-radius: 999px;
  background: rgba(241, 250, 255, 0.05);
  color: #d3f0ff;
  font-size: 0.84rem;
  font-weight: 600;
}

.preview-panel,
.feature-card,
.resource-card {
  overflow: hidden;
  border: 1px solid var(--landing-border);
  border-radius: 24px;
  background: var(--landing-surface);
  box-shadow: var(--landing-card-shadow);
}

.preview-panel {
  width: 100%;
  padding: 20px;
  background:
    linear-gradient(180deg, rgba(241, 250, 255, 0.08), rgba(241, 250, 255, 0.02)),
    rgba(12, 21, 31, 0.52);
  backdrop-filter: blur(8px);
}

.preview-panel__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.preview-panel__note,
.section-heading__text,
.feature-card__body,
.resource-card__body,
.resource-list__body {
  color: var(--landing-text-soft);
}

.preview-panel__note {
  color: var(--landing-note-text);
  font-size: 0.84rem;
  font-weight: 600;
}

.preview-panel__body {
  display: grid;
  gap: 20px;
}

.preview-panel__copy h2,
.section-heading__title,
.feature-card__title,
.resource-card__title {
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  color: #f7fcff;
}

.preview-panel__copy h2 {
  margin: 0 0 10px;
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  line-height: 1.2;
}

.preview-panel__copy p,
.section-heading__text,
.feature-card__body,
.resource-card__body,
.resource-list__body {
  margin: 0;
  line-height: 1.68;
}

.preview-stack {
  position: relative;
  min-height: clamp(250px, 30vw, 310px);
  padding: 10px 14px 6px;
}

.preview-stack--single {
  min-height: auto;
}

.preview-card {
  position: absolute;
  overflow: hidden;
  border: 1px solid rgba(241, 250, 255, 0.12);
  border-radius: 22px;
  background: rgba(241, 250, 255, 0.08);
  box-shadow: 0 22px 38px rgba(8, 18, 26, 0.22);
}

.preview-card :deep(.q-img) {
  display: block;
  width: 100%;
}

.preview-card--primary {
  top: 10px;
  left: 10px;
  width: min(82%, 300px);
  transform: rotate(-2deg);
}

.preview-card--secondary {
  right: 6px;
  bottom: 4px;
  width: min(56%, 220px);
  transform: rotate(4deg);
}

.preview-stack--single .preview-card--primary {
  position: relative;
  width: 100%;
  transform: none;
}

.feature-section,
.resource-section {
  margin-top: 28px;
}

.section-heading {
  max-width: 760px;
  margin: 0 auto 20px;
  text-align: center;
}

.section-heading__title {
  margin: 14px 0 10px;
  font-size: clamp(2rem, 4vw, 2.8rem);
  line-height: 1.12;
  text-wrap: balance;
}

.feature-grid,
.resource-section {
  display: grid;
  gap: 18px;
}

.feature-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.resource-section {
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
}

.feature-card,
.resource-card {
  position: relative;
  padding: 20px;
}

.feature-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(122, 209, 255, 0.55), transparent 65%);
}

.feature-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin-bottom: 14px;
  border-radius: 14px;
  background: rgba(122, 209, 255, 0.14);
  color: #d3f0ff;
  font-size: 1.35rem;
}

.feature-card__title,
.resource-card__title {
  margin: 0 0 10px;
  font-size: 1.16rem;
  line-height: 1.3;
}

.resource-card--primary {
  background:
    radial-gradient(circle at top right, rgba(122, 209, 255, 0.16), transparent 30%),
    var(--landing-surface-strong);
}

.resource-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--landing-border-strong);
  border-radius: 999px;
  background: rgba(241, 250, 255, 0.05);
  color: #ebf8ff;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background-color 0.22s ease;
}

.resource-list {
  display: grid;
  gap: 0;
  margin-top: 16px;
}

.resource-list__item {
  padding: 12px 0;
  border-top: 1px solid var(--landing-resource-item-border);
}

.resource-list__item:first-child {
  padding-top: 0;
  border-top: 0;
}

.resource-list__title {
  margin-bottom: 6px;
  font-family: "Sora", "Montserrat", "Segoe UI", sans-serif;
  font-size: 0.96rem;
  font-weight: 700;
  color: #d3f0ff;
}

.feature-card__body,
.resource-card__body {
  color: var(--landing-body-text);
  font-size: 0.97rem;
}

.resource-list__body {
  color: var(--landing-body-text);
  font-size: 0.93rem;
  line-height: 1.55;
}

@media (max-width: 1100px) {
  .hero__grid,
  .resource-section,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .preview-stack {
    min-height: 320px;
  }
}

@media (max-width: 700px) {
  .landing-page {
    padding: 18px 12px 30px;
  }

  .hero {
    padding: 24px 18px;
    border-radius: 24px;
  }

  .hero__copy {
    align-items: stretch;
  }

  .hero-buttons,
  .resource-card__actions {
    flex-direction: column;
  }

  .hero-button,
  .resource-link {
    justify-content: center;
  }

  .preview-stack {
    min-height: 260px;
    padding: 6px 0 0;
  }

  .preview-card--primary {
    position: relative;
    width: 100%;
    transform: none;
  }

  .preview-card--secondary {
    right: auto;
    bottom: auto;
    left: 18px;
    width: calc(100% - 36px);
    transform: translateY(-24px);
  }

  .feature-card,
  .resource-card {
    padding: 18px;
    border-radius: 20px;
  }
}

/* codex-theme-override:start */
.landing-page {
  --landing-page-text: #{$brand-light-text};
  --landing-heading: #{$brand-light-text};
  --landing-body-text: #{rgba($brand-light-text, 0.84)};
  --landing-note-text: #{rgba($brand-light-text, 0.66)};
  --landing-border: #{rgba($brand-secondary, 0.16)};
  --landing-border-strong: #{rgba($brand-secondary, 0.24)};
  --landing-surface: #{rgba($brand-light, 0.78)};
  --landing-surface-strong: #{rgba($brand-light, 0.92)};
  --landing-text-soft: #{rgba($brand-light-text, 0.78)};
  --landing-shadow: 0 28px 60px #{rgba($brand-primary, 0.14)};
  --landing-card-shadow: 0 16px 34px #{rgba($brand-secondary, 0.12)};
  --landing-chip-bg: #{rgba($brand-light, 0.52)};
  --landing-chip-text: #{$brand-primary};
  --landing-solid-bg: #{$brand-primary};
  --landing-solid-text: #{$brand-light};
  --landing-solid-shadow: 0 18px 30px #{rgba($brand-primary, 0.24)};
  --landing-ghost-bg: #{rgba($brand-light, 0.46)};
  --landing-ghost-text: #{$brand-light-text};
  --landing-pill-border: #{rgba($brand-secondary, 0.14)};
  --landing-pill-bg: #{rgba($brand-light, 0.44)};
  --landing-pill-text: #{$brand-primary};
  --landing-panel-gradient-top: #{rgba($brand-light, 0.7)};
  --landing-panel-gradient-bottom: #{rgba($brand-light, 0.22)};
  --landing-panel-bg: #{rgba($brand-light-bg, 0.88)};
  --landing-preview-card-border: #{rgba($brand-secondary, 0.18)};
  --landing-preview-card-bg: #{rgba($brand-light, 0.82)};
  --landing-preview-card-shadow: 0 22px 38px #{rgba($brand-secondary, 0.14)};
  --landing-accent-line: #{rgba($brand-primary, 0.4)};
  --landing-icon-bg: #{rgba($brand-primary, 0.1)};
  --landing-icon-color: #{$brand-primary};
  --landing-spot-accent: #{rgba($brand-primary, 0.14)};
  --landing-resource-link-bg: #{rgba($brand-light, 0.48)};
  --landing-resource-link-text: #{$brand-light-text};
  --landing-resource-item-border: #{rgba($brand-secondary, 0.1)};
  --landing-resource-item-bg: #{rgba($brand-light, 0.42)};
  --landing-accent-text: #{$brand-primary};
  --landing-mesh-color: #{rgba($brand-primary, 0.16)};
  --landing-hero-glow-1: #{rgba($brand-primary, 0.18)};
  --landing-hero-glow-2: #{rgba($brand-secondary, 0.12)};
  --landing-hero-start: #{rgba($brand-light, 0.96)};
  --landing-hero-end: #{rgba($brand-light-bg, 0.96)};
  color: var(--landing-page-text);
}

body.body--dark .landing-page {
  --landing-page-text: #{$brand-dark-text};
  --landing-heading: #{$brand-dark-text};
  --landing-body-text: #{rgba($brand-dark-text, 0.8)};
  --landing-note-text: #{rgba($brand-dark-text, 0.64)};
  --landing-border: #{rgba($brand-light, 0.12)};
  --landing-border-strong: #{rgba($brand-light, 0.2)};
  --landing-surface: #{rgba($dark-pill, 0.74)};
  --landing-surface-strong: #{rgba($dark-pill, 0.88)};
  --landing-text-soft: #{rgba($brand-dark-text, 0.82)};
  --landing-shadow: 0 28px 60px #{rgba($brand-dark-bg, 0.28)};
  --landing-card-shadow: 0 16px 34px #{rgba($brand-dark-bg, 0.24)};
  --landing-chip-bg: #{rgba($brand-light, 0.08)};
  --landing-chip-text: #{$brand-primary};
  --landing-solid-bg: #{$brand-light};
  --landing-solid-text: #{$brand-dark-bg};
  --landing-solid-shadow: 0 18px 30px #{rgba($brand-dark-bg, 0.28)};
  --landing-ghost-bg: #{rgba($brand-light, 0.08)};
  --landing-ghost-text: #{$brand-dark-text};
  --landing-pill-border: #{rgba($brand-light, 0.12)};
  --landing-pill-bg: #{rgba($brand-light, 0.05)};
  --landing-pill-text: #{$brand-primary};
  --landing-panel-gradient-top: #{rgba($brand-light, 0.08)};
  --landing-panel-gradient-bottom: #{rgba($brand-light, 0.02)};
  --landing-panel-bg: #{rgba($brand-dark-bg, 0.56)};
  --landing-preview-card-border: #{rgba($brand-light, 0.12)};
  --landing-preview-card-bg: #{rgba($brand-dark-bg, 0.78)};
  --landing-preview-card-shadow: 0 22px 38px #{rgba($brand-dark-bg, 0.28)};
  --landing-accent-line: #{rgba($brand-primary, 0.55)};
  --landing-icon-bg: #{rgba($brand-primary, 0.16)};
  --landing-icon-color: #{$brand-primary};
  --landing-spot-accent: #{rgba($brand-primary, 0.18)};
  --landing-resource-link-bg: #{rgba($brand-light, 0.06)};
  --landing-resource-link-text: #{$brand-dark-text};
  --landing-resource-item-border: #{rgba($brand-light, 0.08)};
  --landing-resource-item-bg: #{rgba($brand-light, 0.04)};
  --landing-accent-text: #{$brand-primary};
  --landing-mesh-color: #{rgba($brand-light, 0.12)};
  --landing-hero-glow-1: #{rgba($brand-primary, 0.22)};
  --landing-hero-glow-2: #{rgba($brand-light, 0.08)};
  --landing-hero-start: #{rgba($brand-dark-bg, 0.96)};
  --landing-hero-end: #{rgba($dark-pill, 0.96)};
}

.hero {
  background:
    radial-gradient(circle at top left, var(--landing-hero-glow-1), transparent 34%),
    radial-gradient(circle at 82% 20%, var(--landing-hero-glow-2), transparent 20%),
    linear-gradient(145deg, var(--landing-hero-start), var(--landing-hero-end));
  box-shadow: var(--landing-shadow);
}

.hero__mesh {
  background: radial-gradient(circle, var(--landing-mesh-color), transparent 68%);
}

.hero__eyebrow,
.section-heading__eyebrow,
.resource-card__eyebrow,
.preview-panel__kicker {
  border-color: var(--landing-border-strong);
  background: var(--landing-chip-bg);
  color: var(--landing-chip-text);
}

.hero-title,
.hero-subtitle,
.preview-panel__copy h2,
.section-heading__title,
.feature-card__title,
.resource-card__title {
  color: var(--landing-heading);
}

.hero-button--solid {
  background: var(--landing-solid-bg);
  color: var(--landing-solid-text);
  box-shadow: var(--landing-solid-shadow);
}

.hero-button--ghost {
  background: var(--landing-ghost-bg);
  border-color: var(--landing-border-strong);
  color: var(--landing-ghost-text);
}

.hero-pill {
  border-color: var(--landing-pill-border);
  background: var(--landing-pill-bg);
  color: var(--landing-pill-text);
}

.preview-panel,
.feature-card,
.resource-card {
  background: var(--landing-surface);
  box-shadow: var(--landing-card-shadow);
}

.preview-panel {
  background:
    linear-gradient(
      180deg,
      var(--landing-panel-gradient-top),
      var(--landing-panel-gradient-bottom)
    ),
    var(--landing-panel-bg);
}

.preview-card {
  border-color: var(--landing-preview-card-border);
  background: var(--landing-preview-card-bg);
  box-shadow: var(--landing-preview-card-shadow);
}

.feature-card::before {
  background: linear-gradient(90deg, var(--landing-accent-line), transparent 65%);
}

.feature-card__icon {
  background: var(--landing-icon-bg);
  color: var(--landing-icon-color);
}

.resource-card--primary {
  background:
    radial-gradient(circle at top right, var(--landing-spot-accent), transparent 30%),
    var(--landing-surface-strong);
}

.resource-link {
  border-color: var(--landing-border-strong);
  background: var(--landing-resource-link-bg);
  color: var(--landing-resource-link-text);
}

.resource-list__item {
  border-color: var(--landing-resource-item-border);
}

.resource-list__title {
  color: var(--landing-accent-text);
}
/* codex-theme-override:end */
</style>

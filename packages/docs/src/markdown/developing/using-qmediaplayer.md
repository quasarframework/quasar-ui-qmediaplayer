---
title: Using QMediaPlayer
desc: How to use QMediaPlayer
keys: developing
examples: QMediaPlayer
---

QMediaPlayer gives Quasar apps a consistent audio and video player experience without forcing you back to browser-default media controls. Start with a source list, then layer in colors, captions, poster images, dense layouts, custom icon sets, or language packs as the UI needs them.

> Music courtesy of [Free Music Archive](https://freemusicarchive.org/music/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Upbeat_Party). Videos and subtitles courtesy of [Blender Foundation](https://durian.blender.org/download/) and [Tears of Steel](https://mango.blender.org/download/).

::: warning
Some example videos are remotely hosted and may load slowly or fail depending on your network location.
:::

Need adaptive streaming adapters, runtime blobs, custom language or icon sets, overlays, or deeper styling hooks? See the [Advanced page](/developing/advanced) after the basics here.

## API

<script import>
import QMediaPlayerApi from '@quasar/quasar-ui-qmediaplayer/dist/api/QMediaPlayer.json'
</script>

<MarkdownApi :api="QMediaPlayerApi" name="QMediaPlayer"/>

## Basic Playback

Start with `type` and either `source` or `sources`. Audio and video share the same component API, so switching between media types usually means changing the source data rather than rebuilding the UI.

<MarkdownExample title="Audio Basic" file="AudioBasic"/>

<MarkdownExample title="Video Basic" file="VideoBasic"/>

## Auto Pause

Use `auto-pause` when videos live inside long documentation pages, feeds, dashboards, or galleries where playback should stop once the player is no longer visible. QMediaPlayer pauses when the component is completely outside the viewport and intentionally does not auto-resume.

<MarkdownExample title="Video Auto Pause" file="VideoAutoPause"/>

## Color

Use color props to align the player with your design system. The big play button can be customized separately, which is useful when the video poster needs a stronger call to action.

<MarkdownExample title="Audio Color" file="AudioColor"/>

<MarkdownExample title="Video Color" file="VideoColor"/>

<MarkdownExample title="Video Big Play Button Color" file="VideoBigPlayButtonColor"/>

## Background Color

Background colors help audio players feel intentional in cards, drawers, and hero sections where there is no video poster to carry the visual design.

<MarkdownExample title="Audio Background Color" file="AudioBackgroundColor"/>

<MarkdownExample title="Video Background Color" file="VideoBackgroundColor"/>

## Poster

Poster images are useful for setting context before playback starts, especially when videos appear in content-heavy pages. Use `fallback-poster` when you want a reusable default image while still letting an explicit `poster` take precedence.

<MarkdownExample title="Video Poster" file="VideoPoster"/>

<MarkdownExample title="Video Fallback Poster" file="VideoFallbackPoster"/>

Native audio elements do not support poster images. When audio needs artwork, use the video player mode with an audio source.

<MarkdownExample title="Audio With Poster" file="AudioWithPoster"/>

## Dark

Dark mode variants let media sit naturally inside dashboards, video galleries, or dark-themed documentation pages.

<MarkdownExample title="Audio Dark" file="AudioDark"/>

<MarkdownExample title="Video Dark" file="VideoDark"/>

## Dense

Dense controls are a good fit for compact cards, sidebars, and other constrained layouts.

<MarkdownExample title="Audio Dense" file="AudioDense"/>

<MarkdownExample title="Video Dense" file="VideoDense"/>

## Audio Without Video

By default, QMediaPlayer can use the `video` element for audio playback. If that causes platform-specific issues, use `no-video` to force an `audio` element.

<MarkdownExample title="Audio No Video" file="AudioNoVideo"/>

## Volume Controls

Hide the volume slider when space is tight or when volume should be managed elsewhere in the application.

<MarkdownExample title="Audio Hide Volume Slider" file="AudioHideVolumeSlider"/>

<MarkdownExample title="Video Hide Volume Slider" file="VideoHideVolumeSlider"/>

<MarkdownExample title="Audio Hide Volume Slider Dense" file="AudioHideVolumeSliderDense"/>

<MarkdownExample title="Video Hide Volume Slider Dense" file="VideoHideVolumeSliderDense"/>

## Disabled Seek

Disable seeking when the media experience should be linear, such as training content, onboarding videos, or guided audio.

<MarkdownExample title="Audio Disabled Seek" file="AudioDisabledSeek"/>

<MarkdownExample title="Video Disabled Seek" file="VideoDisabledSeek"/>

## Bottom Controls

Bottom controls keep actions predictable for larger videos and layouts where overlay controls would fight with the media content.

::: tip
You do not have to use `type="audio"` to play audio. The `type="video"` mode can also play audio sources.
:::

<MarkdownExample title="Audio Bottom Controls" file="AudioBottomControls"/>

<MarkdownExample title="Video Bottom Controls" file="VideoBottomControls"/>

## Portrait And Mobile

QMediaPlayer supports portrait media and mobile-friendly controls. `mobile-mode` turns off the hover-driven controls window so tapping the video toggles the controls display.

<MarkdownExample title="Video Portrait" file="VideoPortrait"/>

<MarkdownExample title="Video Mobile Mode" file="VideoMobileMode"/>

## Sources

Use `source` for a single source or `sources` when the browser should choose from multiple formats.

<MarkdownExample title="Audio Source" file="AudioSource"/>

<MarkdownExample title="Video Source" file="VideoSource"/>

## Tracks

Tracks are captions or subtitles. Start playback, then use the options menu to choose a language track.

<MarkdownExample title="Video Tracks" file="VideoTracks"/>

In the example below, the default language track is French.

<MarkdownExample title="Video Tracks Language" file="VideoTracksLanguage"/>

For adaptive streaming, runtime files, overlays, icon sets, localization, and deeper styling, continue with the [Advanced page](/developing/advanced).

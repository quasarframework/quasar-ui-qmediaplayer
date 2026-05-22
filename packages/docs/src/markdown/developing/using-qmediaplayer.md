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

## API

<script import>
import QMediaPlayerApi from '@quasar/quasar-ui-qmediaplayer/dist/api/QMediaPlayer.json'
</script>

<MarkdownApi :api="QMediaPlayerApi" name="QMediaPlayer"/>

## Basic Playback

Start with `type` and either `source` or `sources`. Audio and video share the same component API, so switching between media types usually means changing the source data rather than rebuilding the UI.

<MarkdownExample title="Audio Basic" file="AudioBasic" no-github no-edit/>

<MarkdownExample title="Video Basic" file="VideoBasic" no-github no-edit/>

## Auto Pause

Use `auto-pause` when videos live inside long documentation pages, feeds, dashboards, or galleries where playback should stop once the player is no longer visible. QMediaPlayer pauses when the component is completely outside the viewport and intentionally does not auto-resume.

<MarkdownExample title="Video Auto Pause" file="VideoAutoPause" no-github no-edit/>

## Color

Use color props to align the player with your design system. The big play button can be customized separately, which is useful when the video poster needs a stronger call to action.

<MarkdownExample title="Audio Color" file="AudioColor" no-github no-edit/>

<MarkdownExample title="Video Color" file="VideoColor" no-github no-edit/>

<MarkdownExample title="Video Big Play Button Color" file="VideoBigPlayButtonColor" no-github no-edit/>

## Background Color

Background colors help audio players feel intentional in cards, drawers, and hero sections where there is no video poster to carry the visual design.

<MarkdownExample title="Audio Background Color" file="AudioBackgroundColor" no-github no-edit/>

<MarkdownExample title="Video Background Color" file="VideoBackgroundColor" no-github no-edit/>

## Poster

Poster images are useful for setting context before playback starts, especially when videos appear in content-heavy pages.

<MarkdownExample title="Video Poster" file="VideoPoster" no-github no-edit/>

## Dark

Dark mode variants let media sit naturally inside dashboards, video galleries, or dark-themed documentation pages.

<MarkdownExample title="Audio Dark" file="AudioDark" no-github no-edit/>

<MarkdownExample title="Video Dark" file="VideoDark" no-github no-edit/>

## Dense

Dense controls are a good fit for compact cards, sidebars, and other constrained layouts.

<MarkdownExample title="Audio Dense" file="AudioDense" no-github no-edit/>

<MarkdownExample title="Video Dense" file="VideoDense" no-github no-edit/>

## Audio Without Video

By default, QMediaPlayer can use the `video` element for audio playback. If that causes platform-specific issues, use `no-video` to force an `audio` element.

<MarkdownExample title="Audio No Video" file="AudioNoVideo" no-github no-edit/>

## Volume Controls

Hide the volume slider when space is tight or when volume should be managed elsewhere in the application.

<MarkdownExample title="Audio Hide Volume Slider" file="AudioHideVolumeSlider" no-github no-edit/>

<MarkdownExample title="Video Hide Volume Slider" file="VideoHideVolumeSlider" no-github no-edit/>

<MarkdownExample title="Audio Hide Volume Slider Dense" file="AudioHideVolumeSliderDense" no-github no-edit/>

<MarkdownExample title="Video Hide Volume Slider Dense" file="VideoHideVolumeSliderDense" no-github no-edit/>

## Disabled Seek

Disable seeking when the media experience should be linear, such as training content, onboarding videos, or guided audio.

<MarkdownExample title="Audio Disabled Seek" file="AudioDisabledSeek" no-github no-edit/>

<MarkdownExample title="Video Disabled Seek" file="VideoDisabledSeek" no-github no-edit/>

## Bottom Controls

Bottom controls keep actions predictable for larger videos and layouts where overlay controls would fight with the media content.

::: tip
You do not have to use `type="audio"` to play audio. The `type="video"` mode can also play audio sources.
:::

<MarkdownExample title="Audio Bottom Controls" file="AudioBottomControls" no-github no-edit/>

<MarkdownExample title="Video Bottom Controls" file="VideoBottomControls" no-github no-edit/>

## Portrait And Mobile

QMediaPlayer supports portrait media and mobile-friendly controls. `mobile-mode` turns off the hover-driven controls window so tapping the video toggles the controls display.

<MarkdownExample title="Video Portrait" file="VideoPortrait" no-github no-edit/>

<MarkdownExample title="Video Mobile Mode" file="VideoMobileMode" no-github no-edit/>

## Sources

Use `source` for a single source or `sources` when the browser should choose from multiple formats.

<MarkdownExample title="Audio Source" file="AudioSource" no-github no-edit/>

<MarkdownExample title="Video Source" file="VideoSource" no-github no-edit/>

## Source Blobs

Blob sources let you play media created or fetched at runtime. Use `loadBlob()` when you already have a `File` or `Blob`, such as data from `QFile`, a drag-and-drop flow, or a generated media object. The player creates and cleans up the object URL for you. The older `loadFileBlob()` helper remains available for native `FileList` values.

<MarkdownExample title="Audio Source Blob" file="AudioSourceBlob" no-github no-edit/>

<MarkdownExample title="Video Source Blob" file="VideoSourceBlob" no-github no-edit/>

## Tracks

Tracks are captions or subtitles. Start playback, then use the options menu to choose a language track.

<MarkdownExample title="Video Tracks" file="VideoTracks" no-github no-edit/>

In the example below, the default language track is French.

<MarkdownExample title="Video Tracks Language" file="VideoTracksLanguage" no-github no-edit/>

## Language

QMediaPlayer uses Quasar's language support indirectly. When the Quasar language changes, QMediaPlayer labels change with it.

Not all languages have been translated yet. If you can help, please open a pull request with a language pack.

<MarkdownExample title="Video Language" file="VideoLanguage" no-github no-edit/>

## Icon Sets And Slots

Icon sets and slots help you fit the player into stricter brand systems or specialized UIs.

<MarkdownExample title="Video Icon Set" file="VideoIconSet" no-github no-edit/>

<MarkdownExample title="Video Slot" file="VideoSlot" no-github no-edit/>

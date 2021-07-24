---
title: Using QMediaPlayer
desc: How to use QMediaPlayer
keys: developing
components:
  - apis/QMediaPlayerJsonApi
---
## API
<q-media-player-json-api />

> Music courtesy of [Free Music Archive](https://freemusicarchive.org/music/Scott_Holmes/Inspiring__Upbeat_Music/Scott_Holmes_-_Upbeat_Party)
> Videos and subtitles courtesy of [Blender Organization](https://mango.blender.org/download) and [here](https://durian.blender.org/download/)

::: warning
The videos are remotely hosted and may have issues loading depending where you live
:::


## QMediaPlayer Examples

### Basic

<example-viewer
  title="Audio basic"
  file="AudioBasic"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video basic"
  file="VideoBasic"
  codepen-title="QMediaPlayer"
/>

### Color

<example-viewer
  title="Audio color"
  file="AudioColor"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video color"
  file="VideoColor"
  codepen-title="QMediaPlayer"
/>

::: tip
The color of the Big Play Button can also be changed independently. Test out the hover!
:::

<example-viewer
  title="Video Big Play Button color"
  file="VideoBigPlayButtonColor"
  codepen-title="QMediaPlayer"
/>

### Background color

<example-viewer
  title="Audio background color"
  file="AudioBackgroundColor"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video background color"
  file="VideoBackgroundColor"
  codepen-title="QMediaPlayer"
/>

### Poster

<example-viewer
  title="Video poster"
  file="VideoPoster"
  codepen-title="QMediaPlayer"
/>

### Dark

<example-viewer
  title="Audio dark"
  file="AudioDark"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video dark"
  file="VideoDark"
  codepen-title="QMediaPlayer"
/>

### Dense

<example-viewer
  title="Audio dense"
  file="AudioDense"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video dense"
  file="VideoDense"
  codepen-title="QMediaPlayer"
/>

### No video (on audio)

By default, the media player uses the `video` element for playing audio files. If this causes an issue for you, use the `no-video` property to specifically use the `audio` element.

<example-viewer
  title="Audio no video"
  file="AudioNoVideo"
  codepen-title="QMediaPlayer"
/>

### Hide volume slider

<example-viewer
  title="Audio hide volume slider"
  file="AudioHideVolumeSlider"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video hide volume slider"
  file="VideoHideVolumeSlider"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Audio hide volume slider (dense)"
  file="AudioHideVolumeSliderDense"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video hide volume slider (dense)"
  file="VideoHideVolumeSliderDense"
  codepen-title="QMediaPlayer"
/>

### Disabled seek

<example-viewer
  title="Audio disabled seek"
  file="AudioDisabledSeek"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video disabled seek"
  file="VideoDisabledSeek"
  codepen-title="QMediaPlayer"
/>

### Bottom controls

::: tip
You do not have to use the `type="audio"` to play audio. The property `type="video"` also works!
:::

<example-viewer
  title="Audio bottom controls"
  file="AudioBottomControls"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video bottom controls"
  file="VideoBottomControls"
  codepen-title="QMediaPlayer"
/>

### Portrait

<example-viewer
  title="Video portrait"
  file="VideoPortrait"
  codepen-title="QMediaPlayer"
/>

### Mobile mode

The `mobile-mode` property is available to turn off the hover effect that displays the controls window. With `mobile-mode` touching (clicking) the video will toggle the controls display. You can use this property for desktops too!

<example-viewer
  title="Video mobile mode"
  file="VideoMobileMode"
  codepen-title="QMediaPlayer"
/>

### Source

Besides the `sources` property, you can use the `source` property to manage a single track.

<example-viewer
  title="Audio source"
  file="AudioSource"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video source"
  file="VideoSource"
  codepen-title="QMediaPlayer"
/>

### Source (blob)

Both examples below use the `autoplay` property.

<example-viewer
  title="Audio source (blob)"
  file="AudioSourceBlob"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video source (blob)"
  file="VideoSourceBlob"
  codepen-title="QMediaPlayer"
/>

### Tracks

> Tracks, are also known as captions or subtitles. When enabled, it can be changed from the configuration icon.

::: tip
You will have to play the video to see the tracks (captions) in action. Don't forget to manually set a language from the options menu button.
:::

<example-viewer
  title="Video tracks"
  file="VideoTracks"
  codepen-title="QMediaPlayer"
/>

In the example below, the default language track has been set to French.

<example-viewer
  title="Video tracks language"
  file="VideoTracksLanguage"
  codepen-title="QMediaPlayer"
/>

### Language

Not all languages have been translated. If you can help out, please [PR a language pack](https://github.com/quasarframework/quasar-ui-qmediaplayer/tree/next/src/component/lang).

> QMediaPlayer does not have a property to set the language directly. It uses Quasar's internal language support indirectly. When that switches, then QMediaPlayer also switches to that language.

<example-viewer
  title="Video language"
  file="VideoLanguage"
  codepen-title="QMediaPlayer"
/>

### Icon sets

> QMediaPlayer does not have a property to set the icon set directly. It uses Quasar's internal icon set support indirectly. When that switches, then QMediaPlayer also switches to the corresponding icon set.
In the examples below, when the icon set is changed, you will notice that all media players on this page also change their icon set.

<example-viewer
  title="Video icon set"
  file="VideoIconSet"
  codepen-title="QMediaPlayer"
/>

### Slot

The example below is using the `overlay` slot. In this case, it's added a Quasar logo watermark to the upper-left. However, you can add whatever you want. For instance, when a video is close to ending, you could add a short carousel of available videos (similar to what YouTube and Netflix do).

<example-viewer
  title="Video slot"
  file="VideoSlot"
  codepen-title="QMediaPlayer"
/>

### Video - start time

You can define the audio/video media time fragment using a `#t=` parameter. It accepts a start and an end time (optional) and can be given in seconds or real time.

Example: `ElephantsDream.mp4#t=90` (seconds) to start at time at 01:30.
Example: `ElephantsDream.mp4#t=,90` (seconds) to start at time at 0 and stop at 01:30.

The _real time_ is given in _hours:minutes:seconds_. Example: `ElephantsDream.mp4#t=00:01:05` to start at time at 01:05 or `ElephantsDream.mp4#t=00:01:05,00:02:05` to start at 1:05 and end at 2:05.

::: danger
To play framments, you need to make sure **Range Requests** are supported by your server: check for `Accept Ranges: bytes`. It's on by default for Apache and many other servers, but worth checking.
:::

::: warning
Internet Explorer 11 ignores the start time fragment parameter
:::

::: tip
If you look at the source for this example, look at the end of the `src` line (in `sources`). While this has been added statically, you can also create it dynamically.
:::

::: tip
In this example, we are also using `mobile-mode` so the controls show displayed at start up, so you can see the starting time.
:::

<example-viewer
  title="Video start time"
  file="VideoStartTime"
  codepen-title="QMediaPlayer"
/>

### Plays inline

<example-viewer
  title="Audio playsinline"
  file="AudioPlaysinline"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video playsinline"
  file="VideoPlaysinline"
  codepen-title="QMediaPlayer"
/>

<example-viewer
  title="Video playsinline (bottom controls)"
  file="VideoPlaysinlineBottomControls"
  codepen-title="QMediaPlayer"
/>

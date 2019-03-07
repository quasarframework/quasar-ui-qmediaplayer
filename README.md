QMediaPlayer
===

QMediaPlayer is an `app extension` for [Quasar Framework v1](https://v1.quasar-framework.org/). It will not work with legacy versions of Quasar Framework.

This work is currently in `alpha` and there are expected changes while things get worked out.

> WARNING
>
> This app extension has been updated to work with changes that were released with `@quasar/app - 1.0.0-beta.9`. If you have not upgraded to at least `1.0.0-beta.9` this app extension will not work.

If you have installed before `@quasar/app - 1.0.0-beta.9` (or later) then follow these before upgrading Quasar if you previously had this extension installed:

1) Remove: `quasar ext -r @quasar/qmediaplayer`
2) Upgrade: `yarn upgrade`
3) Re-install: `quasar ext add @quasar/qmediaplayer`

# Installation
In your Quasar project:
```
quasar ext add @quasar/qmediaplayer
```

# Test Project
Can be found [here](https://github.com/hawkeye64/quasar-app-extension-qmediaplayer-test).

# Demo
Can be found [here](https://romantic-gates-e70b63.netlify.com/#/).

# Example Code
TBD

# Language Files

We need help translating the language files. They are all currently using English. If you know another language, please PR and help us out.

---

# QMediaPlayer Vue Properties
| Vue&nbsp;Property | Type	| Mode | Description |
|---|---|---|---|
| type | String | Both | ['video','audio'] This determines the type of player. (Default: 'video') |
| color | String | Both | One from Quasar Color Palette. It determines the color of the MediaPlayer controls. (Default: 'white')|
mobile-mode	| Boolean	| Video	| In normal mode, the controls show/hide with mouse movements. When set to true, the controls' visibility is controlled by touch/click. (Default: false)
sources	| Array | Both | Required. This is an array of one or more objects, that looks like this: { **src**: 'https://your-server/your-video.mov', **type**:  'video/mp4' }
poster | String | Video |The poster image to display before the video is started.
tracks | Array | Video | This is an array of one or more objects, that looks like this: { **src**: 'https://your-server//path-to-subtitles-en.vtt', **kind**: 'subtitles', **srclang**: 'en', **label**: 'English }
track-language | String | Video | A value that corresponds to the **'label'** attribute of the **'tracks'** property. This will be the default language.
preload | String | Both | ['none', 'metadata', 'auto'] Provides a hint to the browser about what the author thinks will lead to the best user experience. (Default: 'metadata').
dense | Boolean | Both | When true displays controls window on one line.
dark | Boolean | Both | When component is rendered on a dark background.
autoplay | Boolean | Both | Automatically start video/audio when it is ready to play. (Default: false)
cross-origin | String,null | Both | [null, 'anonymous', 'use-credentials']
volume | Number | Both | A value from 0-100 (as a percentage). (Default: 60)
muted | Boolean | Both | If the player should be muted. (Default: false)
show-big-play-button | Boolean | Video | Show/hide the Big Play Button. (Default: true)
show-spinner | Boolean | Both | If the spinner should be displayed while video/audio is loading. (Default: true)
controls-display-time | Number | Video | The amount of idle time in milliseconds to wait before hiding the controls (default 2000). This is applied when the mouse cursor is within the QMediaPlayer window but has not moved.
playback-rates | Array | Video | This is an array of one or more objects, that look like this: { **label**: '.5x', **value**: 0.5 }. **Note:** The default playbackRates include 0.5, 1, 1.5 and 2.0."
playback-rate | Number | Video | Corresponds to the value in playback-rates.
background-color | String | Both | One from Quasar Color Palette. It determines the background color of the MediaPlayer. (Default: 'black')

**cross-origin:**

Whether to use CORS for fetching assets.

1. **anonymous** - CORS requests for this element will not have the credentials flag set.
2. **use-credentials** - CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
3. **null** - do not use CORS.

**preload:**

This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:

1. **none**: Indicates that the audio should not be preloaded.
2. **metadata**: Indicates that only audio metadata (e.g. length) is fetched.
3. **auto**: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.


# QMediaPlayer Vue Methods

| Vue&nbsp;Method | Mode | Description |
|---|---|---|
showControls() | Video | Show the controls.
hideControls() | Video | Hide the controls.
toggleControls() | Video | Toggle the controls.
togglePlay() | Both | Toggles between play/pause states.
toggleMuted() | Both | Toggles between mute/unmute states..
toggleFullscreen() | Video | Toggle fullscreen mode.
setCurrentTime(seconds) | Both | Set the current time of the video/audio player (in seconds).
setVolume(percent) | Both | Sets the volume as a percent (0-100).

# QMediaPlayer Vue Events

| Vue&nbsp;Event | Mode | Description |
|---|---|---|
@loaded() | Both | Emitted when the media has been loaded.
@ready() | Both | Emitted when the media is ready to play. You cannot play/pause or setCurrentTime before this event.
@duration(seconds) | Both | Emitted when the duration of the media has been determined.
@ended() | Both | Emitted when the media has finished playing.
@error(MediaError) | Both | Emitted when there is a media error.
@paused() | Both | Emitted when the media is paused.
@playing() | Both | Emitted when the media starts playing. This will also emit after a pause or a wait.
@timeupdate(curTime, remaining) | Both | Emitted wenever there is a time update (during play).
@fullscreen(true/false) | Video | Emitted when entering/exiting fullscreen mode.
@waiting() | Both | Emitted when the media player goes into a wait state (typically waiting while downloading)
@showControls(true/false) | Video | Emitted when the Controls are toggled (show/hide).
@volume(percent) | Both | Emitted when the volume changes.
@muted(true/false) | Both | Emitted when the mute changes.

# QMediaPlayer Vue Slots

| Vue&nbsp;Slots | Mode | Description |
|---|---|---|
| old-browser | Both | When the browser does not support HTML5 (or has Javascript turned off).
| overlay | Both | Used to overlay any HTML over the media window.
| error-window | Both | Used to display an error.
| controls | Both | With this slot all of the controls can be replaced.
| spinner | Both | With this slot the loading spinner can be replaced.
big-play-button | Video | With this slot the Big Play Button can be replaced.
display-time | Both | With this slot the display time can be replaced.
position-slider | Both | With this slot the positioning slider can be replaced.
duration-time | Both | With this slot the duration time can be replaced.
play | Both | With this slot the play button can be replaced.
volume | Both | With this slot the volume mute/unmute button can be replaced.
volume-slider | Both | With this slot the volume slider can be replaced.
settings | Video | With this slot the Settings icon can be replaced.
settings-menu | Video | With this slot the Settings Menu can be replaced.
fullscreen | Video | With this slot the Fullscreen icon can be replaced.

# Patreon
If you like (and use) this App Extension, please consider becoming a Quasar [Patreon](https://www.patreon.com/quasarframework).

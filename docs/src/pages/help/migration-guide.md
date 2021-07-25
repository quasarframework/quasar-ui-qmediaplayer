---
title: Migration Guide
desc: Migrate from v1 to v2
keys: Help
related:
  - /all-about-qmediaplayer/installation-types
  - /contributing/sponsor
---

The information below can help you migrate from QMediaPlayer v1.x to QMediaPlayer v2.0.0.

> QMediaPlayer v2.x+ only works with a Vue 3 instance. If you are still using Vue 2, use the [QMediaPlayer v1 branch]() (TODO: not created yet).

> The information below is by no means an exhaustive list of changes and new functionality. If you see something that has been missed, please PR or let us know. Also check the [Changelog](/latest-news/changelog) page for ungoing updates.

## QMediaPlayer v2.0.0 (Alpha/Beta)
Welcome to the QMediaPlayer v2.0.0 release.

> Until the final stable version is released, some aspects of the calendar may change. We're not planning for additional breaking changes, but unforeseen reported issues may require us to do breaking changes (unlikely, but keep this in mind). So please make sure that you read each v2 alpha/beta version's release notes carefully before upgrading.

## QMediaPlayer rewritten to use Vue v3 Composition API
This means you get better in-editor auto-completion support amongst many other advantages.

## Changes

The following properties were removed:

| Property |
| --- |
| color |
| background-color |
| big-play-button-color |

These have been replaces with CSS vars which will give you better control.

```css
  --mediaplayer-color                     : #ffffff
  --mediaplayer-background                : #000000
  --big-play-button-color                 : #ffffff
  --big-play-button-background            : #90a4ae
  --big-play-button-border                : #ffffff 1px solid
  --big-play-button-border-hover          : #ffffff 1px solid
  --big-play-button-hover-color           : #90a4ae
  --big-play-button-hover-background      : rgba(255, 255, 255, 0.20)

  --mediaplayer-color-dark                : #c0c0c0
  --mediaplayer-background-dark           : #1d1d1d
  --big-play-button-color-dark            : #ffffff
  --big-play-button-background-dark       : #90a4ae
  --big-play-button-border-dark           : #ffffff 1px solid
  --big-play-button-border-hover-dark     : #ffffff 1px solid
  --big-play-button-hover-color-dark      : #90a4ae
  --big-play-button-hover-background-dark : rgba(255, 255, 255, 0.20)
```

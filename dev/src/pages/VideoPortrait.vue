<template>
  <div class="column col">
    <div style="max-width: 100%">
      <q-media-player
        type="video"
        :sources="sources"
        style="height: 400px; text-align: center;"
      />
    </div>
    <div>Video by <strong><a target="_blank" href="https://www.pexels.com/@ono-kosuki?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels">Ono  Kosuki</a></strong> from <strong><a target="_blank" href="https://www.pexels.com/photo/a-woman-texting-on-her-cellphone-5974545/?utm_content=attributionCopyText&amp;utm_medium=referral&amp;utm_source=pexels">Pexels</a></strong></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sources: [
        {
          src: 'media/pexels-ono-kosuki-5974545.mp4',
          type: 'video/mp4'
        }
      ]
    }
  }
}
</script>

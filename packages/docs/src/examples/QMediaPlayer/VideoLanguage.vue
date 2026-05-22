<template>
  <div class="q-pa-md q-gutter-sm">
    <q-select
      v-model="lang"
      :options="langOptions"
      label="Language"
      dense
      borderless
      emit-value
      map-options
      options-dense
      style="min-width: 150px"
      class="q-ma-sm"
    />
    <q-media-player type="video" :sources="sources" :tracks="tracks" />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";
import { useQuasar } from "quasar";
import languages from "quasar/lang/index.json";
import { QMediaPlayer } from "@quasar/quasar-ui-qmediaplayer";
import "@quasar/quasar-ui-qmediaplayer/dist/index.css";

defineOptions({ name: "VideoLanguage" });

interface LanguageOption {
  isoName: string;
  nativeName: string;
}

const sources = [
  {
    src: "https://ftp.nluug.nl/pub/graphics/blender/demo/movies/ToS/tears_of_steel_720p.mov",
    type: "video/mp4",
  },
];
const tracks = [
  {
    src: "/media/TearsOfSteel/TOS-en.vtt",
    kind: "subtitles",
    srclang: "en",
    label: "English",
  },
  {
    src: "/media/TearsOfSteel/TOS-de.vtt",
    kind: "subtitles",
    srclang: "de",
    label: "German",
  },
  {
    src: "/media/TearsOfSteel/TOS-es.vtt",
    kind: "subtitles",
    srclang: "es",
    label: "Spanish",
  },
  {
    src: "/media/TearsOfSteel/TOS-fr-Goofy.vtt",
    kind: "subtitles",
    srclang: "fr",
    label: "French",
  },
  {
    src: "/media/TearsOfSteel/TOS-it.vtt",
    kind: "subtitles",
    srclang: "it",
    label: "Italian",
  },
  {
    src: "/media/TearsOfSteel/TOS-nl.vtt",
    kind: "subtitles",
    srclang: "nl",
    label: "Dutch",
  },
];
const $q = useQuasar();
const lang = ref($q.lang.isoName);
const langOptions = ref<Array<{ label: string; value: string }>>([]);
const quasarLangLoaders = {
  ar: () => import("quasar/lang/ar"),
  "ar-TN": () => import("quasar/lang/ar-TN"),
  "az-Latn": () => import("quasar/lang/az-Latn"),
  bg: () => import("quasar/lang/bg"),
  bn: () => import("quasar/lang/bn"),
  "bs-BA": () => import("quasar/lang/bs-BA"),
  ca: () => import("quasar/lang/ca"),
  cs: () => import("quasar/lang/cs"),
  da: () => import("quasar/lang/da"),
  de: () => import("quasar/lang/de"),
  "de-CH": () => import("quasar/lang/de-CH"),
  "de-DE": () => import("quasar/lang/de-DE"),
  el: () => import("quasar/lang/el"),
  "en-GB": () => import("quasar/lang/en-GB"),
  "en-US": () => import("quasar/lang/en-US"),
  eo: () => import("quasar/lang/eo"),
  es: () => import("quasar/lang/es"),
  et: () => import("quasar/lang/et"),
  eu: () => import("quasar/lang/eu"),
  fa: () => import("quasar/lang/fa"),
  "fa-IR": () => import("quasar/lang/fa-IR"),
  fi: () => import("quasar/lang/fi"),
  fr: () => import("quasar/lang/fr"),
  gn: () => import("quasar/lang/gn"),
  he: () => import("quasar/lang/he"),
  hi: () => import("quasar/lang/hi"),
  hr: () => import("quasar/lang/hr"),
  hu: () => import("quasar/lang/hu"),
  id: () => import("quasar/lang/id"),
  is: () => import("quasar/lang/is"),
  it: () => import("quasar/lang/it"),
  ja: () => import("quasar/lang/ja"),
  kk: () => import("quasar/lang/kk"),
  km: () => import("quasar/lang/km"),
  "ko-KR": () => import("quasar/lang/ko-KR"),
  "kur-CKB": () => import("quasar/lang/kur-CKB"),
  lt: () => import("quasar/lang/lt"),
  lu: () => import("quasar/lang/lu"),
  lv: () => import("quasar/lang/lv"),
  mk: () => import("quasar/lang/mk"),
  ml: () => import("quasar/lang/ml"),
  mm: () => import("quasar/lang/mm"),
  ms: () => import("quasar/lang/ms"),
  "ms-MY": () => import("quasar/lang/ms-MY"),
  my: () => import("quasar/lang/my"),
  "nb-NO": () => import("quasar/lang/nb-NO"),
  nl: () => import("quasar/lang/nl"),
  pl: () => import("quasar/lang/pl"),
  pt: () => import("quasar/lang/pt"),
  "pt-BR": () => import("quasar/lang/pt-BR"),
  ro: () => import("quasar/lang/ro"),
  ru: () => import("quasar/lang/ru"),
  sk: () => import("quasar/lang/sk"),
  sl: () => import("quasar/lang/sl"),
  sm: () => import("quasar/lang/sm"),
  sq: () => import("quasar/lang/sq"),
  sr: () => import("quasar/lang/sr"),
  "sr-CYR": () => import("quasar/lang/sr-CYR"),
  sv: () => import("quasar/lang/sv"),
  ta: () => import("quasar/lang/ta"),
  th: () => import("quasar/lang/th"),
  tl: () => import("quasar/lang/tl"),
  tr: () => import("quasar/lang/tr"),
  ug: () => import("quasar/lang/ug"),
  uk: () => import("quasar/lang/uk"),
  "ur-PK": () => import("quasar/lang/ur-PK"),
  "uz-Cyrl": () => import("quasar/lang/uz-Cyrl"),
  "uz-Latn": () => import("quasar/lang/uz-Latn"),
  vi: () => import("quasar/lang/vi"),
  "zh-CN": () => import("quasar/lang/zh-CN"),
  "zh-TW": () => import("quasar/lang/zh-TW"),
};

onBeforeMount(() => {
  langOptions.value = (languages as LanguageOption[]).map((l) => ({
    label: l.nativeName,
    value: l.isoName,
  }));
});

watch(lang, async (val) => {
  const loadLang =
    quasarLangLoaders[val as keyof typeof quasarLangLoaders] || quasarLangLoaders["en-US"];
  const langPack = await loadLang();
  $q.lang.set(langPack.default);
});
</script>

import Prism from "prismjs";
import { h, computed, defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "MarkdownCodePrism",

  props: {
    code: {
      type: String as PropType<string>,
      required: true,
    },
    lang: {
      type: String as PropType<string>,
      required: true,
    },
  },

  setup(props) {
    const html = computed(() => {
      if (!props.code || !props.lang) {
        return "";
      }

      return Prism.highlight(props.code, Prism.languages[props.lang] as Prism.Grammar, props.lang);
    });

    return () =>
      h(
        "pre",
        {
          class: `markdown-code language-${props.lang}`,
        },
        [h("code", { innerHTML: html.value })],
      );
  },
});

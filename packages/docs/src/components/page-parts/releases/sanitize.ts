type AttributeSanitizer = (value: string | null) => string
type AllowedAttributes = Record<string, AttributeSanitizer>
type AllowedTags = Record<string, AllowedAttributes>

function unconstrained(value: string | null): string {
  return value ?? ''
}

class HtmlWhitelistedSanitizer {
  private readonly doc: Document
  private readonly allowedTags: AllowedTags
  private readonly allowedCss: string[]

  constructor(
    private readonly escape: boolean,
    tags?: AllowedTags,
    css?: string[],
    urls: string[] = ['http://', 'https://'],
  ) {
    this.doc = document.implementation.createHTMLDocument()
    this.allowedTags = tags ?? HtmlWhitelistedSanitizer.getDefaultTags(urls)
    this.allowedCss = css ?? ['border', 'margin', 'padding']
  }

  static makeUrlSanitizer(allowedUrls: string[]): AttributeSanitizer {
    return (value) => {
      if (value === null) {
        return ''
      }

      return allowedUrls.some((url) => value.startsWith(url)) ? value : ''
    }
  }

  static mergeMap(...maps: AllowedAttributes[]): AllowedAttributes {
    return Object.assign({}, ...maps)
  }

  private static getDefaultTags(urls: string[]): AllowedTags {
    const globalAttributes = {
      dir: unconstrained,
      lang: unconstrained,
      title: unconstrained,
    }
    const urlSanitizer = HtmlWhitelistedSanitizer.makeUrlSanitizer(urls)

    return {
      a: HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
        download: unconstrained,
        href: urlSanitizer,
        hreflang: unconstrained,
        ping: urlSanitizer,
        rel: unconstrained,
        target: unconstrained,
        type: unconstrained,
      }),
      img: HtmlWhitelistedSanitizer.mergeMap(globalAttributes, {
        alt: unconstrained,
        height: unconstrained,
        src: urlSanitizer,
        width: unconstrained,
      }),
      p: globalAttributes,
      div: globalAttributes,
      span: globalAttributes,
      br: globalAttributes,
      b: globalAttributes,
      i: globalAttributes,
      u: globalAttributes,
    }
  }

  sanitizeString(input: string): string {
    const div = this.doc.createElement('div')
    div.innerHTML = input

    return (this.sanitizeNode(div) as HTMLElement).innerHTML
  }

  private sanitizeNode(node: Node): Node {
    const nodeName = node.nodeName.toLowerCase()

    if (nodeName === '#text') {
      return node
    }

    if (nodeName === '#comment') {
      return this.doc.createTextNode('')
    }

    if (this.allowedTags[nodeName] === void 0) {
      return this.doc.createTextNode(this.escape && node instanceof Element ? node.outerHTML : '')
    }

    const source = node as HTMLElement
    const copy = this.doc.createElement(nodeName)
    const allowedAttributes = this.allowedTags[nodeName]

    for (let index = 0; index < source.attributes.length; index++) {
      const attr = source.attributes.item(index)
      const sanitizer = attr !== null ? allowedAttributes[attr.name] : undefined

      if (attr !== null && sanitizer !== void 0) {
        copy.setAttribute(attr.name, sanitizer(source.getAttribute(attr.name)))
      }
    }

    for (const cssProperty of this.allowedCss) {
      copy.style.setProperty(cssProperty, source.style.getPropertyValue(cssProperty))
    }

    while (source.childNodes.length > 0) {
      const firstChild = source.childNodes[0]
      if (firstChild === void 0) {
        break
      }

      const child = source.removeChild(firstChild)
      if (child === void 0) {
        break
      }
      copy.appendChild(this.sanitizeNode(child))
    }

    return copy
  }
}

export default function runSanitizer(html: string): string {
  const parser = new HtmlWhitelistedSanitizer(true)
  return parser.sanitizeString(html)
}

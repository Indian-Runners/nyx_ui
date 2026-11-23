//i18n-setup.js
import { createI18n } from 'vue-i18n'
import { messages as enMessages } from '@/lang/en'
import { messages as frMessages } from '@/lang/fr'
import { messages as elMessages } from '@/lang/el'
import { messages as nlMessages } from '@/lang/nl'
import enLocale from 'element-plus/es/locale/lang/en'
import frLocale from 'element-plus/es/locale/lang/fr'
import elLocale from 'element-plus/es/locale/lang/el'
import nlLocale from 'element-plus/es/locale/lang/nl'

// Element Plus ships its own strings per language; they are merged under `el` so `$t('el.xxx')`
// keeps working exactly as it did with Element UI 2.
// Element Plus exposes `{ name, el: {...} }`; the console calls `$t('el.pagination.total')`, so the
// strings must stay nested under `el`.
const elPack = (locale) => ({ el: { ...(locale && locale.el ? locale.el : locale) } })

const messages = {
  en: {
    ...elPack(enLocale),
    ...enMessages.en,
  },
  fr: {
    ...elPack(frLocale),
    ...frMessages.fr,
  },
  el: {
    ...elPack(elLocale),
    ...elMessages.el,
  },
  nl: {
    ...elPack(nlLocale),
    ...nlMessages.nl,
  },
}

export const localized_messages = messages

// Composition mode (`legacy: false`) since vue-i18n 11: the 9.x line is out of support and
// GHSA-83rm-6c8r-g728 is only fixed from 11.4.14 on. Two consequences for the components:
// `$t` keeps working through `globalInjection`, but the locale is now a ref — `this.$i18n.locale`
// no longer reads or writes it. Use `getLocale()` / `setLocale()` below instead, which keeps the
// call sites readable and hides the `.value`.
export const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  // Explicit: without it `createI18n` still defaults to the legacy API, where `locale` is a plain
  // string and `$i18n` replaces `$t` — the migration would silently not happen.
  legacy: false,
  globalInjection: true,
})

/** The active locale code, e.g. `'fr'`. */
export function getLocale() {
  return i18n.global.locale.value
}

/** Switch the active locale. An empty code is ignored: it would leave the console untranslated. */
export function setLocale(lang) {
  if (!lang) return
  i18n.global.locale.value = lang
}

const locales = { en: enLocale, fr: frLocale, el: elLocale, nl: nlLocale }

/** The Element Plus locale object for a language code, for `app.use(ElementPlus, { locale })`. */
export function elementLocale(lang) {
  return locales[lang] || enLocale
}

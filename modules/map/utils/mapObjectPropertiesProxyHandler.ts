import i18n from '@/i18n.config'
import { NormalizedPoint, NormalizedUdrZone } from '@/modules/map/types'

type TranslationProperty<T> = {
  sk: T
  en: T
}

export type PreProxy<P> =
  | {
      [Property in keyof P]: P[Property] | TranslationProperty<P[Property]>
    }

export const mapObjectPropertiesProxyHandler: ProxyHandler<
  PreProxy<NormalizedPoint | NormalizedUdrZone>
> = {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver)
    const language = i18n.language as 'sk' | 'en'

    if (typeof value === 'object' && value !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return value[language]
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value
  },
}

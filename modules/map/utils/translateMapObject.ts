import {
  ApplicationLocale,
  MapPoint,
  MapUdrZone,
  TranslationProperty,
  WithTranslationProperties,
} from '@/modules/map/types'

export function translateMapObject<
  P extends MapPoint,
  K extends keyof P,
  T extends WithTranslationProperties<P, K>,
>(obj: T, locale: ApplicationLocale): MapPoint

export function translateMapObject<
  P extends MapUdrZone,
  K extends keyof P,
  T extends WithTranslationProperties<P, K>,
>(obj: T, locale: ApplicationLocale): MapUdrZone

export function translateMapObject<
  P extends MapPoint | MapUdrZone,
  K extends keyof P,
  T extends WithTranslationProperties<P, K>,
>(obj: T, locale: ApplicationLocale): P {
  const translatedObject: P = {} as P
  Object.entries(obj).forEach(([key, value]) => {
    translatedObject[key as keyof P] =
      !!value && typeof value === 'object'
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (value as TranslationProperty<any>)[locale]
        : value
  })

  return translatedObject
}

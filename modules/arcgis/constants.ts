import { environment } from '@/environment'

export const ARCGIS_URL = 'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services'

export const STATIC_ARCGIS_URL = `https://${environment.minioBucket}.s3.bratislava.sk/assets/gisdata`

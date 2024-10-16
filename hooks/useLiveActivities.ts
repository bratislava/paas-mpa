import { useCallback } from 'react'
import { useMMKVObject } from 'react-native-mmkv'

import { TicketDto } from '@/modules/backend/openapi-generated'
import LiveActivityControlModule from '@/modules/live-activity-module/src/LiveActivityControlModule'
import { useMapZonesContext } from '@/state/MapZonesProvider/useMapZonesContext'
import { storage } from '@/utils/mmkv'

export const useLiveActivities = () => {
  const mapZones = useMapZonesContext()
  const [activities, setActivities] = useMMKVObject<Record<string, string>>(
    'liveActivities',
    storage,
  )

  const findUdrNameById = useCallback(
    (udrId: string) => {
      return mapZones?.get(udrId)?.properties.name
    },
    [mapZones],
  )

  const startLiveActivity = useCallback(
    async (ticket: TicketDto) => {
      const liveActivities = activities || {}
      try {
        const activityId = await LiveActivityControlModule.startActivity(
          new Date(ticket.parkingStart).getTime(),
          new Date(ticket.parkingEnd).getTime(),
          ticket.ecv,
          findUdrNameById(ticket.udr) || ticket.udr,
        )

        if (activityId) {
          setActivities({
            ...liveActivities,
            [ticket.id]: activityId,
          })

          return activityId
        }
      } catch (error) {
        console.log('Live activity not started', error)
      }

      return null
    },
    [activities, findUdrNameById, setActivities],
  )

  const updateLiveActivity = useCallback(
    async (ticket: TicketDto) => {
      const liveActivities = activities || {}

      const activityId = liveActivities[ticket.id]

      if (activityId) {
        try {
          await LiveActivityControlModule.updateActivity(
            activityId,
            new Date(ticket.parkingStart).getTime(),
            new Date(ticket.parkingEnd).getTime(),
            ticket.ecv,
            findUdrNameById(ticket.udr) || ticket.udr,
          )
        } catch (error) {
          console.log(error)
        }
      }
    },
    [activities, findUdrNameById],
  )

  const endLiveActivity = useCallback(
    async (ticketId: string) => {
      const liveActivities = activities || {}
      const activityId = liveActivities[ticketId]

      if (activityId) {
        try {
          await LiveActivityControlModule.endActivity(activityId)

          delete liveActivities[ticketId]
          setActivities(liveActivities)
        } catch (error) {
          console.log(error)
        }
      }
    },
    [activities, setActivities],
  )

  return {
    startLiveActivity,
    updateLiveActivity,
    endLiveActivity,
  }
}

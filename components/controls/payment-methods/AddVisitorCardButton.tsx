import { Link, router } from 'expo-router'
import { View } from 'react-native'

import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'

const AddVisitorCardButton = () => {
  const { t } = useTranslation()

  return (
    <View className="flex items-start p-5">
      <Link asChild href="/parking-cards/verification">
        <Button variant="plain-dark" startIcon="add-circle-outline" onPress={router.back}>
          {t('PaymentMethods.addVisitorCard')}
        </Button>
      </Link>
    </View>
  )
}

export default AddVisitorCardButton

import { Link } from 'expo-router'
import { View } from 'react-native'

import { SearchIcon } from '@/assets/ui-icons'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  address?: string
}

export const MapZoneBottomSheetAddressLink = ({ address }: Props) => {
  const { t } = useTranslation()

  return (
    <Field label={t('ZoneBottomSheet.title')}>
      <Link asChild href="/search">
        <PressableStyled accessibilityLabel={t('ZoneBottomSheet.searchAccessibilityInput')}>
          <View className="ellipsis min-h-[52px] flex-row items-center overflow-hidden rounded border border-divider bg-white px-4 py-3 g-2">
            <SearchIcon />

            <Typography numberOfLines={1} className="min-w-0 flex-1 text-black">
              {address || t('ZoneBottomSheet.searchPlaceholder')}
            </Typography>
          </View>
        </PressableStyled>
      </Link>
    </Field>
  )
}

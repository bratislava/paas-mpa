import { useTranslation } from '@/hooks/useTranslation'

export const useTicketPurchaseTranslation = () => {
  const { t } = useTranslation()

  return {
    payment: {
      successTitle: t('PurchaseScreen.payment.successful'),
      successText: t('PurchaseScreen.payment.successfulText'),
      failedTitle: t('PurchaseScreen.payment.failed'),
      failedText: t('PurchaseScreen.payment.failedText'),
    },
    prolongation: {
      successTitle: t('PurchaseScreen.prolongation.successful'),
      successText: t('PurchaseScreen.prolongation.successfulText'),
      failedTitle: t('PurchaseScreen.prolongation.failed'),
      failedText: t('PurchaseScreen.prolongation.failedText'),
    },
  }
}

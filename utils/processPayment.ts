import axios, { isAxiosError } from 'axios'

interface PaymentProcessorProps {
  paymentUrl: string
  params: {
    [key: string]: string
  }
}

export const processPayment = async ({ paymentUrl, params }: PaymentProcessorProps) => {
  const decodedPaymentUrl = decodeURI(paymentUrl)
  const urlEncodedData = new URLSearchParams(params)

  try {
    return await axios.post(decodedPaymentUrl, urlEncodedData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  } catch (error) {
    throw new Error(`HTTP error! status: ${isAxiosError(error) && error.status}`)
  }
}

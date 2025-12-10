// Currency configurations
export interface Currency {
  code: string
  symbol: string
  name: string
  symbolPosition: 'before' | 'after'
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', symbolPosition: 'before' },
  { code: 'EUR', symbol: '€', name: 'Euro', symbolPosition: 'before' },
  { code: 'GBP', symbol: '£', name: 'British Pound', symbolPosition: 'before' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', symbolPosition: 'before' },
  { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi', symbolPosition: 'before' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', symbolPosition: 'before' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', symbolPosition: 'before' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', symbolPosition: 'before' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', symbolPosition: 'before' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', symbolPosition: 'before' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', symbolPosition: 'before' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', symbolPosition: 'before' },
]

export const DEFAULT_CURRENCY = 'USD'

/**
 * Get currency details by code
 */
export const getCurrency = (code: string | undefined): Currency => {
  const currency = CURRENCIES.find(c => c.code === code)
  return currency || CURRENCIES.find(c => c.code === DEFAULT_CURRENCY)!
}

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currencyCode?: string): string => {
  const currency = getCurrency(currencyCode)
  const formattedNumber = price.toFixed(2)
  
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedNumber}`
  } else {
    return `${formattedNumber}${currency.symbol}`
  }
}

/**
 * Get just the currency symbol
 */
export const getCurrencySymbol = (currencyCode?: string): string => {
  const currency = getCurrency(currencyCode)
  return currency.symbol
}


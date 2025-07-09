import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  const correctedCurrency = currency.toUpperCase() === 'BIRR' ? 'ETB' : currency;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: correctedCurrency,
    }).format(amount);
  } catch (error) {
    // Fallback for any other invalid currency codes to prevent crashing.
    console.error(`Invalid currency code provided: ${currency}. Falling back to default format.`);
    return `${currency} ${amount.toFixed(2)}`;
  }
};

/**
 * Formats a date string into a more readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string (e.g., "Jul 9, 2025").
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export { formatCurrency, formatDate };


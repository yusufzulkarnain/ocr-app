/**
 * Format a numeric string to Indonesian Rupiah format
 * @param value The numeric string to format
 * @returns Formatted string with thousand separators
 */
export const formatCurrency = (value: string): string => {
  // Remove all non-digit characters
  const number = value.replace(/\D/g, '');

  // Convert to number and format with thousand separator
  const formatted = new Intl.NumberFormat('id-ID').format(Number(number));

  return formatted;
};

/**
 * Remove all non-digit characters from a formatted currency string
 * @param value The formatted currency string
 * @returns Clean numeric string
 */
export const unformatCurrency = (value: string): string => {
  return value.replace(/\D/g, '');
};

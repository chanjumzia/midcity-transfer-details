/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Converts a string to Sentence Case: 
 * "HELLO WORLD" -> "Hello world"
 * "john doe" -> "John doe"
 */
export const toSentenceCase = (str: string): string => {
  if (!str) return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

/**
 * For names, often Title Case is preferred (Every Word Capital):
 * "ANJUM ZIA" -> "Anjum Zia"
 */
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

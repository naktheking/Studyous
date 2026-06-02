/**
 * Utility functions for handling military time (24-hour format)
 * All times should be stored and processed in military time format (HH:mm)
 */

/**
 * Converts a time string to military format (24-hour HH:mm format)
 * @param {string} timeStr - Time string in any common format
 * @returns {string} Time in military format (HH:mm)
 */
export const toMilitaryTime = (timeStr) => {
  if (!timeStr) return '';
  // If already in military format (HH:mm), return as-is
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    return timeStr;
  }
  // Add more format conversions as needed
  return timeStr;
};

/**
 * Validates if a time string is in military format
 * @param {string} timeStr - Time string to validate
 * @returns {boolean} True if in military format (HH:mm)
 */
export const isMilitaryTime = (timeStr) => {
  return /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
};

/**
 * Creates a Date object from date and military time strings
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {string} militaryTimeStr - Time in military format HH:mm
 * @returns {Date} Combined date and time
 */
export const createDateFromMilitaryTime = (dateStr, militaryTimeStr) => {
  return new Date(`${dateStr} ${militaryTimeStr}`);
};

/**
 * Validates end time is after start time (both in military format)
 * @param {string} startTime - Start time in military format (HH:mm)
 * @param {string} endTime - End time in military format (HH:mm)
 * @returns {boolean} True if endTime is after startTime
 */
export const isValidTimeRange = (startTime, endTime) => {
  return endTime > startTime;
};

export default {
  toMilitaryTime,
  isMilitaryTime,
  createDateFromMilitaryTime,
  isValidTimeRange
};

/**
 * Formats time components into a display string showing only the most significant non-zero units
 * @param {number} days - Number of days
 * @param {number} hours - Number of hours
 * @param {number} minutes - Number of minutes
 * @param {number} seconds - Number of seconds
 * @returns {string} Formatted time string
 */
export const formatTimeComponents = (days, hours, minutes, seconds) => {
  if (days > 0) {
    return `${days}d`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return '0s';
};

/**
 * Converts total seconds into formatted time string
 * @param {number} totalSeconds Total number of seconds
 * @returns {string} Formatted time string
 */
export const formatTimeHMS = (totalSeconds) => {
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  return formatTimeComponents(days, hours, minutes, seconds);
};
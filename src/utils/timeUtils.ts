/**
 * Formats an ISO date string or Date object into a relative time string (e.g., "2h", "3d", "4w").
 * 
 * @param dateInput - The date to format (ISO string or Date object).
 * @returns The formatted relative time string, or an empty string if the input is invalid.
 */
export function formatRelativeTime(dateInput: string | Date | undefined): string {
    if (!dateInput) {
        // return ''; // Old behavior: Return empty if no date provided
        return '0d'; // New behavior: Return '0d' if no date provided
    }

    let date: Date;
    try {
        date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
        }
    } catch (error) {
        console.error("Error parsing date for relative time:", error);
        return ''; // Return empty for invalid dates
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 0) {
        // Handle future dates if necessary, for now, return empty or a specific format
        return 'Now'; // Or perhaps 'Upcoming' or format the future date
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInWeeks > 0) {
        return `${diffInWeeks}w`;
    }
    if (diffInDays > 0) {
        return `${diffInDays}d`;
    }
    if (diffInHours > 0) {
        return `${diffInHours}h`;
    }
    // Optional: Show minutes for very recent items
    // if (diffInMinutes > 0) {
    //     return `${diffInMinutes}m`;
    // }
    return `<1h`; // Default for less than an hour
} 
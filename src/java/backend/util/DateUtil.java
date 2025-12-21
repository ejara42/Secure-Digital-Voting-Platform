package backend.util;

import java.sql.Date;
import java.time.LocalDate;
import java.time.ZoneId;

/**
 * Utility for date validations/formatting (e.g., election timing).
 */
public class DateUtil {
    /**
     * Checks if current date is within start/end (NEBE: Prevent voting outside dates).
     * @param start Start date.
     * @param end End date.
     * @return True if within range.
     */
    public static boolean isWithinDates(Date start, Date end) {
        LocalDate current = LocalDate.now();
        LocalDate startLocal = start.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endLocal = end.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        return !current.isBefore(startLocal) && !current.isAfter(endLocal);
    }

    /**
     * Formats date to string.
     * @param date The date.
     * @return Formatted string (YYYY-MM-DD).
     */
    public static String formatDate(Date date) {
        return date.toString();
    }
}
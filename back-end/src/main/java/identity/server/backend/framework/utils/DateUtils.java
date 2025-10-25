package identity.server.backend.framework.utils;

import ems.service.api.framework.enums.DateTimeFormat;
import java.text.SimpleDateFormat;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

public class DateUtils extends org.apache.commons.lang3.time.DateUtils {

    /**
     * convert instant to string.
     *
     * @param target value
     * @return string
     */
    public static String convertInstantToString(final Instant target) {
        return convertLocalDate(target).toString();
    }

    /**
     * convert date to string.
     *
     * @param target value
     * @param pattern date time pattern
     * @return string
     */
    public static String convertDateToString(final Date target, final DateTimeFormat pattern) {
        return new SimpleDateFormat(pattern.getValue()).format(target.getTime());
    }



    /**
     * convert date to local date.
     *
     * @param date date
     * @return LocalDate
     */
    public static LocalDate convertLocalDate(Date date) {
        if (date == null) {
            return null;
        }
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    /**
     * convert Instant to local date.
     *
     * @param instant Instant
     * @return LocalDate
     */
    public static LocalDate convertLocalDate(Instant instant) {
        if (instant == null) {
            return null;
        }
        return instant.atZone(ZoneId.systemDefault()).toLocalDate();
    }

    /**
     * compare Instant.
     * @param fromInstant
     * @param toInstant
     * @return
     */
    public static boolean compareInstant(final Instant fromInstant, final Instant toInstant) {
        return ((fromInstant.compareTo(toInstant) < 0) || (fromInstant.compareTo(toInstant) == 0));
    }

    /**
     * compare date.
     *
     * @param fromDate from date
     * @param toDate to date
     * @return boolean
     */

    public static boolean compareDate(final LocalDate fromDate, final LocalDate toDate) {
        return ((fromDate.compareTo(toDate) < 0) || (fromDate.compareTo(toDate) == 0));
    }

    /**
     * Find the current age of members by birthday
     *
     * @param birthday
     * @return
     */
    public static int getCurrentAgeByBirthday(Instant birthday) {
        LocalDate birthdate = birthday.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate today = LocalDate.now();
        return Period.between(birthdate, today).getYears();
    }

    public static Instant addMonth(long month) {
        return LocalDateTime.now().plusMonths(month).toInstant(ZoneOffset.UTC);
    }

    public static Instant addYear(long year) {
        return LocalDateTime.now().plusYears(year).toInstant(ZoneOffset.UTC);
    }

    public static boolean isBeforeOrEqual(Instant before, Instant after) {
        return before.isBefore(after) || before.equals(after);
    }

    public static String convertDateToCron(LocalDateTime localDateTime) {
        return String.format(
                "%s %s %s %s %s %s %s",
                localDateTime.getSecond(),
                localDateTime.getMinute(),
                localDateTime.getHour(),
                localDateTime.getDayOfMonth(),
                localDateTime.getMonth(),
                "?",
                localDateTime.getYear()
        );
    }

    /**
     * Get date from instant.
     * @param zoneId zoneId
     * @param instant instant
     * @return LocalDate
     */
    public static LocalDate getDateFromInstant(final ZoneId zoneId, final Instant instant) {
        return instant.atZone(zoneId).toLocalDate();
    }

    public static LocalTime getTimeFromInstant(final ZoneId zoneId, final Instant instant) {
        return instant.atZone(zoneId).toLocalTime().truncatedTo(ChronoUnit.SECONDS);
    }

    public static String getDateFromLong(long time) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time);
        return ((cal.get(Calendar.MONTH) + 1) + "-" + cal.get(Calendar.DAY_OF_MONTH) + "-" + cal.get(Calendar.YEAR));
    }

    public static String getTimeFromLong(long time) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(time);
        return (cal.get(Calendar.HOUR_OF_DAY) + ":" + cal.get(Calendar.MINUTE) + ":" + cal.get(Calendar.SECOND));
    }
}

package identity.server.backend.framework.utils;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

import ems.service.api.framework.enums.CodeEnum;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.web.util.UriUtils;

@Slf4j
public class StringUtils extends org.apache.commons.lang3.StringUtils {

    private static final char SEPARATOR = '_';

    private static final String UNKNOWN = "unknown";

    private static final String EMPTY_STRING = "";

    private static final int DEF_COUNT = 20;

    private static final SecureRandom SECURE_RANDOM;

    static {
        SECURE_RANDOM = new SecureRandom();
        SECURE_RANDOM.nextBytes(new byte[64]);
    }

    public static String generateActionCode(String permission, String actionName) {
        return permission.toUpperCase() + ":" + actionName.toUpperCase();
    }

    public static boolean isLike(String searchTerm, String originalString) {
        searchTerm = searchTerm.toLowerCase();
        originalString = originalString.toLowerCase();
        return originalString.contains(searchTerm);
    }

    public static String getSubStrAfterColon(String input) {
        if (input == null || !input.contains(":")) {
            return "";
        }
        String[] parts = input.split(":");
        return parts.length > 1 ? parts[1] : "";
    }

    public static String removeBrackets(String input) {
        if (Objects.isNull(input)) {
            return StringUtils.EMPTY_STRING;
        }
        return input.replace("[", "").replace("]", "");
    }

    public static List<UUID> getActionsOfUser(String input) {
        if (Objects.isNull(input)) {
            return new ArrayList<>();
        }
        return Arrays.stream(removeBrackets(input).split(",")).map(String::trim).map(UUID::fromString).collect(Collectors.toList());
    }

    public static String formatComponent(String componentName) {
        if (Objects.isNull(componentName)) {
            return StringUtils.EMPTY_STRING;
        }
        return String.format("<%s />", componentName);
    }

    /**
     * toCamelCase
     *
     * @return toCamelCase(" hello_world ") == "helloWorld"
     * toCapitalizeCamelCase("hello_world") == "HelloWorld"
     * toUnderScoreCase("helloWorld") = "hello_world"
     */
    public static String toCamelCase(String s) {
        if (s == null) {
            return null;
        }

        s = s.toLowerCase();

        StringBuilder sb = new StringBuilder(s.length());
        boolean upperCase = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == SEPARATOR) {
                upperCase = true;
            } else if (upperCase) {
                sb.append(Character.toUpperCase(c));
                upperCase = false;
            } else {
                sb.append(c);
            }
        }

        return sb.toString();
    }

    /**
     * toCapitalizeCamelCase
     *
     * @return toCamelCase(" hello_world ") == "helloWorld"
     * toCapitalizeCamelCase("hello_world") == "HelloWorld"
     * toUnderScoreCase("helloWorld") = "hello_world"
     */
    public static String toCapitalizeCamelCase(String s) {
        if (s == null) {
            return null;
        }
        s = toCamelCase(s);
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }

    /**
     * toUnderScoreCase
     *
     * @return toCamelCase(" hello_world ") == "helloWorld"
     * toCapitalizeCamelCase("hello_world") == "HelloWorld"
     * toUnderScoreCase("helloWorld") = "hello_world"
     */
    static String toUnderScoreCase(String s) {
        if (s == null) {
            return null;
        }

        StringBuilder sb = new StringBuilder();
        boolean upperCase = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            boolean nextUpperCase = true;

            if (i < (s.length() - 1)) {
                nextUpperCase = Character.isUpperCase(s.charAt(i + 1));
            }

            if ((i > 0) && Character.isUpperCase(c)) {
                if (!upperCase || !nextUpperCase) {
                    sb.append(SEPARATOR);
                }
                upperCase = true;
            } else {
                upperCase = false;
            }

            sb.append(Character.toLowerCase(c));
        }

        return sb.toString();
    }

    /**
     * getIp
     * @param request
     * @return ip
     */
    public static String getIp(HttpServletRequest request) {
        String ip = request.getHeader("x-forwarded-for");
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || UNKNOWN.equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        String comma = ",";
        String localhost = "127.0.0.1";
        if (ip.contains(comma)) {
            ip = ip.split(",")[0];
        }
        if (localhost.equals(ip)) {
            // Get the ip address of the machine
            try {
                ip = InetAddress.getLocalHost().getHostAddress();
            } catch (UnknownHostException e) {
                log.error(e.getMessage(), e);
            }
        }
        return ip;
    }

    /**
     * convert list to array
     *
     * @param collection
     * @return
     */
    public static String[] toStringArray(Collection<String> collection) {
        String[] result = null;
        if (collection != null) {
            result = new String[collection.size()];
            result = collection.toArray(result);
        }
        return result;
    }

    /**
     * compare enum and string
     *
     * @param value String
     * @return boolean
     */
    public static boolean equals(final CodeEnum enums, final String value) {
        return equals(enums.getValue(), value);
    }

    /**
     * Generate GroupNumber
     * @param prefix
     * @return
     */
    public static String generateGroupNumber(String prefix) {
        SecureRandom random = new SecureRandom();
        int number = 100000 + random.nextInt(900000);
        return prefix + number;
    }

    /**
     * Make String with contain
     * @param value String
     * @return String
     */
    public static String makeStringWithContain(String value) {
        if (isBlank(value)) value = EMPTY_STRING;
        return "%" + value.toLowerCase().trim() + "%";
    }

    /**
     * Generate random alpha numeric string
     * @return String
     */
    public static String generateRandomAlphanumericString() {
        return RandomStringUtils.random(DEF_COUNT, 0, 0, true, true, null, SECURE_RANDOM);
    }

    /**
     * Generate random numeric string
     * @return String
     */
    public static String generateRandomNumericString(int count) {
        return RandomStringUtils.random(count, 0, 0, false, true, null, SECURE_RANDOM);
    }

    /**
     * convert list string to string
     * @param value List String
     * @return String
     */
    public static String convertListToString(List<String> value) {
        if (Objects.isNull(value)) {
            return null;
        }
        return value.stream().map(String::valueOf).collect(Collectors.joining(","));
    }

    /**
     * convert string to list string
     * @param value String
     * @return List String
     */
    public static List<String> convertStringToListString(String value) {
        if (isEmpty(value)) {
            return new ArrayList<>();
        }
        return Arrays.stream(value.split(",")).collect(Collectors.toList());
    }

    /**
     * convert string to list integer
     * @param value String
     * @return List Integer
     */
    public static List<Integer> convertStringToListInteger(String value) {
        if (isEmpty(value)) {
            return new ArrayList<>();
        }
        return Arrays.stream(value.split(",")).map(Integer::parseInt).collect(Collectors.toList());
    }

    /**
     *
     * return null if value is empty
     *
     * @param value
     * @return value or null
     */
    public static String replaceEmptyToNull(String value) {
        if (isBlank(value)) {
            return null;
        }
        return value;
    }

    public static String decodeData(String data) {
        try {
            if (isNotBlank(data)) {
                return UriUtils.decode(data, "UTF-8");
            }
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String getFirstChar(String data) {
        if (isNotBlank(data)) {
            return String.valueOf(data.charAt(0)).toUpperCase();
        }
        return EMPTY_STRING;
    }
}


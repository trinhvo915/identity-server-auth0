package identity.server.backend.framework.utils;

public class SQLUtils {

    public static String wildcardsLike(String searchKey) {
        if (searchKey != null) {
            return "%" + wildcards(searchKey) + "%";
        }
        return null;
    }

    public static String wildcards(String searchKey) {
        if (searchKey != null) {
            searchKey = searchKey.trim();
            searchKey = searchKey.replace("%", "\\%");
            searchKey = searchKey.replace("_", "\\_");
            searchKey = searchKey.replace("'", "\\'");
            searchKey = searchKey.replace(";", "\\;");
            searchKey = searchKey.replace("-", "\\-");
            searchKey = searchKey.replace("*", "\\*");
            searchKey = searchKey.replace("/", "\\/");
        }
        return searchKey;
    }
}


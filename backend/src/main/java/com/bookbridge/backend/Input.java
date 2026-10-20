package com.bookbridge.backend;

import java.util.Map;

/** Small helpers for reading values out of a JSON request body. */
public final class Input {
    private Input() {}

    /** Trimmed text, never null, cut to at most max characters. */
    public static String text(Map<String, Object> body, String key, int max) {
        Object v = body == null ? null : body.get(key);
        String s = v == null ? "" : v.toString().trim();
        return s.length() > max ? s.substring(0, max) : s;
    }

    public static long number(Map<String, Object> body, String key) {
        Object v = body == null ? null : body.get(key);
        if (v instanceof Number n) return Math.round(n.doubleValue());
        try {
            return v == null ? 0 : Math.round(Double.parseDouble(v.toString().trim()));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public static boolean flag(Map<String, Object> body, String key) {
        return body != null && Boolean.TRUE.equals(body.get(key));
    }

    public static boolean validEmail(String email) {
        return email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}
package backend.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility for hashing passwords (SHA-256 for security).
 */
public class PasswordUtil {
    /**
     * Hashes a password (NEBE: Secure admin credentials).
     * @param password Plain text password.
     * @return Hashed string.
     */
    public static String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Hashing error");
        }
    }

    /**
     * Verifies hashed password.
     * @param input Input password.
     * @param stored Stored hash.
     * @return True if matches.
     */
    public static boolean verifyPassword(String input, String stored) {
        return hashPassword(input).equals(stored);
    }
}
package backend.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Singleton utility for PostgreSQL connections (NEBE: Secure DB access).
 */
public class DBConnection {
    private static Connection connection;
    private static final String URL = "jdbc:postgresql://localhost:5432/online_election_db";
    private static final String USER = "postgres";
    private static final String PASSWORD = "@eyasu51#";

    public static Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            try {
                Class.forName("org.postgresql.Driver");
                connection = DriverManager.getConnection(URL, USER, PASSWORD);
            } catch (ClassNotFoundException e) {
                throw new SQLException("Driver not found");
            }
        }
        return connection;
    }

    public static void closeConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
        }
    }
}
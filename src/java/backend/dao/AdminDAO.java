package backend.dao;

import backend.model.Admin;

/**
 * DAO interface for Admin authentication and management.
 * NEBE requirement: secure administrator access control.
 */
public interface AdminDAO {

    /**
     * Authenticate admin using username and hashed password.
     *
     * @param username admin username
     * @param password hashed password
     * @return Admin object if authentication is successful, otherwise null
     */
    Admin login(String username, String password);

    /**
     * Create a new admin account.
     *
     * @param admin Admin object
     */
    void createAdmin(Admin admin);

    /**
     * Check if an admin username already exists.
     *
     * @param username admin username
     * @return true if username exists, false otherwise
     */
    boolean existsByUsername(String username);
}

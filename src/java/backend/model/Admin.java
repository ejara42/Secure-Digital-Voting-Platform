package backend.model;

import java.io.Serializable;

/**
 * Model for Admin entity.
 */
public class Admin implements Serializable {
    private int id;
    private String username;
    private String password; // Hashed

    // Constructors
    public Admin() {}
    public Admin(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // Getters/Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
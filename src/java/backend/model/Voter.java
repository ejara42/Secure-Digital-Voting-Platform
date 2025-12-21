package backend.model;

import java.io.Serializable;

/**
 * Model for Voter entity (with verification).
 */
public class Voter implements Serializable {
    private int id;
    private String voterId; // Unique NEBE ID
    private String name;
    private int age;
    private boolean verified;
    private boolean hasVoted;

    // Constructors
    public Voter() {}
    public Voter(String voterId, String name, int age) {
        this.voterId = voterId;
        this.name = name;
        this.age = age;
    }

    // Getters/Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public boolean isHasVoted() { return hasVoted; }
    public void setHasVoted(boolean hasVoted) { this.hasVoted = hasVoted; }
}
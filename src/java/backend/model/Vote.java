package backend.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Model for Vote entity (anonymous).
 */
public class Vote implements Serializable {
    private int id;
    private int voterId; // Internal ID, not traceable
    private int candidateId;
    private Timestamp timestamp;

    // Constructors
    public Vote() {}
    public Vote(int voterId, int candidateId) {
        this.voterId = voterId;
        this.candidateId = candidateId;
    }

    // Getters/Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getVoterId() { return voterId; }
    public void setVoterId(int voterId) { this.voterId = voterId; }
    public int getCandidateId() { return candidateId; }
    public void setCandidateId(int candidateId) { this.candidateId = candidateId; }
    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }
}
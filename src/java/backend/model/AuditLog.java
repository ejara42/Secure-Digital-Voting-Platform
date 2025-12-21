package backend.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class AuditLog implements Serializable {

    private int id;
    private String actor;        // ADMIN / VOTER
    private String action;       // LOGIN, VOTE_CAST, CREATE_ELECTION
    private String description;  // Human-readable details
    private Timestamp timestamp;

    public AuditLog() {}

    public AuditLog(String actor, String action, String description) {
        this.actor = actor;
        this.action = action;
        this.description = description;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}

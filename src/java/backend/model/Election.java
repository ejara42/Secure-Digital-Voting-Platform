package backend.model;

import java.io.Serializable;
import java.sql.Date;

/**
 * Model for Election entity (with timing).
 */
public class Election implements Serializable {
    private int id;
    private String name;
    private Date startDate;
    private Date endDate;
    private boolean active;

    // Constructors
    public Election() {}
    public Election(String name, Date startDate, Date endDate) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // Getters/Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
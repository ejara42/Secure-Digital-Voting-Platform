package backend.model;

import java.io.Serializable;

/**
 * Model for Candidate entity.
 */
public class Candidate implements Serializable {
    private int id;
    private String name;
    private String party;
    private int electionId;

    // Constructors
    public Candidate() {}
    public Candidate(String name, String party, int electionId) {
        this.name = name;
        this.party = party;
        this.electionId = electionId;
    }

    // Getters/Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getParty() { return party; }
    public void setParty(String party) { this.party = party; }
    public int getElectionId() { return electionId; }
    public void setElectionId(int electionId) { this.electionId = electionId; }
}
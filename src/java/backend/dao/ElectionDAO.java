package backend.dao;

import backend.model.Election;
import java.util.List;

/**
 * DAO for managing elections (define start/end, activate).
 */
public interface ElectionDAO {
    /**
     * Creates a new election with start/end dates (NEBE: Timed elections).
     * @param election The election object.
     */
    void createElection(Election election);

    /**
     * Updates an election (e.g., change dates, activate).
     * @param election The updated election.
     */
    void updateElection(Election election);

    /**
     * Deletes an election by ID.
     * @param id The election ID.
     */
    void deleteElection(int id);

    /**
     * Gets active elections (for voting).
     * @return List of active elections.
     */
    List<Election> getActiveElections();

    /**
     * Gets all elections for admin.
     * @return List of all elections.
     */
    List<Election> getAllElections();

    /**
     * Checks if election is active and within dates.
     * @param electionId The election ID.
     * @return True if votable.
     */
    boolean isElectionVotable(int electionId);
}
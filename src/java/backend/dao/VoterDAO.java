package backend.dao;

import backend.model.Voter;

/**
 * DAO for managing voters (registration, verification).
 */
public interface VoterDAO {
    /**
     * Registers a voter with unique ID (NEBE: Eligible voters only once).
     * @param voter The voter object.
     */
    void registerVoter(Voter voter);

    /**
     * Verifies a voter (set is_verified true).
     * @param voterId The unique voter ID.
     */
    void verifyVoter(String voterId);

    /**
     * Checks if voter has voted.
     * @param voterId The voter ID.
     * @return True if has voted.
     */
    boolean hasVoted(String voterId);

    /**
     * Gets voter by ID.
     * @param voterId The voter ID.
     * @return Voter object or null.
     */
    Voter getVoterById(String voterId);
}
package backend.dao;

import backend.model.Candidate;
import java.util.List;

/**
 * DAO for managing candidates (admin-only).
 */
public interface CandidateDAO {
    /**
     * Adds a candidate to an election (NEBE: Admins manage candidates).
     * @param candidate The candidate object.
     */
    void addCandidate(Candidate candidate);

    /**
     * Updates a candidate.
     * @param candidate The updated candidate.
     */
    void updateCandidate(Candidate candidate);

    /**
     * Deletes a candidate by ID.
     * @param id The candidate ID.
     */
    void deleteCandidate(int id);

    /**
     * Gets candidates for a specific election.
     * @param electionId The election ID.
     * @return List of candidates.
     */
    List<Candidate> getCandidatesByElection(int electionId);

    /**
     * Gets all candidates.
     * @return List of all candidates.
     */
    List<Candidate> getAllCandidates();
}
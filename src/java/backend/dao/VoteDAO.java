package backend.dao;

import backend.model.Vote;
import java.util.Map;

/**
 * DAO for managing votes (anonymous, one per voter).
 */
public interface VoteDAO {
    /**
     * Casts a vote (NEBE: Anonymous, prevent duplicates via DB trigger).
     * @param vote The vote object (voter ID encrypted/anonymized).
     */
    void castVote(Vote vote);

    /**
     * Gets aggregated results for an election (counts per candidate, no voter details).
     * @param electionId The election ID.
     * @return Map of candidate ID to vote count.
     */
    Map<Integer, Integer> getElectionResults(int electionId);
}
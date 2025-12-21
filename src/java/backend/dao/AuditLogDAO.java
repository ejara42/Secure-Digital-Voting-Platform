package backend.dao;

import backend.model.AuditLog;
import java.util.List;

/**
 * DAO for managing non-identifiable audit logs.
 * NEBE requirement: audit trails for all election activities.
 */
public interface AuditLogDAO {

    /**
     * Logs an action with timestamp.
     * Example: "Admin added candidate", "Election started".
     *
     * @param action Description of the action
     */
    void logAction(String action);

    /**
     * Retrieves all audit logs (non-identifiable).
     *
     * @return list of audit logs
     */
    List<AuditLog> getAllLogs();
}

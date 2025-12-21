package backend.controller.admin;

import backend.util.DBUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/admin/logs")
public class AuditLogsController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Assume audit_logs table: id, timestamp, action (non-identifiable)
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT timestamp, action FROM audit_logs ORDER BY timestamp DESC");
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> logs = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> log = new HashMap<>();
                log.put("timestamp", rs.getTimestamp("timestamp"));
                log.put("action", rs.getString("action"));
                logs.add(log);
            }
            // For JSON response if AJAX, or set attribute
            request.setAttribute("logs", logs);
            request.getRequestDispatcher("/Admin/auditLogs.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500, "Database error");
        }
    }
}
package backend.controller.election;

import backend.util.DBUtil;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;

@WebServlet("/election/lifecycle")
public class ElectionLifecycleController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        int electionId = Integer.parseInt(request.getParameter("electionId"));
        boolean isActive = Boolean.parseBoolean(request.getParameter("isActive"));
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("UPDATE elections SET is_active = ? WHERE id = ?");
            ps.setBoolean(1, isActive);
            ps.setInt(2, electionId);
            ps.executeUpdate();
            response.sendRedirect("/admin/elections");
        } catch (Exception e) {
            response.sendError(500);
        }
    }
}
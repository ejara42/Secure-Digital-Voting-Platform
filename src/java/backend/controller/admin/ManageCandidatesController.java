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

@WebServlet("/admin/candidates")
public class ManageCandidatesController extends HttpServlet {

    /**
     *
     * @param request
     * @param response
     * @throws ServletException
     * @throws IOException
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT id, name, party, election_id FROM candidates");
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> candidates = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> cand = new HashMap<>();
                cand.put("id", rs.getInt("id"));
                cand.put("name", rs.getString("name"));
                cand.put("party", rs.getString("party"));
                cand.put("electionId", rs.getInt("election_id"));
                candidates.add(cand);
            }
            request.setAttribute("candidates", candidates);
            request.getRequestDispatcher("/Admin/manageCandidates.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        String party = request.getParameter("party");
        int electionId = Integer.parseInt(request.getParameter("electionId"));
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO candidates (name, party, election_id) VALUES (?, ?, ?)");
            ps.setString(1, name);
            ps.setString(2, party);
            ps.setInt(3, electionId);
            ps.executeUpdate();
            response.sendRedirect("/admin/candidates");
        } catch (Exception e) {
            response.sendError(500);
        }
    }
}
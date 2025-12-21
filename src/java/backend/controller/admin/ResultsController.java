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

@WebServlet("/admin/results")
public class ResultsController extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT * FROM election_results"); // Anonymized view
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> results = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> res = new HashMap<>();
                res.put("electionId", rs.getInt("election_id"));
                res.put("electionName", rs.getString("election_name"));
                res.put("candidateId", rs.getInt("candidate_id"));
                res.put("candidateName", rs.getString("candidate_name"));
                res.put("voteCount", rs.getInt("vote_count"));
                results.add(res);
            }
            request.setAttribute("results", results);
            request.getRequestDispatcher("/Admin/results.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500);
        }
    }
}
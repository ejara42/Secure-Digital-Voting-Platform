package backend.controller.voter;

import backend.util.DBUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/voter/dashboard")
public class VoterDashboardController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        String voterId = (String) session.getAttribute("voter");
        if (voterId == null) {
            response.sendRedirect("/Public/login.html");
            return;
        }
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT is_verified, has_voted FROM voters WHERE voter_id = ?");
            ps.setString(1, voterId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                request.setAttribute("verified", rs.getBoolean("is_verified"));
                request.setAttribute("hasVoted", rs.getBoolean("has_voted"));
            }
            request.getRequestDispatcher("/Voter/dashboard.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500);
        }
    }
}
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

@WebServlet("/vote")
public class VoteController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        String voterStr = (String) session.getAttribute("voter");
        if (voterStr == null) {
            response.sendRedirect("/Public/login.html");
            return;
        }
        int candidateId = Integer.parseInt(request.getParameter("candidateId"));
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement psVoter = conn.prepareStatement("SELECT id FROM voters WHERE voter_id = ? AND is_verified = TRUE AND has_voted = FALSE");
            psVoter.setString(1, voterStr);
            ResultSet rs = psVoter.executeQuery();
            if (rs.next()) {
                int voterId = rs.getInt("id");
                PreparedStatement ps = conn.prepareStatement("INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)");
                ps.setInt(1, voterId);
                ps.setInt(2, candidateId);
                ps.executeUpdate(); // DB triggers handle timing/duplicates
                response.sendRedirect("/voter/receipt");
            } else {
                response.sendRedirect("/Voter/vote.html?error=ineligible");
            }
        } catch (Exception e) {
            response.sendRedirect("/Voter/vote.html?error=failed");
        }
    }
}
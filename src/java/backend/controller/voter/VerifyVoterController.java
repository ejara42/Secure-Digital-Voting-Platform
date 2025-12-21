package backend.controller.voter;

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

@WebServlet("/verify")
public class VerifyVoterController extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String voterId = request.getParameter("voterId");
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT is_verified, has_voted FROM voters WHERE voter_id = ?");
            ps.setString(1, voterId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                boolean verified = rs.getBoolean("is_verified");
                request.setAttribute("status", verified ? "Verified (Eligible)" : "Not Verified");
                if (!verified) {
                    // Optional: Verify here
                    PreparedStatement updatePs = conn.prepareStatement("UPDATE voters SET is_verified = TRUE WHERE voter_id = ?");
                    updatePs.setString(1, voterId);
                    updatePs.executeUpdate();
                    request.setAttribute("status", "Now Verified");
                }
            } else {
                request.setAttribute("status", "Invalid Voter ID");
            }
            request.getRequestDispatcher("/Voter/verify.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500);
        }
    }
}
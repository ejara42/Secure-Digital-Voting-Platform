package backend.controller.auth;

import backend.util.DBUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.security.MessageDigest;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@WebServlet("/login")
public class LoginController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = hashPassword(request.getParameter("password"));
        try (Connection conn = DBUtil.getConnection()) {
            // Admin login
            PreparedStatement ps = conn.prepareStatement("SELECT id FROM admins WHERE username = ? AND password = ?");
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();
            HttpSession session = request.getSession();
            if (rs.next()) {
                session.setAttribute("admin", username);
                response.sendRedirect("/admin/dashboard");
                return;
            }
            // Voter login (using voter_id, assume no password or use OTP in production)
            ps = conn.prepareStatement("SELECT id FROM voters WHERE voter_id = ?");
            ps.setString(1, username);
            rs = ps.executeQuery();
            if (rs.next()) {
                session.setAttribute("voter", username);
                response.sendRedirect("/voter/dashboard");
            } else {
                response.sendRedirect("/Public/login.html?error=invalid");
            }
        } catch (Exception e) {
            response.sendError(500);
        }
    }

    private String hashPassword(String pass) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(pass.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            return pass; // Fallback
        }
    }
}
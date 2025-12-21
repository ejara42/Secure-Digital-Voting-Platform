package backend.controller.voter;

import backend.util.DBConnection;
import backend.util.DBUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet("/register/voter")
public class RegisterVoterController extends HttpServlet {

    private static final Logger LOGGER =
            Logger.getLogger(RegisterVoterController.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String voterId = request.getParameter("voterId");
        String name = request.getParameter("name");
        int age = Integer.parseInt(request.getParameter("age"));

        Connection conn = null;
        PreparedStatement ps = null;

        try {
            conn = DBConnection.getConnection();

            ps = conn.prepareStatement(
                "INSERT INTO voters (voter_id, name, age, is_verified, has_voted) " +
                "VALUES (?, ?, ?, FALSE, FALSE)"
            );

            ps.setString(1, voterId);
            ps.setString(2, name);
            ps.setInt(3, age);

            ps.executeUpdate();

            // ✅ success redirect
            response.sendRedirect(
                request.getContextPath() + "/auth/login.html?success=registered"
            );

        } catch (SQLException ex) {
            LOGGER.log(Level.SEVERE, "Error registering voter", ex);

            // ❌ error redirect
            response.sendRedirect(
                request.getContextPath() + "/auth/register.html?error=failed"
            );

        } finally {
            DBUtil.close(conn, ps, null);
        }
    }
}

package backend.controller.admin;

import backend.util.DBUtil;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/admin/elections")
public class ManageElectionsController extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT id, name, start_date, end_date, is_active FROM elections");
            ResultSet rs = ps.executeQuery();
            List<Map<String, Object>> elections = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> elec = new HashMap<>();
                elec.put("id", rs.getInt("id"));
                elec.put("name", rs.getString("name"));
                elec.put("startDate", rs.getDate("start_date"));
                elec.put("endDate", rs.getDate("end_date"));
                elec.put("isActive", rs.getBoolean("is_active"));
                elections.add(elec);
            }
            request.setAttribute("elections", elections);
            request.getRequestDispatcher("/Admin/manageElections.html").forward(request, response);
        } catch (Exception e) {
            response.sendError(500);
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String name = request.getParameter("name");
        Date startDate = Date.valueOf(request.getParameter("startDate"));
        Date endDate = Date.valueOf(request.getParameter("endDate"));
        try (Connection conn = DBUtil.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO elections (name, start_date, end_date) VALUES (?, ?, ?)");
            ps.setString(1, name);
            ps.setDate(2, startDate);
            ps.setDate(3, endDate);
            ps.executeUpdate();
            response.sendRedirect("/admin/elections");
        } catch (Exception e) {
            response.sendError(500, "Error creating election");
        }
    }
}
package backend.controller.voter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.UUID;

/**
 *
 * @author JOSHUA SW
 */
@WebServlet("/voter/receipt")
public class ReceiptController extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String receiptId = UUID.randomUUID().toString(); // Non-traceable for anonymity
        Timestamp timestamp = new Timestamp(System.currentTimeMillis());
        request.setAttribute("receiptId", receiptId);
        request.setAttribute("timestamp", timestamp);
        request.getRequestDispatcher("/Voter/receipt.html").forward(request, response);
    }
}
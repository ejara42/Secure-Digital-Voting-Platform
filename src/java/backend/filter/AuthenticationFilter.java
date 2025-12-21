package backend.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

/**
 * Filter to enforce authentication for protected paths (e.g., /admin/*, /voter/*).
 */
@WebFilter(urlPatterns = {"/admin/*", "/voter/*"})
public class AuthenticationFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        HttpSession session = request.getSession(false);
        String path = request.getServletPath();

        boolean isAdminPath = path.startsWith("/admin");
        boolean isVoterPath = path.startsWith("/voter");

        if (isAdminPath && (session == null || session.getAttribute("admin") == null)) {
            response.sendRedirect("/Public/login.html");
            return;
        }
        if (isVoterPath && (session == null || session.getAttribute("voter") == null)) {
            response.sendRedirect("/Public/login.html");
            return;
        }
        chain.doFilter(req, res);
    }

    @Override
    public void init(FilterConfig filterConfig) {}
    @Override
    public void destroy() {}
}
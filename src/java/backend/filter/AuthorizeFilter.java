package backend.filter;

import java.io.IOException;
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebFilter(urlPatterns = {
    "/admin/*",
    "/backend/controller/Admin",
    "/backend/controller/Election"
})
public class AuthorizeFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        HttpSession session = req.getSession(false);

        boolean loggedIn = (session != null && session.getAttribute("admin") != null);

        if (!loggedIn) {
            res.sendRedirect(req.getContextPath() + "/auth/login.html");
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}

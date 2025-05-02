package edu.cit.AssessMate.Config;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        String userData = (String) authentication.getPrincipal();
        response.setContentType("text/html");
        response.getWriter().write(
                "<script>" +
                "  if (userData) {" +
                "    sessionStorage.setItem('token', userData.token);" +
                "    window.location.replace(userData.needsRoleSelection " +
                "      ? '" + System.getenv("FRONTEND_URL") + "/role-selection'" +
                "      : '" + System.getenv("FRONTEND_URL") + "/dashboard');" +
                "  } else {" +
                "    window.location.href = '" + System.getenv("FRONTEND_URL") + "/login?error=" + encodeURIComponent(errorMessage) + "';" +
                "  }" +
                "</script>"
        );
    }
}
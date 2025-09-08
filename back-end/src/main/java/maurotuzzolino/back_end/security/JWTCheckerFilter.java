package maurotuzzolino.back_end.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.exceptions.UnauthorizedException;
import maurotuzzolino.back_end.services.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTCheckerFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    public JWTCheckerFilter(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");
            if (!jwtTokenUtil.validateToken(token)) {
                throw new UnauthorizedException("Token non valido o scaduto");
            }

            String email = jwtTokenUtil.getEmailFromToken(token);
            User user = userService.findUserByEmail(email);

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Non filtrare login/register e tutte le preflight OPTIONS
        return new AntPathMatcher().match("/api/auth/**", request.getServletPath())
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

}

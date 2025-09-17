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

    // Inietto service utenti e utilità per JWT
    public JWTCheckerFilter(UserService userService, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    // Questo metodo viene eseguito una volta per ogni richiesta HTTP
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Prendo l'header Authorization
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // Estraggo il token rimuovendo "Bearer "
            String token = authHeader.replace("Bearer ", "");

            // Verifico che il token sia valido e non scaduto
            if (!jwtTokenUtil.validateToken(token)) {
                throw new UnauthorizedException("Token non valido o scaduto");
            }

            // Estraggo l'email dal token
            String email = jwtTokenUtil.getEmailFromToken(token);
            // Cerco l'utente nel DB
            User user = userService.findUserByEmail(email);

            // Creo un Authentication object con l'utente e i suoi ruoli
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
            );
            // Lo setto nel contesto di sicurezza di Spring
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        // Continuo la catena di filtri
        filterChain.doFilter(request, response);
    }

    // Metodo per saltare il filtro su determinati percorsi
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Non filtrare login/register e tutte le richieste OPTIONS (preflight CORS)
        return new AntPathMatcher().match("/api/auth/**", request.getServletPath())
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

}

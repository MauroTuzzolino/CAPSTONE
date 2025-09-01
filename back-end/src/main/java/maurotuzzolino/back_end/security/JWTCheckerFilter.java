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

        // Se l'header non c'è o non inizia con "Bearer ", lancio eccezione
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Token mancante o malformato");
        }

        // Estraggo il token dall'header
        String token = authHeader.replace("Bearer ", "");

        // Valido il token
        if (!jwtTokenUtil.validateToken(token)) {
            throw new UnauthorizedException("Token non valido o scaduto");
        }

        // Recupero l'utente dal database
        String email = jwtTokenUtil.getEmailFromToken(token);
        User user = userService.findUserByEmail(email);

        // Setto l'autenticazione nel Security Context
        Authentication auth = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // Passo la richiesta al prossimo filtro/controller
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return new AntPathMatcher().match("/api/auth/**", request.getServletPath());
    }
}

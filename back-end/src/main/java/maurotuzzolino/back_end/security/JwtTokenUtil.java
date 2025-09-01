package maurotuzzolino.back_end.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    // Segreto per firmare i token (meglio in application.properties)
    private final String jwtSecret = "miaChiaveSuperSegreta12345";

    // Durata del token: 1 ora
    private final long jwtExpirationMs = 3600000;

    // Genera token con email e ruolo
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    // Estrae email dal token
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    // Estrae ruolo dal token
    public String getRoleFromToken(String token) {
        return (String) getClaimsFromToken(token).get("role");
    }

    // Controlla se il token è ancora valido
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Estrae Claims
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
    }
}

package maurotuzzolino.back_end.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenUtil {

    private final String secret;         // Segreto per firmare i JWT
    private final long jwtExpirationMs;  // Durata del token in millisecondi

    // Inietto secret e durata dal properties (default 24h)
    public JwtTokenUtil(@Value("${jwt.secret}") String secret,
                        @Value("${jwt.expiration-ms:86400000}") long jwtExpirationMs) {
        this.secret = secret;
        this.jwtExpirationMs = jwtExpirationMs;
    }

    // Genera un token JWT con email e ruolo
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);  // aggiungo il ruolo come claim

        return Jwts.builder()
                .setClaims(claims)                      // aggiungo i claim
                .setSubject(email)                       // subject = email
                .setIssuedAt(new Date())                 // data di creazione
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs)) // scadenza
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256) // firma
                .compact();                              // genero la stringa finale
    }

    // Estrae l'email dal token
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    // Estrae il ruolo dal token
    public String getRoleFromToken(String token) {
        return (String) getClaimsFromToken(token).get("role");
    }

    // Controlla se il token è valido e non scaduto
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return !claims.getExpiration().before(new Date()); // true se non scaduto
        } catch (Exception e) {
            return false; // qualsiasi eccezione = token non valido
        }
    }

    // Parsing del token per ottenere i claims
    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())) // uso la chiave segreta per verificare
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}

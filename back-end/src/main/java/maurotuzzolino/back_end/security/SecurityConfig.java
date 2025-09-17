package maurotuzzolino.back_end.security;

import maurotuzzolino.back_end.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity(prePostEnabled = true) // abilito @PreAuthorize e simili
public class SecurityConfig {

    private final JwtTokenUtil jwtTokenUtil;

    // Inietto il JWT utility per validare e generare token
    public SecurityConfig(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserService userService) throws Exception {
        // Creo il filtro JWT che leggerà il token dalle richieste
        JWTCheckerFilter jwtFilter = new JWTCheckerFilter(userService, jwtTokenUtil);

        http
                .csrf(csrf -> csrf.disable()) // disabilito CSRF perché uso JWT
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // login e register liberi
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // preflight CORS liberi
                        .anyRequest().authenticated() // tutte le altre richieste richiedono autenticazione
                )
                // aggiungo il filtro JWT prima di UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean per codificare le password con BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean per ottenere AuthenticationManager da Spring
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

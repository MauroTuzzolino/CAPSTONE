package maurotuzzolino.back_end.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    // Creo un bean per gestire il CORS (Cross-Origin Resource Sharing)
    @Bean
    public CorsFilter corsFilter() {
        // Configuro le regole CORS
        CorsConfiguration config = new CorsConfiguration();

        // Indico quali origini possono fare richieste al mio backend
        config.setAllowedOrigins(List.of("http://localhost:5173"));

        // Specifico quali metodi HTTP sono permessi
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Specifico quali header posso ricevere nelle richieste
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // Indico quali header posso esporre nella risposta (qui solo Authorization)
        config.setExposedHeaders(List.of("Authorization"));

        // Creo la sorgente per associare questa configurazione a tutti gli endpoint
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // applico la config a tutti i percorsi

        // Ritorno il filtro CORS da usare nel contesto Spring
        return new CorsFilter(source);
    }
}

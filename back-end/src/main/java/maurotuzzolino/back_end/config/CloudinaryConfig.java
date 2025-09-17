package maurotuzzolino.back_end.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    // Qui prendo le credenziali dal file application.properties
    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    // Creo un bean di Cloudinary per poterlo usare in tutta l'app
    @Bean
    public Cloudinary cloudinary() {
        // Metto le credenziali in una mappa, così le passa Cloudinary
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);  // il nome del mio account Cloudinary
        config.put("api_key", apiKey);        // la chiave API
        config.put("api_secret", apiSecret);  // il segreto API

        // Ritorno l'oggetto Cloudinary configurato
        return new Cloudinary(config);
    }
}

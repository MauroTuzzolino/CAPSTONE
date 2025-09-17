package maurotuzzolino.back_end.clients;

import maurotuzzolino.back_end.DTO.SpaceflightArticlesResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class SpaceflightNewsClient {
    // Qui definisco l'URL base dell'API che voglio usare
    private static final String BASE = "https://api.spaceflightnewsapi.net/v4/articles";

    // Creo un'istanza di RestTemplate per fare richieste HTTP
    private final RestTemplate restTemplate = new RestTemplate();

    // Metodo per prendere gli articoli, passo limit e offset per paginazione
    public SpaceflightArticlesResponse fetchArticles(int limit, int offset) {
        // Qui costruisco l'URL completo con i parametri limit e offset
        String url = UriComponentsBuilder.fromHttpUrl(BASE)
                .queryParam("limit", limit)   // imposto quanti articoli voglio
                .queryParam("offset", offset) // imposto da quale articolo partire
                .toUriString();               // trasformo tutto in stringa URL

        // Uso RestTemplate per fare la GET e trasformare la risposta in SpaceflightArticlesResponse
        return restTemplate.getForObject(url, SpaceflightArticlesResponse.class);
    }
}

package maurotuzzolino.back_end.clients;

import maurotuzzolino.back_end.DTO.SpaceflightArticlesResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class SpaceflightNewsClient {
    private static final String BASE = "https://api.spaceflightnewsapi.net/v4/articles";
    private final RestTemplate restTemplate = new RestTemplate();

    public SpaceflightArticlesResponse fetchArticles(int limit, int offset) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE)
                .queryParam("limit", limit)
                .queryParam("offset", offset)
                .toUriString();
        return restTemplate.getForObject(url, SpaceflightArticlesResponse.class);
    }
}

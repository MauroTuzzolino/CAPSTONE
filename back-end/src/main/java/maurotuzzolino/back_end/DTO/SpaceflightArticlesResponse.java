package maurotuzzolino.back_end.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.List;

public class SpaceflightArticlesResponse {
    private int count;
    private String next;
    private String previous;
    private List<Item> results;

    public int getCount() {
        return count;
    }

    public String getNext() {
        return next;
    }

    public String getPrevious() {
        return previous;
    }

    public List<Item> getResults() {
        return results;
    }

    public static class Item {
        private Long id;
        private String title;
        private String url;
        @JsonProperty("image_url")
        private String imageUrl;
        @JsonProperty("published_at")
        private OffsetDateTime publishedAt;
        private String summary;

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getUrl() {
            return url;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public OffsetDateTime getPublishedAt() {
            return publishedAt;
        }

        public String getSummary() {
            return summary;
        }
    }
}

package maurotuzzolino.back_end.DTO;

import java.time.OffsetDateTime;

public class ArticleDTO {
    public Long id;
    public String title;
    public String url;
    public String imageUrl;
    public OffsetDateTime publishedAt;
    public String summary;

    public long likesCount;
    public boolean userHasLiked;
    public long commentsCount;

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

    public long getLikesCount() {
        return likesCount;
    }

    public boolean isUserHasLiked() {
        return userHasLiked;
    }

    public long getCommentsCount() {
        return commentsCount;
    }
}

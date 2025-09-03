package maurotuzzolino.back_end.DTO;

import java.time.OffsetDateTime;

public class ArticleDTO {
    public Long id;           // external ID
    public String title;
    public String url;
    public String imageUrl;
    public OffsetDateTime publishedAt;
    public String summary;

    public long likesCount;
    public boolean userHasLiked;
    public long commentsCount;
}

package maurotuzzolino.back_end.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "news_articles", uniqueConstraints = {
        @UniqueConstraint(name = "uk_news_article_external_id", columnNames = "external_id")
})
public class NewsArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "external_id", nullable = false)
    private Long externalId;

    @Column(length = 500)
    private String title;

    @Column(length = 1000)
    private String url;

    @Column(length = 1000)
    private String imageUrl;

    public NewsArticle() {
    }

    public NewsArticle(Long externalId) {
        this.externalId = externalId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getExternalId() {
        return externalId;
    }

    public void setExternalId(Long externalId) {
        this.externalId = externalId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

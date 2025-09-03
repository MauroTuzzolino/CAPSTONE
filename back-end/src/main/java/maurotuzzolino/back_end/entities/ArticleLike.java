package maurotuzzolino.back_end.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "article_likes", uniqueConstraints = {
        @UniqueConstraint(name = "uk_article_likes_user_article", columnNames = {"user_id", "article_id"})
})
public class ArticleLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "article_id")
    private NewsArticle article;

    public ArticleLike() {
    }

    public ArticleLike(User user, NewsArticle article) {
        this.user = user;
        this.article = article;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public NewsArticle getArticle() {
        return article;
    }

    public void setArticle(NewsArticle article) {
        this.article = article;
    }
}

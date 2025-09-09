package maurotuzzolino.back_end.repositories;

import maurotuzzolino.back_end.entities.ArticleLike;
import maurotuzzolino.back_end.entities.NewsArticle;
import maurotuzzolino.back_end.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
    long countByArticle(NewsArticle article);

    boolean existsByUserAndArticle(User user, NewsArticle article);

    Optional<ArticleLike> findByUserAndArticle(User user, NewsArticle article);

    List<ArticleLike> findByUser(User user);
}

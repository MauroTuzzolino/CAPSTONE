package maurotuzzolino.back_end.repositories;

import maurotuzzolino.back_end.entities.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    Optional<NewsArticle> findByExternalId(Long externalId);
}

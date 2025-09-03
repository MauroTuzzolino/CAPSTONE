package maurotuzzolino.back_end.repositories;

import maurotuzzolino.back_end.entities.ArticleComment;
import maurotuzzolino.back_end.entities.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleCommentRepository extends JpaRepository<ArticleComment, Long> {
    List<ArticleComment> findByArticleOrderByCreatedAtDesc(NewsArticle article);

    long countByArticle(NewsArticle article);
}

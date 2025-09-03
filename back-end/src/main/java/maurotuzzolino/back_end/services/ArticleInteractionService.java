package maurotuzzolino.back_end.services;

import maurotuzzolino.back_end.DTO.ArticleDTO;
import maurotuzzolino.back_end.DTO.CommentDTO;
import maurotuzzolino.back_end.DTO.CreateCommentRequest;
import maurotuzzolino.back_end.DTO.SpaceflightArticlesResponse;
import maurotuzzolino.back_end.clients.SpaceflightNewsClient;
import maurotuzzolino.back_end.entities.ArticleComment;
import maurotuzzolino.back_end.entities.ArticleLike;
import maurotuzzolino.back_end.entities.NewsArticle;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.exceptions.BadRequestException;
import maurotuzzolino.back_end.exceptions.NotFoundException;
import maurotuzzolino.back_end.repositories.ArticleCommentRepository;
import maurotuzzolino.back_end.repositories.ArticleLikeRepository;
import maurotuzzolino.back_end.repositories.NewsArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ArticleInteractionService {

    private final SpaceflightNewsClient spaceflightNewsClient;
    private final NewsArticleRepository newsArticleRepository;
    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleCommentRepository articleCommentRepository;

    public ArticleInteractionService(SpaceflightNewsClient spaceflightNewsClient,
                                     NewsArticleRepository newsArticleRepository,
                                     ArticleLikeRepository articleLikeRepository,
                                     ArticleCommentRepository articleCommentRepository) {
        this.spaceflightNewsClient = spaceflightNewsClient;
        this.newsArticleRepository = newsArticleRepository;
        this.articleLikeRepository = articleLikeRepository;
        this.articleCommentRepository = articleCommentRepository;
    }

    // Utility: trova o crea il proxy locale dal externalId
    @Transactional
    public NewsArticle ensureArticle(Long externalId, String title, String url, String imageUrl) {
        return newsArticleRepository.findByExternalId(externalId).orElseGet(() -> {
            NewsArticle a = new NewsArticle(externalId);
            a.setTitle(title);
            a.setUrl(url);
            a.setImageUrl(imageUrl);
            return newsArticleRepository.save(a);
        });
    }

    // GET arricchito
    @Transactional(readOnly = true)
    public SpaceflightArticlesResponse fetchRawFromApi(int limit, int offset) {
        return spaceflightNewsClient.fetchArticles(limit, offset);
    }

    @Transactional
    public List<ArticleDTO> getArticlesWithStats(int limit, int offset, User currentUser) {
        SpaceflightArticlesResponse resp = fetchRawFromApi(limit, offset);
        return resp.getResults().stream().map(item -> {
            // assicurati che esista l'articolo locale
            NewsArticle article = ensureArticle(
                    item.getId(),
                    item.getTitle(),
                    item.getUrl(),
                    item.getImageUrl()
            );

            long likes = articleLikeRepository.countByArticle(article);
            long comments = articleCommentRepository.countByArticle(article);
            boolean userLiked = currentUser != null &&
                    articleLikeRepository.existsByUserAndArticle(currentUser, article);

            ArticleDTO dto = new ArticleDTO();
            dto.id = item.getId();
            dto.title = item.getTitle();
            dto.url = item.getUrl();
            dto.imageUrl = item.getImageUrl();
            dto.publishedAt = item.getPublishedAt();
            dto.summary = item.getSummary();
            dto.likesCount = likes;
            dto.userHasLiked = userLiked;
            dto.commentsCount = comments;
            return dto;
        }).toList();
    }

    // LIKE
    @Transactional
    public void like(Long externalId, User user) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente (prima richiamalo dalla lista)"));

        if (articleLikeRepository.existsByUserAndArticle(user, article)) {
            throw new BadRequestException("Hai già messo like a questo articolo");
        }
        articleLikeRepository.save(new ArticleLike(user, article));
    }

    // UNLIKE
    @Transactional
    public void unlike(Long externalId, User user) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente"));

        ArticleLike like = articleLikeRepository.findByUserAndArticle(user, article)
                .orElseThrow(() -> new NotFoundException("Non avevi messo like a questo articolo"));
        articleLikeRepository.delete(like);
    }

    // COMMENTA
    @Transactional
    public CommentDTO addComment(Long externalId, User user, CreateCommentRequest body) {
        if (body.getContent() == null || body.getContent().isBlank()) {
            throw new BadRequestException("Il commento non può essere vuoto");
        }
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente"));

        ArticleComment c = articleCommentRepository.save(new ArticleComment(user, article, body.getContent()));
        CommentDTO dto = new CommentDTO();
        dto.id = c.getId();
        dto.authorId = user.getId();
        dto.authorUsername = user.getUsername();
        dto.content = c.getContent();
        dto.createdAt = c.getCreatedAt();
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CommentDTO> getComments(Long externalId) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente"));
        return articleCommentRepository.findByArticleOrderByCreatedAtDesc(article)
                .stream()
                .map(c -> {
                    CommentDTO dto = new CommentDTO();
                    dto.id = c.getId();
                    dto.authorId = c.getAuthor().getId();
                    dto.authorUsername = c.getAuthor().getUsername();
                    dto.content = c.getContent();
                    dto.createdAt = c.getCreatedAt();
                    return dto;
                }).toList();
    }
}
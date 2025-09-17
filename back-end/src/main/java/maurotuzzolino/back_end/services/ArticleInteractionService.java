package maurotuzzolino.back_end.services;

import maurotuzzolino.back_end.DTO.*;
import maurotuzzolino.back_end.clients.SpaceflightNewsClient;
import maurotuzzolino.back_end.entities.ArticleComment;
import maurotuzzolino.back_end.entities.ArticleLike;
import maurotuzzolino.back_end.entities.NewsArticle;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
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

    // Inietto client esterno e repository locali
    public ArticleInteractionService(SpaceflightNewsClient spaceflightNewsClient,
                                     NewsArticleRepository newsArticleRepository,
                                     ArticleLikeRepository articleLikeRepository,
                                     ArticleCommentRepository articleCommentRepository) {
        this.spaceflightNewsClient = spaceflightNewsClient;
        this.newsArticleRepository = newsArticleRepository;
        this.articleLikeRepository = articleLikeRepository;
        this.articleCommentRepository = articleCommentRepository;
    }

    // Utility: assicuro che esista un articolo locale, altrimenti lo creo
    @Transactional
    public NewsArticle ensureArticle(Long externalId, String title, String url, String imageUrl) {
        return newsArticleRepository.findByExternalId(externalId).orElseGet(() -> {
            NewsArticle a = new NewsArticle(externalId);
            a.setTitle(title);
            a.setUrl(url);
            a.setImageUrl(imageUrl);
            return newsArticleRepository.save(a); // salvo il proxy locale
        });
    }

    // Ottiene articoli arricchiti con like, commenti e info dell'utente
    @Transactional
    public PagedResponse<ArticleDTO> getArticlesWithStats(int page, int size, User currentUser) {
        int offset = page * size;
        // prendo articoli dal client esterno
        SpaceflightArticlesResponse resp = spaceflightNewsClient.fetchArticles(size, offset);

        List<ArticleDTO> articles = resp.getResults().stream().map(item -> {
            // assicuro l'esistenza dell'articolo locale
            NewsArticle article = ensureArticle(
                    item.getId(),
                    item.getTitle(),
                    item.getUrl(),
                    item.getImageUrl()
            );

            // conto like e commenti e controllo se l'utente ha messo like
            long likes = articleLikeRepository.countByArticle(article);
            long comments = articleCommentRepository.countByArticle(article);
            boolean userLiked = currentUser != null &&
                    articleLikeRepository.existsByUserAndArticle(currentUser, article);

            // costruisco il DTO
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

        return new PagedResponse<>(articles, page, size, resp.getCount());
    }

    // Aggiunge like a un articolo
    @Transactional
    public void like(Long externalId, User user) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente (prima richiamalo dalla lista)"));

        // controllo che l'utente non abbia già messo like
        if (articleLikeRepository.existsByUserAndArticle(user, article)) {
            throw new BadRequestException("Hai già messo like a questo articolo");
        }
        articleLikeRepository.save(new ArticleLike(user, article));
    }

    // Rimuove like da un articolo
    @Transactional
    public void unlike(Long externalId, User user) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non presente localmente"));

        ArticleLike like = articleLikeRepository.findByUserAndArticle(user, article)
                .orElseThrow(() -> new NotFoundException("Non avevi messo like a questo articolo"));
        articleLikeRepository.delete(like);
    }

    // Aggiunge un commento a un articolo
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

    // Ottiene lista commenti di un articolo
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

    // Elimina un commento (solo admin o autore)
    @Transactional
    public void deleteComment(Long externalId, Long commentId, User currentUser) {
        NewsArticle article = newsArticleRepository.findByExternalId(externalId)
                .orElseThrow(() -> new NotFoundException("Articolo non trovato"));

        ArticleComment comment = articleCommentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Commento non trovato"));

        // controllo che il commento appartenga all'articolo corretto
        if (!comment.getArticle().equals(article)) {
            throw new BadRequestException("Il commento non appartiene a questo articolo");
        }

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        // controllo permessi
        if (!isAdmin && !comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Non hai i permessi per eliminare questo commento");
        }

        articleCommentRepository.delete(comment);
    }
}

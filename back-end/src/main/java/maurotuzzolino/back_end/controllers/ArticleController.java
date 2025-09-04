package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.DTO.ArticleDTO;
import maurotuzzolino.back_end.DTO.CommentDTO;
import maurotuzzolino.back_end.DTO.CreateCommentRequest;
import maurotuzzolino.back_end.DTO.PagedResponse;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.services.ArticleInteractionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleInteractionService articleService;

    public ArticleController(ArticleInteractionService articleService) {
        this.articleService = articleService;
    }

    // Lista arricchita: pubblica
    @GetMapping
    public PagedResponse<ArticleDTO> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User currentUser) {
        return articleService.getArticlesWithStats(page, size, currentUser);
    }

    // Metti like (autenticato)
    @PostMapping("/{externalId}/like")
    @PreAuthorize("isAuthenticated()")
    public void like(@PathVariable Long externalId, @AuthenticationPrincipal User currentUser) {
        articleService.like(externalId, currentUser);
    }

    // Togli like (autenticato)
    @DeleteMapping("/{externalId}/like")
    @PreAuthorize("isAuthenticated()")
    public void unlike(@PathVariable Long externalId, @AuthenticationPrincipal User currentUser) {
        articleService.unlike(externalId, currentUser);
    }

    // Aggiungi commento (autenticato)
    @PostMapping("/{externalId}/comments")
    @PreAuthorize("isAuthenticated()")
    public CommentDTO comment(@PathVariable Long externalId,
                              @RequestBody CreateCommentRequest body,
                              @AuthenticationPrincipal User currentUser) {
        return articleService.addComment(externalId, currentUser, body);
    }

    // Lista commenti (pubblico o autenticato)
    @GetMapping("/{externalId}/comments")
    public List<CommentDTO> comments(@PathVariable Long externalId) {
        return articleService.getComments(externalId);
    }
}

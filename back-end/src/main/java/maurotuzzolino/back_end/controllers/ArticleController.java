package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.DTO.ArticleDTO;
import maurotuzzolino.back_end.DTO.CommentDTO;
import maurotuzzolino.back_end.DTO.CreateCommentRequest;
import maurotuzzolino.back_end.DTO.PagedResponse;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
import maurotuzzolino.back_end.services.ArticleInteractionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleInteractionService articleService;

    // Inietto il service che si occupa di interazioni sugli articoli
    public ArticleController(ArticleInteractionService articleService) {
        this.articleService = articleService;
    }

    // Endpoint per ottenere la lista degli articoli con stats (pubblico)
    @GetMapping
    public PagedResponse<ArticleDTO> list(
            @RequestParam(defaultValue = "0") int page,  // pagina di default = 0
            @RequestParam(defaultValue = "20") int size, // size di default = 20
            @AuthenticationPrincipal User currentUser) { // Spring inietta l'utente loggato se c'è
        return articleService.getArticlesWithStats(page, size, currentUser);
    }

    // Endpoint per mettere like a un articolo (richiede autenticazione)
    @PostMapping("/{externalId}/like")
    @PreAuthorize("isAuthenticated()")
    public void like(@PathVariable Long externalId, @AuthenticationPrincipal User currentUser) {
        articleService.like(externalId, currentUser);
    }

    // Endpoint per togliere like (richiede autenticazione)
    @DeleteMapping("/{externalId}/like")
    @PreAuthorize("isAuthenticated()")
    public void unlike(@PathVariable Long externalId, @AuthenticationPrincipal User currentUser) {
        articleService.unlike(externalId, currentUser);
    }

    // Endpoint per aggiungere un commento (richiede autenticazione)
    @PostMapping("/{externalId}/comments")
    @PreAuthorize("isAuthenticated()")
    public CommentDTO comment(@PathVariable Long externalId,
                              @RequestBody CreateCommentRequest body,
                              @AuthenticationPrincipal User currentUser) {
        return articleService.addComment(externalId, currentUser, body);
    }

    // Endpoint per ottenere lista commenti di un articolo (pubblico o autenticato)
    @GetMapping("/{externalId}/comments")
    public List<CommentDTO> comments(@PathVariable Long externalId,
                                     @AuthenticationPrincipal User currentUser) {
        // trasformo entity Comment in DTO
        return articleService.getComments(externalId).stream().map(c -> {
            CommentDTO dto = new CommentDTO();
            dto.id = c.getId();
            dto.authorId = c.getAuthorId();
            dto.authorUsername = c.getAuthorUsername();
            dto.content = c.getContent();
            dto.createdAt = c.getCreatedAt();

            // controllo se l'utente può cancellare il commento: admin o autore
            boolean isAdmin = currentUser != null && currentUser.getRole() == Role.ADMIN;
            boolean isAuthor = currentUser != null && currentUser.getId().equals(c.getAuthorId());
            dto.canDelete = isAdmin || isAuthor;

            return dto;
        }).toList();
    }

    // Endpoint per eliminare commento (solo admin o autore)
    @DeleteMapping("/{externalId}/comments/{commentId}")
    @PreAuthorize("hasRole('ADMIN') or #currentUser.id == @articleCommentRepository.findById(#commentId).get().author.id")
    public void deleteComment(@PathVariable Long externalId,
                              @PathVariable Long commentId,
                              @AuthenticationPrincipal User currentUser) {
        articleService.deleteComment(externalId, commentId, currentUser);
    }
}

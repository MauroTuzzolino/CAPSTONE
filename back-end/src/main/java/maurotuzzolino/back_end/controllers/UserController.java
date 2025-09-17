package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.DTO.ArticleDTO;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
import maurotuzzolino.back_end.exceptions.BadRequestException;
import maurotuzzolino.back_end.services.CloudinaryService;
import maurotuzzolino.back_end.services.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    // Inietto i service per utenti e upload immagini
    public UserController(UserService userService, CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        this.userService = userService;
    }

    // GET tutti gli utenti (solo ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Modifica completa dell'utente (Admin o proprietario)
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateUserPost(@PathVariable Long id,
                               @RequestBody User updatedUser) {
        // Controllo che l'ID nel body corrisponda a quello nel path
        if (!id.equals(updatedUser.getId())) {
            throw new BadRequestException("L'ID nel path non corrisponde a quello nel body");
        }
        return userService.updateUserFull(id, updatedUser);
    }

    // Modifica parziale dell'utente (Admin o proprietario)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateUserPatch(@PathVariable Long id,
                                @RequestBody User partialUpdate,
                                @AuthenticationPrincipal User currentUser) {

        // Controllo aggiuntivo lato codice per sicurezza
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Non puoi modificare questo utente");
        }

        return userService.updateUserPartial(id, partialUpdate);
    }

    // Elimina utente (solo ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Utente eliminato con successo";
    }

    // Aggiorna immagine profilo (Admin o proprietario)
    @PatchMapping("/{id}/profile-picture")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateProfilePicture(@PathVariable Long id,
                                     @RequestParam("file") MultipartFile file,
                                     @AuthenticationPrincipal User currentUser) throws IOException {

        // Controllo lato codice che solo admin o proprietario possano aggiornare
        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Non puoi modificare questo utente");
        }

        // Carico l'immagine su Cloudinary
        String imageUrl = cloudinaryService.uploadImage(file);
        return userService.updateProfilePicture(id, imageUrl);
    }

    // Restituisce articoli piaciuti dall’utente loggato
    @GetMapping("/me/liked-articles")
    public List<ArticleDTO> getLikedArticles(@AuthenticationPrincipal User currentUser) {
        return userService.getLikedArticles(currentUser);
    }

    // Restituisce info dell'utente loggato
    @GetMapping("/me")
    public User getCurrentUser(@AuthenticationPrincipal User currentUser) {
        return currentUser;
    }
}

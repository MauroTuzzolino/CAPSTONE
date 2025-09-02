package maurotuzzolino.back_end.controllers;

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

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public UserController(UserService userService, CloudinaryService cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
        this.userService = userService;
    }

    // Modifica completa (Admin o il proprietario)
    @PostMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateUserPost(@PathVariable Long id,
                               @RequestBody User updatedUser) {
        if (!id.equals(updatedUser.getId())) {
            throw new BadRequestException("L'ID nel path non corrisponde a quello nel body");
        }
        return userService.updateUserFull(id, updatedUser);
    }

    // Modifica parziale (Admin o il proprietario)
    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateUserPatch(@PathVariable Long id,
                                @RequestBody User partialUpdate,
                                @AuthenticationPrincipal User currentUser) {

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

    // Aggiorna immagine profilo (Admin o il proprietario)
    @PatchMapping("/{id}/profile-picture")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public User updateProfilePicture(@PathVariable Long id,
                                     @RequestParam("file") MultipartFile file,
                                     @AuthenticationPrincipal User currentUser) throws IOException {

        if (!currentUser.getId().equals(id) && currentUser.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Non puoi modificare questo utente");
        }

        String imageUrl = cloudinaryService.uploadImage(file);
        return userService.updateProfilePicture(id, imageUrl);
    }
}

package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
import maurotuzzolino.back_end.exceptions.BadRequestException;
import maurotuzzolino.back_end.services.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
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
}

package maurotuzzolino.back_end.services;

import maurotuzzolino.back_end.DTO.ArticleDTO;
import maurotuzzolino.back_end.DTO.RegisterRequest;
import maurotuzzolino.back_end.entities.ArticleLike;
import maurotuzzolino.back_end.entities.NewsArticle;
import maurotuzzolino.back_end.entities.PasswordResetToken;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
import maurotuzzolino.back_end.exceptions.BadRequestException;
import maurotuzzolino.back_end.exceptions.EmailAlreadyExistsException;
import maurotuzzolino.back_end.exceptions.NotFoundException;
import maurotuzzolino.back_end.repositories.ArticleCommentRepository;
import maurotuzzolino.back_end.repositories.ArticleLikeRepository;
import maurotuzzolino.back_end.repositories.PasswordResetTokenRepository;
import maurotuzzolino.back_end.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetTokenRepository tokenRepository;
    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleCommentRepository articleCommentRepository;

    // Inietto repository, encoder e servizio email
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService, PasswordResetTokenRepository tokenRepository, ArticleLikeRepository articleLikeRepository, ArticleCommentRepository articleCommentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.tokenRepository = tokenRepository;
        this.articleLikeRepository = articleLikeRepository;
        this.articleCommentRepository = articleCommentRepository;
    }

    // Registrazione utente
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        User savedUser = userRepository.save(user);

        // Invio email di benvenuto
        try {
            emailService.sendEmail(
                    savedUser.getEmail(),
                    "Benvenuto su BlackHole!",
                    "Ciao " + savedUser.getFirstName() + ", grazie per esserti registrato!"
            );
        } catch (IOException e) {
            e.printStackTrace();
        }

        return savedUser;
    }

    // Trova utente per email
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con email: " + email));
    }

    // Modifica completa dell'utente (POST)
    public User updateUserFull(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con ID: " + id));

        if (!id.equals(updatedUser.getId())) {
            throw new BadRequestException("L'ID nel path non corrisponde a quello nel body");
        }

        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());

        // Se la password cambia, la codifico e invio email notifica
        if (updatedUser.getPasswordHash() != null) {
            existingUser.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
            try {
                emailService.sendEmail(
                        existingUser.getEmail(),
                        "Password modificata",
                        "Ciao " + existingUser.getFirstName() + ", la tua password è stata modificata correttamente."
                );
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        return userRepository.save(existingUser);
    }

    // Modifica parziale dell'utente (PATCH)
    public User updateUserPartial(Long id, User partialUpdate) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con ID: " + id));

        if (partialUpdate.getFirstName() != null) existingUser.setFirstName(partialUpdate.getFirstName());
        if (partialUpdate.getLastName() != null) existingUser.setLastName(partialUpdate.getLastName());
        if (partialUpdate.getUsername() != null) existingUser.setUsername(partialUpdate.getUsername());
        if (partialUpdate.getEmail() != null) existingUser.setEmail(partialUpdate.getEmail());

        if (partialUpdate.getPasswordHash() != null) {
            existingUser.setPasswordHash(passwordEncoder.encode(partialUpdate.getPasswordHash()));
            try {
                emailService.sendEmail(
                        existingUser.getEmail(),
                        "Password modificata",
                        "Ciao " + existingUser.getFirstName() + ", la tua password è stata modificata correttamente."
                );
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        if (partialUpdate.getRole() != null) existingUser.setRole(partialUpdate.getRole());

        return userRepository.save(existingUser);
    }

    // Elimina utente (solo ADMIN)
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("Utente non trovato con ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // Necessario per Spring Security (autenticazione)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));
    }

    // Genera token per reset password e invia email
    public void createPasswordResetToken(String email, String appUrl) throws IOException {
        User user = findUserByEmail(email);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusHours(1); // token valido 1h

        PasswordResetToken resetToken = new PasswordResetToken(token, user, expiry);
        tokenRepository.save(resetToken);

        String resetLink = appUrl + "/reset-password?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "Reset password",
                "Ciao " + user.getFirstName() + ",\n\nClicca sul link per resettare la password: " + resetLink
        );
    }

    // Reset password usando token
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Token non valido"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Token scaduto");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Elimino il token dopo l’uso
        tokenRepository.delete(resetToken);
    }

    // Aggiorna immagine profilo
    public User updateProfilePicture(Long id, String imageUrl) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));
        user.setProfileImageUrl(imageUrl);
        return userRepository.save(user);
    }

    // Restituisce articoli piaciuti dall’utente
    public List<ArticleDTO> getLikedArticles(User user) {
        List<ArticleLike> likes = articleLikeRepository.findByUser(user);
        return likes.stream()
                .map(like -> mapToDTO(like.getArticle(), user))
                .collect(Collectors.toList());
    }

    // Conversione entity → DTO minimal
    private ArticleDTO mapToDTO(NewsArticle article, User currentUser) {
        ArticleDTO dto = new ArticleDTO();
        dto.id = article.getExternalId();
        dto.title = safe(article.getTitle());
        dto.url = safe(article.getUrl());
        dto.imageUrl = safe(article.getImageUrl());

        dto.likesCount = articleLikeRepository.countByArticle(article);
        dto.userHasLiked = articleLikeRepository.existsByUserAndArticle(currentUser, article);
        dto.commentsCount = 0;

        return dto;
    }

    private String safe(String value) {
        return value != null ? value : "";
    }

    // Restituisce tutti gli utenti (solo ADMIN)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

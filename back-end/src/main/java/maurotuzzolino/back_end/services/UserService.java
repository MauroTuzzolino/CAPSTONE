package maurotuzzolino.back_end.services;

import maurotuzzolino.back_end.DTO.RegisterRequest;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.enums.Role;
import maurotuzzolino.back_end.exceptions.BadRequestException;
import maurotuzzolino.back_end.exceptions.EmailAlreadyExistsException;
import maurotuzzolino.back_end.exceptions.NotFoundException;
import maurotuzzolino.back_end.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //Registrazione
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

        return userRepository.save(user);
    }

    //Trova utente per email
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con email: " + email));
    }

    //Modifica completa (POST)
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

        if (updatedUser.getPasswordHash() != null) {
            existingUser.setPasswordHash(passwordEncoder.encode(updatedUser.getPasswordHash()));
        }

        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }

        return userRepository.save(existingUser);
    }

    //Modifica parziale (PATCH)
    public User updateUserPartial(Long id, User partialUpdate) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con ID: " + id));

        if (partialUpdate.getFirstName() != null) existingUser.setFirstName(partialUpdate.getFirstName());
        if (partialUpdate.getLastName() != null) existingUser.setLastName(partialUpdate.getLastName());
        if (partialUpdate.getUsername() != null) existingUser.setUsername(partialUpdate.getUsername());
        if (partialUpdate.getEmail() != null) existingUser.setEmail(partialUpdate.getEmail());
        if (partialUpdate.getPasswordHash() != null) {
            existingUser.setPasswordHash(passwordEncoder.encode(partialUpdate.getPasswordHash()));
        }
        if (partialUpdate.getRole() != null) existingUser.setRole(partialUpdate.getRole());

        return userRepository.save(existingUser);
    }

    //Elimina utente (solo ADMIN)
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundException("Utente non trovato con ID: " + id);
        }
        userRepository.deleteById(id);
    }

    //Necessario per Spring Security (autenticazione)
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato con email: " + email));
    }
}

package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.DTO.LoginRequest;
import maurotuzzolino.back_end.DTO.LoginResponse;
import maurotuzzolino.back_end.DTO.RegisterRequest;
import maurotuzzolino.back_end.DTO.ResetPasswordRequest;
import maurotuzzolino.back_end.entities.User;
import maurotuzzolino.back_end.security.JwtTokenUtil;
import maurotuzzolino.back_end.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;

    // Inietto i servizi necessari: gestione utenti, JWT, autenticazione
    public AuthController(UserService userService, JwtTokenUtil jwtTokenUtil,
                          AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    // Endpoint per registrare un nuovo utente
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        userService.registerUser(request); // chiamo il service per creare l'utente
        return ResponseEntity.ok("Utente registrato con successo"); // ritorno messaggio semplice
    }

    // Endpoint per login
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Creo un token di autenticazione Spring con email e password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Estraggo l'utente autenticato
        User user = (User) authentication.getPrincipal();
        // Genero il JWT passando email e ruolo
        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().name());

        // Ritorno il token dentro un DTO
        return ResponseEntity.ok(new LoginResponse(token));
    }

    // Endpoint per richiedere reset della password (invia email)
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email, @RequestParam String appUrl) throws IOException {
        // Creo il token e mando email tramite il service
        userService.createPasswordResetToken(email, appUrl);
        return "Email di reset inviata, controlla la tua casella!";
    }

    // Endpoint per resettare la password usando il token ricevuto via email
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest body) {
        // Chiamo il service per aggiornare la password
        userService.resetPassword(body.getToken(), body.getNewPassword());
        return ResponseEntity.ok().build(); // ritorno 200 OK vuoto
    }
}

package maurotuzzolino.back_end.controllers;

import maurotuzzolino.back_end.DTO.LoginRequest;
import maurotuzzolino.back_end.DTO.LoginResponse;
import maurotuzzolino.back_end.DTO.RegisterRequest;
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

    public AuthController(UserService userService, JwtTokenUtil jwtTokenUtil,
                          AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("Utente registrato con successo");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(new LoginResponse(token));
    }

    // Richiesta reset password
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email, @RequestParam String appUrl) throws IOException {
        userService.createPasswordResetToken(email, appUrl);
        return "Email di reset inviata, controlla la tua casella!";
    }

    // Reset password vero e proprio
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return "Password modificata con successo!";
    }
}

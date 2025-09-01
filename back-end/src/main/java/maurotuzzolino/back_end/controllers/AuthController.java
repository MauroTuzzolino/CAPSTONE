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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
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
        String token = jwtTokenUtil.generateToken(user.getEmail(), String.valueOf(user.getRole()));

        return ResponseEntity.ok(new LoginResponse(token));
    }
}
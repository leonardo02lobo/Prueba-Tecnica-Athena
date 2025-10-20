package crazyImage.demo.Controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crazyImage.demo.entity.AuthDto;
import crazyImage.demo.entity.JwtResponse;
import crazyImage.demo.model.User;
import crazyImage.demo.service.JwtService;
import crazyImage.demo.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService,JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        boolean response = userService.AddUser(user);

        if (!response) {
            return ResponseEntity.badRequest().body("Error en el body de la request");
        }
        return ResponseEntity.ok().body("Usuario Agregado");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto auth) {
        try {
            boolean authValid = userService.authUser(auth.getEmail(), auth.getPassword());

            if (!authValid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas al momento de loguearte");
            }
            Optional<User> user = userService.getUserByEmail(auth.getEmail());

            if (user.isPresent()) {
                User usuario = user.get();
                return ResponseEntity.ok(new JwtResponse(jwtService.getToken(usuario), usuario.getEmail(), usuario.getUsername(), usuario.getId()));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}

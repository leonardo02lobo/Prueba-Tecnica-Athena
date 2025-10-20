package crazyImage.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import crazyImage.demo.entity.UserDto;
import crazyImage.demo.model.User;
import crazyImage.demo.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController{

    private final UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> AddUser(@Valid @RequestBody User user){
        boolean response = userService.AddUser(user);

        if(!response){
            return ResponseEntity.badRequest().body("Error en el body de la request");
        }
        return ResponseEntity.ok().body("Usuario Agregado");
    } 

    @GetMapping("/{Id}")
    public ResponseEntity<?> FindUserById(@PathVariable Long Id){
        UserDto user = userService.FindUserById(Id);

        if(user == null){
            return ResponseEntity.badRequest().body("No se consiguio el usuario");
        }
        return ResponseEntity.ok().body(user);
    }

    @GetMapping
    public ResponseEntity<?> getAllUser(){
        return ResponseEntity.ok().body(userService.getAllUser());
    }

    @PutMapping("/{Id}")
    public ResponseEntity<?> PutUserById(@PathVariable Long Id,@Valid @RequestBody User user){
        boolean response = userService.PutUserById(Id,user);

        if(!response){
            return ResponseEntity.badRequest().body("Error en el body de la request");
        }
        return ResponseEntity.ok().body("Usuario Actualizado");
    } 

    @DeleteMapping("/{Id}")
    public ResponseEntity<?> DeleteById(@PathVariable Long Id){
        boolean response = userService.DeleteById(Id);

        if(!response){
            return ResponseEntity.badRequest().body("Error en el body de la request");
        }
        return ResponseEntity.ok().body("Usuario Eliminado");
    } 
}
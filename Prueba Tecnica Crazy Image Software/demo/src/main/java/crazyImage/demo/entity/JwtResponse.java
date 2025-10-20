package crazyImage.demo.entity;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String email;
    private String nombre;
    private Long id;

    public JwtResponse(String token, String email, String nombre, Long id) {
        this.token = token;
        this.email = email;
        this.nombre = nombre;
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

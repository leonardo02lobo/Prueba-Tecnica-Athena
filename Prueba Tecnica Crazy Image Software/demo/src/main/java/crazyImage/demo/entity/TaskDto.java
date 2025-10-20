package crazyImage.demo.entity;

import crazyImage.demo.model.User;

public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Long user_Id;
    private User user;

    public TaskDto() {
    }

    public TaskDto(Long id, String title, String description, String status, Long user_Id, User user) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.user_Id = user_Id;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getUser_Id() {
        return user_Id;
    }

    public void setUser_Id(Long user_Id) {
        this.user_Id = user_Id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

}
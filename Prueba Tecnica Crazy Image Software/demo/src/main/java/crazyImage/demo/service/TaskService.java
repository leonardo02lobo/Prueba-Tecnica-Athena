package crazyImage.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import crazyImage.demo.entity.TaskDto;
import crazyImage.demo.model.Task;
import crazyImage.demo.model.User;
import crazyImage.demo.repository.TaskRepository;
import crazyImage.demo.repository.UserRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public boolean AddTask(Task task) {
        if (task == null) {
            return false;
        }
        taskRepository.save(task);
        return true;
    }

    public List<TaskDto> GetAllTask() {
        return taskRepository.findAll().stream()
                .map(task -> {
                    User user = userRepository.findById(task.getUser_Id())
                            .orElse(null);

                    return new TaskDto(
                            task.getId(),
                            task.getTitle(),
                            task.getDescription(),
                            task.getStatus(),
                            task.getUser_Id(),
                            user);
                })
                .collect(Collectors.toList());
    }

    public TaskDto GetTaskById(Long Id){
        if(Id == 0 || Id <= 0){
            return null;
        }
        Optional<Task> taskOptional = taskRepository.findById(Id);
        if(!taskOptional.isPresent()){
            return new TaskDto();
        }
        Task task = taskOptional.get();
        User user = userRepository.findById(task.getUser_Id())
                            .orElse(null);
        return new TaskDto(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(), task.getUser_Id(), user);
    }

    public boolean UpdateTaskbyId(Long Id,Task newTask){
        if(Id == 0 || Id <= 0){
            return false;
        }
        Optional<Task> taskOptional = taskRepository.findById(Id);
        if(!taskOptional.isPresent()){
            return false;
        }
        Task task = taskOptional.get();
        task.setDescription(newTask.getDescription());
        task.setStatus(newTask.getStatus());
        task.setTitle(newTask.getTitle());
        taskRepository.save(task);
        return true;
    }

    public boolean DeleteById(Long Id) {
        if (Id == null || Id <= 0) {
            return false;
        }
        taskRepository.deleteById(Id);
        return true;
    }
}

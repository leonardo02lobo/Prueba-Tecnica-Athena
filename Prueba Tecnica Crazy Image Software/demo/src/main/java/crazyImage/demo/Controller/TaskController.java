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

import crazyImage.demo.model.Task;
import crazyImage.demo.service.TaskService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "http://localhost:4321", allowCredentials = "true")
public class TaskController {
    
    private final TaskService taskService;

    public TaskController(TaskService taskService){
        this.taskService = taskService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> AddTask(@Valid @RequestBody Task task){
        boolean response = taskService.AddTask(task);
        if(!response){
            return ResponseEntity.badRequest().body("Cannot add the task");
        }
        return ResponseEntity.status(201).body("Task add");
    }

    @GetMapping
    public ResponseEntity<?> GetAllTask(){
        return ResponseEntity.ok().body(taskService.GetAllTask());
    }

    @GetMapping("/{Id}")
    public ResponseEntity<?> GetTaskById(@PathVariable Long Id){
        return ResponseEntity.ok().body(taskService.GetTaskById(Id));
    }

    @PutMapping("/{Id}")
    public ResponseEntity<?> UpdateTaskbyId(@PathVariable Long Id,@Valid @RequestBody Task task){
        boolean response = taskService.UpdateTaskbyId(Id,task);
        if(!response){
            return ResponseEntity.badRequest().body("Cannot update the task");
        }
        return ResponseEntity.status(200).body("Task update");
    }

    @DeleteMapping("/{Id}")
    public ResponseEntity<?> DeleteById(@PathVariable Long Id){
        boolean response = taskService.DeleteById(Id);
        if(!response){
            return ResponseEntity.badRequest().body("Cannot delete the task");
        }
        return ResponseEntity.status(200).body("Task delete");
    }
}

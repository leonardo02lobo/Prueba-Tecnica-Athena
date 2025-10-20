package crazyImage.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import crazyImage.demo.model.Task;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long>{
    
}

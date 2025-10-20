package crazyImage.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import crazyImage.demo.entity.UserDto;
import crazyImage.demo.model.User;
import crazyImage.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean AddUser(User user) {
        if (user == null) {
            return false;
        }
        if(userRepository.existsByEmail(user.getEmail())){
            return false;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }

    public UserDto FindUserById(Long Id) {
        Optional<User> user = userRepository.findById(Id);

        if (!user.isPresent()) {
            return null;
        }
        User user2 = user.get();
        UserDto userDto = new UserDto(user2.getId(), user2.getUsername(), user2.getEmail(), user2.getPassword());
        return userDto;
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    public boolean PutUserById(Long Id, User user) {
        if (Id == null || Id <= 0) {
            return false;
        }
        if (user == null) {
            return false;
        }
        Optional<User> findOptional = userRepository.findById(Id);
        if (!findOptional.isPresent()) {
            return false;
        }
        User findUser = findOptional.get();
        findUser.setEmail(user.getEmail());
        findUser.setUsername(user.getUsername());
        findUser.setPassword(user.getPassword());
        userRepository.save(findUser);
        return true;
    }

    public boolean DeleteById(Long Id) {
        if (Id == null || Id <= 0) {
            return false;
        }
        userRepository.deleteById(Id);
        return true;
    }

    public boolean authUser(String email,String password){
        Optional<User> userOptional = userRepository.findByEmail(email);

        if(!userOptional.isPresent()){
            return false;
        }
        User user = userOptional.get();
        return passwordEncoder.matches(password, user.getPassword());
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

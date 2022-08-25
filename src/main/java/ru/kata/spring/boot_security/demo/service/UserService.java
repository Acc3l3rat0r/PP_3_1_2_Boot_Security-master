package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserService extends UserDetailsService{

    List<User> getAllUsers();

    void saveUser(User employee);

    User getUserById(long id);

    void deleteUserById(long id);

    User findByUsername(String username);

}

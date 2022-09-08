package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserRESTController {

    private final UserService userService;

    public UserRESTController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/currentUser")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return new ResponseEntity<>(userService.findByUsername(principal.getName()), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(new ArrayList<>(userService.getAllUsers()), HttpStatus.OK);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return new ResponseEntity<>(userService.getUserById(id), HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<User> creatAndUpdateUser(@RequestBody User newUser) {
        return new ResponseEntity<>(userService.saveUser(newUser), HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable("id") Long id) {
        userService.deleteUserById(id);
    }

}

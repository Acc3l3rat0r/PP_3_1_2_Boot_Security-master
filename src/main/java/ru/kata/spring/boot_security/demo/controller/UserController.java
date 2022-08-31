package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.security.Principal;
import java.util.stream.Collectors;

@Controller
public class UserController {

    private final UserService userService;

    private final RoleService roleService;

    public UserController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/home")
    public String viewAdminHonePage(Model model, Principal principal) {
        model.addAttribute("listUsers", userService.getAllUsers());
        model.addAttribute("listRoles", roleService.getAllRoles());
        model.addAttribute("admin", userService.findByUsername(principal.getName()));
        model.addAttribute("adminRoles",userService.findByUsername(principal.getName()).getRoles()
                .stream()
                .map(String::valueOf)
                .collect(Collectors.joining(" ")));
        model.addAttribute("newUser", new User());
        return "admin";
    }

    @PostMapping("/admin/saveUser")
    public String saveUser(@ModelAttribute("newUser") User user) {
        userService.saveUser(user);
        return "redirect:/home";
    }

    @PostMapping("/admin/deleteUser/{id}")
    public String deleteUser(@PathVariable(value = "id") Long id) {
        this.userService.deleteUserById(id);
        return "redirect:/home";
    }

}

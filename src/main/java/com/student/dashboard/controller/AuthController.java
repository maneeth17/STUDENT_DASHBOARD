package com.student.dashboard.controller;

import com.student.dashboard.entity.User;
import com.student.dashboard.repository.UserRepository;
import com.student.dashboard.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return repo.save(user);
    }

    // LOGIN → RETURNS JWT TOKEN
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existing = repo.findByUsername(user.getUsername());

        if (existing != null && existing.getPassword().equals(user.getPassword())) {
            return jwtUtil.generateToken(existing.getUsername());
        }

        throw new RuntimeException("Invalid username or password");
    }
}
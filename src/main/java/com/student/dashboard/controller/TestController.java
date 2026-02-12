package com.student.dashboard.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "Student Dashboard Backend Running 🚀";
    }

    @GetMapping("/api/test")
    public String test() {
        return "API working without database";
    }
}
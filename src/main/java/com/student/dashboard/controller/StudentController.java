package com.student.dashboard.controller;

import com.student.dashboard.entity.Student;
import com.student.dashboard.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentRepository repo;

    @GetMapping
    public List<Student> getAllStudents() {
        return repo.findAll();
    }

    @PostMapping
    public Student addStudent(@RequestBody Student s) {
        return repo.save(s);
    }

    @DeleteMapping("/{id}")
    public void deleteStudent(@PathVariable Long id) {
        repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student s) {
    s.setId(id);
    return repo.save(s);
    }
}
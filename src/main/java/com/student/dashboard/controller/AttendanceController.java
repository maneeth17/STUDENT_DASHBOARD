package com.student.dashboard.controller;

import com.student.dashboard.entity.Attendance;
import com.student.dashboard.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/attendance")
@CrossOrigin
public class AttendanceController {

    @Autowired
    private AttendanceRepository repo;

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return repo.findAll();
    }

    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance a) {
        return repo.save(a);
    }

    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {
    repo.deleteById(id);
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(@PathVariable Long id, @RequestBody Attendance a) {
    a.setId(id);
    return repo.save(a);
    }
}
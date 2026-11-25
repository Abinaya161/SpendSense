package com.spendsense.backend.controller;

import com.spendsense.backend.entity.Student;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.StudentRepository;
import com.spendsense.backend.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    public StudentController(
            StudentRepository studentRepository,
            UserRepository userRepository) {

        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Student saveStudent(
            @RequestBody Student student,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Student existingStudent = studentRepository
                .findByUser_Id(userId)
                .orElse(new Student());

        existingStudent.setName(student.getName());
        existingStudent.setAge(student.getAge());
        existingStudent.setUser(user);

        return studentRepository.save(existingStudent);
    }

    @GetMapping
    public Student getStudent(@RequestParam Long userId) {

        return studentRepository.findByUser_Id(userId)
                .orElse(null);
    }
}
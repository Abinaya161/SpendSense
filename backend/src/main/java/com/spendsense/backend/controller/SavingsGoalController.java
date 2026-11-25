package com.spendsense.backend.controller;

import com.spendsense.backend.entity.SavingsGoal;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.SavingsGoalRepository;
import com.spendsense.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
@CrossOrigin
public class SavingsGoalController {

    private final SavingsGoalRepository savingsGoalRepository;
    private final UserRepository userRepository;

    public SavingsGoalController(
            SavingsGoalRepository savingsGoalRepository,
            UserRepository userRepository) {

        this.savingsGoalRepository = savingsGoalRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public SavingsGoal saveSavingsGoal(
            @RequestBody SavingsGoal savingsGoal,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        savingsGoal.setUser(user);

        return savingsGoalRepository.save(savingsGoal);
    }

    @GetMapping
    public List<SavingsGoal> getAllSavingsGoals(
            @RequestParam Long userId) {

        return savingsGoalRepository.findAllByUser_Id(userId);
    }
}
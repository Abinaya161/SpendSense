package com.spendsense.backend.controller;

import com.spendsense.backend.entity.UpcomingExpense;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.UpcomingExpenseRepository;
import com.spendsense.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/upcoming-expenses")
@CrossOrigin
public class UpcomingExpenseController {

    private final UpcomingExpenseRepository upcomingExpenseRepository;
    private final UserRepository userRepository;

    public UpcomingExpenseController(
            UpcomingExpenseRepository upcomingExpenseRepository,
            UserRepository userRepository) {

        this.upcomingExpenseRepository = upcomingExpenseRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public UpcomingExpense saveUpcomingExpense(
            @RequestBody UpcomingExpense upcomingExpense,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        upcomingExpense.setUser(user);

        return upcomingExpenseRepository.save(upcomingExpense);
    }

    @GetMapping
    public List<UpcomingExpense> getAllUpcomingExpenses(
            @RequestParam Long userId) {

        return upcomingExpenseRepository.findAllByUser_Id(userId);
    }
}
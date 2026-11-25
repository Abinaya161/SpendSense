package com.spendsense.backend.controller;

import com.spendsense.backend.entity.Income;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.IncomeRepository;
import com.spendsense.backend.repository.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin
public class IncomeController {

    private final IncomeRepository incomeRepository;
    private final UserRepository userRepository;

    public IncomeController(
            IncomeRepository incomeRepository,
            UserRepository userRepository) {

        this.incomeRepository = incomeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Income saveIncome(
            @RequestBody Income income,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        income.setUser(user);

        return incomeRepository.save(income);
    }

    @GetMapping
    public List<Income> getAllIncomes(
            @RequestParam Long userId) {

        return incomeRepository.findAllByUser_Id(userId);
    }
}
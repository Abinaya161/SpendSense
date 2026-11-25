package com.spendsense.backend.controller;

import com.spendsense.backend.entity.Expense;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.ExpenseRepository;
import com.spendsense.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository,
            UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Expense saveExpense(@RequestBody Expense expense,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        expense.setUser(user);

        return expenseRepository.save(expense);
    }

    @GetMapping
    public List<Expense> getAllExpenses(@RequestParam Long userId) {
        return expenseRepository.findAllByUser_Id(userId);
    }
}
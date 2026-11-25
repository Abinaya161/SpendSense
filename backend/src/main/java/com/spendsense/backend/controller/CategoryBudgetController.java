package com.spendsense.backend.controller;

import com.spendsense.backend.entity.CategoryBudget;
import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.CategoryBudgetRepository;
import com.spendsense.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category-budgets")
@CrossOrigin
public class CategoryBudgetController {

    private final CategoryBudgetRepository categoryBudgetRepository;
    private final UserRepository userRepository;

    public CategoryBudgetController(
            CategoryBudgetRepository categoryBudgetRepository,
            UserRepository userRepository) {

        this.categoryBudgetRepository = categoryBudgetRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public CategoryBudget saveCategoryBudget(
            @RequestBody CategoryBudget categoryBudget,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        categoryBudget.setUser(user);

        return categoryBudgetRepository.save(categoryBudget);
    }

    @GetMapping
    public List<CategoryBudget> getAllCategoryBudgets(
            @RequestParam Long userId) {

        return categoryBudgetRepository.findAllByUser_Id(userId);
    }
}
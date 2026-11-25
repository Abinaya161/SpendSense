package com.spendsense.backend.repository;

import com.spendsense.backend.entity.CategoryBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryBudgetRepository extends JpaRepository<CategoryBudget, Long> {

    List<CategoryBudget> findAllByUser_Id(Long userId);
}
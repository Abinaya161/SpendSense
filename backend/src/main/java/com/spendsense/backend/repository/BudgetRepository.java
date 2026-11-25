package com.spendsense.backend.repository;

import com.spendsense.backend.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findAllByUser_Id(Long userId);

}
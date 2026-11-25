package com.spendsense.backend.repository;

import com.spendsense.backend.entity.UpcomingExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UpcomingExpenseRepository extends JpaRepository<UpcomingExpense, Long> {

    List<UpcomingExpense> findAllByUser_Id(Long userId);
}
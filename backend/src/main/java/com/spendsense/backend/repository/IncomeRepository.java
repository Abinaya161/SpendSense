package com.spendsense.backend.repository;

import com.spendsense.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findAllByUser_Id(Long userId);
}
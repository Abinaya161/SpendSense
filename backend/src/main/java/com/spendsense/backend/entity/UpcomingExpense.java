package com.spendsense.backend.entity;

import jakarta.persistence.*;

@Entity
public class UpcomingExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String expenseName;

    private double amount;

    private String date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public UpcomingExpense() {
    }

    public UpcomingExpense(String expenseName, double amount, String date) {
        this.expenseName = expenseName;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExpenseName() {
        return expenseName;
    }

    public void setExpenseName(String expenseName) {
        this.expenseName = expenseName;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
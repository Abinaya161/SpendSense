package com.spendsense.backend.controller;

import com.spendsense.backend.entity.User;
import com.spendsense.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());

        user.setPassword(hashedPassword);

        return userRepository.save(user);

    }

    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String storedPassword = existingUser.getPassword();
        String enteredPassword = user.getPassword();

        boolean passwordMatches;

        if (storedPassword.startsWith("$2")) {

            passwordMatches = passwordEncoder.matches(
                    enteredPassword, storedPassword);

        } else {

            passwordMatches = enteredPassword.equals(storedPassword);

            if (passwordMatches) {
                existingUser.setPassword(
                        passwordEncoder.encode(enteredPassword));

                userRepository.save(existingUser);
            }
        }

        if (!passwordMatches) {
            throw new RuntimeException("Invalid password");
        }

        return existingUser;
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody User user) {

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElse(null);

        if (existingUser == null) {
            return "Email not registered.";
        }

        return "Password reset request received. Reset process can continue.";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody User user) {

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElse(null);

        if (existingUser == null) {
            return "Email not registered.";
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());

        existingUser.setPassword(hashedPassword);

        userRepository.save(existingUser);

        return "Password reset successfully.";
    }
}

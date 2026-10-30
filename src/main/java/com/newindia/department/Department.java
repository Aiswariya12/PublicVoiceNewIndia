package com.newindia.department;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "Public Works Department"

    private String contactEmail;
}
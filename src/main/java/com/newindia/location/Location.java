package com.newindia.location;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "locations")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String district;
    
    @Column(name = "pin_code")
    private String pinCode;
}
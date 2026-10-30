package com.newindia.location;

import com.newindia.location.dto.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {
    private final LocationService locationService;

    @GetMapping("/search")
    public List<LocationResponse> search(@RequestParam("q") String query) {
        return locationService.search(query);
    }
}
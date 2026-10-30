package com.newindia.location;

import com.newindia.location.dto.LocationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository locationRepository;

    public List<LocationResponse> search(String query) {
        return locationRepository.findByNameContainingIgnoreCaseOrPinCode(query, query)
                .stream()
                .map(loc -> new LocationResponse(loc.getId(), loc.getName(), loc.getDistrict(), loc.getPinCode()))
                .toList();
    }
}
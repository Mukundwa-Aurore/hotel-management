package com.hotelmanagement.controller;

import com.hotelmanagement.entity.Billing;
import com.hotelmanagement.entity.User;
import com.hotelmanagement.repository.BillingRepository;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/billings")
public class BillingController {

    private final BillingRepository billingRepository;

    public BillingController(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Billing> getBillingByBooking(
            @PathVariable UUID bookingId,
            @AuthenticationPrincipal User user) {
        Billing billing = billingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Billing not found"));
        return ResponseEntity.ok(billing);
    }
}

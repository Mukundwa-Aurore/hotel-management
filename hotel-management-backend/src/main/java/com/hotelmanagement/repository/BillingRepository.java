package com.hotelmanagement.repository;

import com.hotelmanagement.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BillingRepository extends JpaRepository<Billing, UUID> {
    Optional<Billing> findByBookingId(UUID bookingId);
}

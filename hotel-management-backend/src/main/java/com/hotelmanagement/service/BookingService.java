package com.hotelmanagement.service;

import com.hotelmanagement.dto.BookingRequest;
import com.hotelmanagement.dto.BookingResponse;
import com.hotelmanagement.entity.Billing;
import com.hotelmanagement.entity.Booking;
import com.hotelmanagement.entity.Room;
import com.hotelmanagement.entity.User;
import com.hotelmanagement.repository.BillingRepository;
import com.hotelmanagement.repository.BookingRepository;
import com.hotelmanagement.repository.RoomRepository;
import com.hotelmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BillingRepository billingRepository;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository, BillingRepository billingRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.billingRepository = billingRepository;
        this.emailService = emailService;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, UUID userId) {
        if (request.getCheckOut().isBefore(request.getCheckIn()) || request.getCheckOut().isEqual(request.getCheckIn())) {
            throw new RuntimeException("Check-out date must be after check-in date");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getIsAvailable()) {
            throw new RuntimeException("Room is not available");
        }

        boolean isAvailable = roomRepository.findAvailableRoomsForDates(
                room.getHotel().getId(),
                request.getCheckIn(),
                request.getCheckOut()
        ).stream().anyMatch(r -> r.getId().equals(room.getId()));

        if (!isAvailable) {
            throw new RuntimeException("Room is already booked for the selected dates");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(request.getCheckIn());
        booking.setCheckOut(request.getCheckOut());
        booking.setStatus(Booking.BookingStatus.CONFIRMED);
        booking = bookingRepository.save(booking);

        Booking savedBooking = booking;
        Billing billing = billingRepository.findByBookingId(booking.getId())
                .orElseGet(() -> {
                    BigDecimal nights = BigDecimal.valueOf(
                            savedBooking.getCheckOut().toEpochDay() - savedBooking.getCheckIn().toEpochDay()
                    );
                    BigDecimal amount = room.getPrice().multiply(nights);
                    Billing newBilling = new Billing();
                    newBilling.setBooking(savedBooking);
                    newBilling.setAmount(amount);
                    return billingRepository.save(newBilling);
                });

        emailService.sendBookingConfirmationEmail(user, booking, billing.getAmount());

        return mapToResponse(booking, billing.getAmount());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(UUID userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(booking -> {
                    BigDecimal amount = billingRepository.findByBookingId(booking.getId())
                            .map(Billing::getAmount)
                            .orElse(BigDecimal.ZERO);
                    return mapToResponse(booking, amount);
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(booking -> {
                    BigDecimal amount = billingRepository.findByBookingId(booking.getId())
                            .map(Billing::getAmount)
                            .orElse(BigDecimal.ZERO);
                    return mapToResponse(booking, amount);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelBooking(UUID bookingId, UUID userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only cancel your own bookings");
        }

        if (booking.getCheckIn().isBefore(LocalDate.now()) || booking.getCheckIn().isEqual(LocalDate.now())) {
            throw new RuntimeException("Cannot cancel booking that has already started or completed");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponse mapToResponse(Booking booking, BigDecimal billingAmount) {
        return new BookingResponse(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getName(),
                booking.getRoom().getId(),
                booking.getRoom().getRoomType(),
                booking.getRoom().getHotel().getName(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getStatus().name(),
                booking.getCreatedAt(),
                billingAmount
        );
    }
}

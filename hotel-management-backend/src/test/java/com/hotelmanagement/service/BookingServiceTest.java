package com.hotelmanagement.service;

import com.hotelmanagement.dto.BookingRequest;
import com.hotelmanagement.dto.BookingResponse;
import com.hotelmanagement.entity.*;
import com.hotelmanagement.repository.BillingRepository;
import com.hotelmanagement.repository.BookingRepository;
import com.hotelmanagement.repository.RoomRepository;
import com.hotelmanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BillingRepository billingRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private BookingService bookingService;

    private User user;
    private Hotel hotel;
    private Room room;
    private Booking booking;
    private BookingRequest bookingRequest;
    private Billing billing;

    @BeforeEach
    void setUp() {
        UUID userId = UUID.randomUUID();
        UUID hotelId = UUID.randomUUID();
        UUID roomId = UUID.randomUUID();
        UUID bookingId = UUID.randomUUID();

        user = new User();
        user.setId(userId);
        user.setName("John Doe");
        user.setEmail("john@example.com");

        hotel = new Hotel();
        hotel.setId(hotelId);
        hotel.setName("Grand Plaza");

        room = new Room();
        room.setId(roomId);
        room.setHotel(hotel);
        room.setRoomType("Double");
        room.setPrice(new BigDecimal("150.00"));
        room.setIsAvailable(true);

        booking = new Booking();
        booking.setId(bookingId);
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckIn(LocalDate.now().plusDays(1));
        booking.setCheckOut(LocalDate.now().plusDays(3));
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        billing = new Billing();
        billing.setId(UUID.randomUUID());
        billing.setBooking(booking);
        billing.setAmount(new BigDecimal("300.00"));

        bookingRequest = new BookingRequest(
                roomId,
                LocalDate.now().plusDays(1),
                LocalDate.now().plusDays(3)
        );
    }

    @Test
    void createBooking_Success() {
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(roomRepository.findById(room.getId())).thenReturn(Optional.of(room));
        when(roomRepository.findAvailableRoomsForDates(any(), any(), any())).thenReturn(Arrays.asList(room));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);
        when(billingRepository.findByBookingId(any())).thenReturn(Optional.of(billing));
        doNothing().when(emailService).sendBookingConfirmationEmail(any(), any(), any());

        BookingResponse response = bookingService.createBooking(bookingRequest, user.getId());

        assertNotNull(response);
        assertEquals("CONFIRMED", response.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_InvalidDates_ThrowsException() {
        BookingRequest invalidRequest = new BookingRequest(
                room.getId(),
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(3)
        );

        assertThrows(RuntimeException.class, () ->
            bookingService.createBooking(invalidRequest, user.getId())
        );
    }

    @Test
    void createBooking_RoomNotAvailable_ThrowsException() {
        room.setIsAvailable(false);
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(roomRepository.findById(room.getId())).thenReturn(Optional.of(room));

        assertThrows(RuntimeException.class, () ->
            bookingService.createBooking(bookingRequest, user.getId())
        );
    }

    @Test
    void getUserBookings_Success() {
        when(bookingRepository.findByUserId(user.getId())).thenReturn(Arrays.asList(booking));
        when(billingRepository.findByBookingId(booking.getId())).thenReturn(Optional.of(billing));

        var responses = bookingService.getUserBookings(user.getId());

        assertNotNull(responses);
        assertEquals(1, responses.size());
    }

    @Test
    void cancelBooking_Success() {
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        assertDoesNotThrow(() -> bookingService.cancelBooking(booking.getId(), user.getId()));
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void cancelBooking_AlreadyStarted_ThrowsException() {
        booking.setCheckIn(LocalDate.now().minusDays(1));
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        assertThrows(RuntimeException.class, () ->
            bookingService.cancelBooking(booking.getId(), user.getId())
        );
    }

    @Test
    void cancelBooking_NotOwner_ThrowsException() {
        UUID otherUserId = UUID.randomUUID();
        when(bookingRepository.findById(booking.getId())).thenReturn(Optional.of(booking));

        assertThrows(RuntimeException.class, () ->
            bookingService.cancelBooking(booking.getId(), otherUserId)
        );
    }
}

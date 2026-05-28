package com.hotelmanagement.service;

import com.hotelmanagement.dto.HotelRequest;
import com.hotelmanagement.dto.HotelResponse;
import com.hotelmanagement.entity.Hotel;
import com.hotelmanagement.repository.HotelRepository;
import com.hotelmanagement.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private HotelService hotelService;

    private Hotel hotel;
    private HotelRequest hotelRequest;

    @BeforeEach
    void setUp() {
        hotel = new Hotel();
        hotel.setId(UUID.randomUUID());
        hotel.setName("Grand Plaza");
        hotel.setLocation("New York");

        hotelRequest = new HotelRequest("Grand Plaza", "New York");
    }

    @Test
    void createHotel_Success() {
        when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);
        when(roomRepository.findByHotelId(any(UUID.class))).thenReturn(Arrays.asList());

        HotelResponse response = hotelService.createHotel(hotelRequest);

        assertNotNull(response);
        assertEquals("Grand Plaza", response.getName());
        assertEquals("New York", response.getLocation());
        verify(hotelRepository, times(1)).save(any(Hotel.class));
    }

    @Test
    void getAllHotels_Success() {
        List<Hotel> hotels = Arrays.asList(hotel);
        when(hotelRepository.findAll()).thenReturn(hotels);
        when(roomRepository.findByHotelId(any(UUID.class))).thenReturn(Arrays.asList());

        List<HotelResponse> responses = hotelService.getAllHotels();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Grand Plaza", responses.get(0).getName());
    }

    @Test
    void getHotelById_Success() {
        when(hotelRepository.findById(hotel.getId())).thenReturn(Optional.of(hotel));
        when(roomRepository.findByHotelId(any(UUID.class))).thenReturn(Arrays.asList());

        HotelResponse response = hotelService.getHotelById(hotel.getId());

        assertNotNull(response);
        assertEquals("Grand Plaza", response.getName());
    }

    @Test
    void getHotelById_NotFound_ThrowsException() {
        when(hotelRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> hotelService.getHotelById(UUID.randomUUID()));
    }

    @Test
    void updateHotel_Success() {
        HotelRequest updateRequest = new HotelRequest("Updated Hotel", "Los Angeles");
        when(hotelRepository.findById(hotel.getId())).thenReturn(Optional.of(hotel));
        when(hotelRepository.save(any(Hotel.class))).thenReturn(hotel);
        when(roomRepository.findByHotelId(any(UUID.class))).thenReturn(Arrays.asList());

        HotelResponse response = hotelService.updateHotel(hotel.getId(), updateRequest);

        assertNotNull(response);
        verify(hotelRepository, times(1)).save(any(Hotel.class));
    }

    @Test
    void deleteHotel_Success() {
        when(hotelRepository.existsById(hotel.getId())).thenReturn(true);
        doNothing().when(hotelRepository).deleteById(hotel.getId());

        assertDoesNotThrow(() -> hotelService.deleteHotel(hotel.getId()));
        verify(hotelRepository, times(1)).deleteById(hotel.getId());
    }

    @Test
    void deleteHotel_NotFound_ThrowsException() {
        when(hotelRepository.existsById(any(UUID.class))).thenReturn(false);

        assertThrows(RuntimeException.class, () -> hotelService.deleteHotel(UUID.randomUUID()));
    }
}

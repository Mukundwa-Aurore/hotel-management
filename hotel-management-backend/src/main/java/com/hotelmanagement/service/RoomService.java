package com.hotelmanagement.service;

import com.hotelmanagement.dto.RoomRequest;
import com.hotelmanagement.dto.RoomResponse;
import com.hotelmanagement.entity.Hotel;
import com.hotelmanagement.entity.Room;
import com.hotelmanagement.repository.HotelRepository;
import com.hotelmanagement.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final EmailService emailService;

    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository, EmailService emailService) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
        this.emailService = emailService;
    }

    @Transactional
    public RoomResponse createRoom(RoomRequest request) {
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        Room room = new Room();
        room.setHotel(hotel);
        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setIsAvailable(request.getIsAvailable());
        room = roomRepository.save(room);
        return mapToResponse(room);
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getRoomsByHotel(UUID hotelId) {
        return roomRepository.findByHotelId(hotelId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RoomResponse> getAvailableRoomsByHotel(UUID hotelId, LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRoomsForDates(hotelId, checkIn, checkOut).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoomResponse getRoomById(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToResponse(room);
    }

    @Transactional
    public RoomResponse updateRoom(UUID id, RoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        boolean wasAvailable = room.getIsAvailable();

        if (request.getHotelId() != null && !request.getHotelId().equals(room.getHotel().getId())) {
            Hotel hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new RuntimeException("Hotel not found"));
            room.setHotel(hotel);
        }

        room.setRoomType(request.getRoomType());
        room.setPrice(request.getPrice());
        room.setIsAvailable(request.getIsAvailable());
        room = roomRepository.save(room);

        // If the room was available and is now marked unavailable, notify affected
        // users
        if (wasAvailable && !room.getIsAvailable()) {
            emailService.notifyUsersRoomUnavailable(room);
        }
        return mapToResponse(room);
    }

    public void notifyRoomUnavailable(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        emailService.notifyUsersRoomUnavailable(room);
    }

    @Transactional
    public void deleteRoom(UUID id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    private RoomResponse mapToResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getHotel().getId(),
                room.getHotel().getName(),
                room.getRoomType(),
                room.getPrice(),
                room.getIsAvailable(),
                room.getCreatedAt());
    }
}

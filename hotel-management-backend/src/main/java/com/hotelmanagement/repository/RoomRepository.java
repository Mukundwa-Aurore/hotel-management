package com.hotelmanagement.repository;

import com.hotelmanagement.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface RoomRepository extends JpaRepository<Room, UUID> {
    List<Room> findByHotelId(UUID hotelId);
    List<Room> findByIsAvailableTrue();

    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.id NOT IN " +
           "(SELECT b.room.id FROM Booking b WHERE b.status = 'CONFIRMED' " +
           "AND ((b.checkIn <= :checkOut AND b.checkOut >= :checkIn)))")
    List<Room> findAvailableRoomsForDates(@Param("hotelId") UUID hotelId,
                                          @Param("checkIn") LocalDate checkIn,
                                          @Param("checkOut") LocalDate checkOut);
}

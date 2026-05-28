package com.hotelmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private UUID id;
    private UUID hotelId;
    private String hotelName;
    private String roomType;
    private BigDecimal price;
    private Boolean isAvailable;
    private LocalDateTime createdAt;
}

package com.hotelmanagement.config;

import com.hotelmanagement.entity.*;
import com.hotelmanagement.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, HotelRepository hotelRepository,
            RoomRepository roomRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        System.out.println("=== Starting Data Initialization ===");

        // Create admin user
        User admin = new User();
        admin.setId(UUID.randomUUID());
        admin.setName("Admin User");
        admin.setEmail("admin@hotel.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        System.out.println("✅ Admin user created: admin@hotel.com / admin123");

        // Create sample hotel
        Hotel hotel = new Hotel();
        hotel.setId(UUID.randomUUID());
        hotel.setName("Grand Hotel");
        hotel.setLocation("Downtown, City");
        hotelRepository.save(hotel);
        System.out.println("✅ Sample hotel created: Grand Hotel");

        // Create sample rooms
        Room room1 = new Room();
        room1.setId(UUID.randomUUID());
        room1.setHotel(hotel);
        room1.setRoomType("Deluxe");
        room1.setPrice(new BigDecimal("150.00"));
        room1.setIsAvailable(true);
        roomRepository.save(room1);

        Room room2 = new Room();
        room2.setId(UUID.randomUUID());
        room2.setHotel(hotel);
        room2.setRoomType("Standard");
        room2.setPrice(new BigDecimal("80.00"));
        room2.setIsAvailable(true);
        roomRepository.save(room2);
        System.out.println("✅ 2 sample rooms created");
        System.out.println("=== Data Initialization Complete ===");
    }
}

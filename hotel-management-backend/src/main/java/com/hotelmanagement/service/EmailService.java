package com.hotelmanagement.service;

import com.hotelmanagement.entity.Booking;
import com.hotelmanagement.entity.Room;
import com.hotelmanagement.entity.User;
import com.hotelmanagement.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Hashtable;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import javax.naming.NamingException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final BookingRepository bookingRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender, BookingRepository bookingRepository) {
        this.mailSender = mailSender;
        this.bookingRepository = bookingRepository;
    }

    @Async
    public void sendBookingConfirmationEmail(User user, Booking booking, BigDecimal amount) {
        try {
            if (!isValidEmail(user.getEmail())) {
                System.err.println("Invalid or unreachable email: " + user.getEmail() + " - skipping send");
                return;
            }
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Booking Confirmation - Hotel Management System");

            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Your booking has been confirmed!\n\n" +
                            "Booking Details:\n" +
                            "- Hotel: %s\n" +
                            "- Room Type: %s\n" +
                            "- Room Price per Night: $%s\n" +
                            "- Check-in Date: %s\n" +
                            "- Check-out Date: %s\n" +
                            "- Total Amount: $%s\n" +
                            "- Booking Status: %s\n\n" +
                            "Thank you for choosing our hotel!\n\n" +
                            "Best regards,\n" +
                            "Hotel Management Team",
                    user.getName(),
                    booking.getRoom().getHotel().getName(),
                    booking.getRoom().getRoomType(),
                    booking.getRoom().getPrice(),
                    booking.getCheckIn(),
                    booking.getCheckOut(),
                    amount,
                    booking.getStatus().name());

            message.setText(emailBody);
            mailSender.send(message);
            System.out.println("Booking confirmation email sent to " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void notifyUsersRoomUnavailable(Room room) {
        try {
            var bookings = bookingRepository.findByRoomId(room.getId());
            for (Booking booking : bookings) {
                User user = booking.getUser();
                if (!isValidEmail(user.getEmail())) {
                    System.err.println("Skipping notification, invalid email: " + user.getEmail());
                    continue;
                }
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(user.getEmail());
                message.setSubject("Important: Your booked room is unavailable");
                String body = String.format(
                        "Dear %s,\n\n" +
                                "We are sorry to inform you that the room you booked is no longer available.\n\n" +
                                "Booking details:\n" +
                                "- Hotel: %s\n" +
                                "- Room Type: %s\n" +
                                "- Check-in: %s\n" +
                                "- Check-out: %s\n\n" +
                                "Our staff will contact you shortly to assist with alternatives or refunds.\n\n" +
                                "Sincerely,\nHotel Management Team",
                        user.getName(),
                        room.getHotel().getName(),
                        room.getRoomType(),
                        booking.getCheckIn(),
                        booking.getCheckOut());
                message.setText(body);
                mailSender.send(message);
                System.out.println("Unavailable notification sent to " + user.getEmail());
            }
        } catch (Exception e) {
            System.err.println("Failed to notify users about unavailable room: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
            return false;
        String domain = email.substring(email.indexOf('@') + 1);
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            DirContext dirContext = new InitialDirContext(env);
            Attributes attrs = dirContext.getAttributes(domain, new String[] { "MX" });
            return attrs != null && attrs.get("MX") != null;
        } catch (NamingException e) {
            return false;
        }
    }
}

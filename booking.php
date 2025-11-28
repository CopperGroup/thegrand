<?php
/**
 * Ticket Booking Inquiry Handler
 * Processes ticket booking requests and calculates pricing
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$show = isset($_POST['show']) ? trim(htmlspecialchars($_POST['show'])) : '';
$date = isset($_POST['date']) ? trim(htmlspecialchars($_POST['date'])) : '';
$section = isset($_POST['section']) ? trim(htmlspecialchars($_POST['section'])) : '';
$tickets = isset($_POST['tickets']) ? intval($_POST['tickets']) : 0;

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($show)) {
    $errors[] = 'Please select a show';
}

if (empty($date)) {
    $errors[] = 'Please select a date';
}

if (empty($section)) {
    $errors[] = 'Please select a seating section';
}

if ($tickets < 1 || $tickets > 10) {
    $errors[] = 'Number of tickets must be between 1 and 10';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Calculate pricing based on section
$pricing = [
    'orchestra' => ['min' => 85, 'max' => 120],
    'mezzanine' => ['min' => 65, 'max' => 95],
    'balcony' => ['min' => 45, 'max' => 75]
];

$section_lower = strtolower($section);
$price_per_ticket = isset($pricing[$section_lower]) 
    ? $pricing[$section_lower]['max'] 
    : $pricing['balcony']['max'];

$total_price = $price_per_ticket * $tickets;

// Format booking details
$booking_details = [
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'show' => $show,
    'date' => $date,
    'section' => $section,
    'tickets' => $tickets,
    'price_per_ticket' => $price_per_ticket,
    'total_price' => $total_price,
    'timestamp' => date('Y-m-d H:i:s')
];

// Save booking inquiry
$booking_entry = date('Y-m-d H:i:s') . " | $name | $email | $show | $date | $section | $tickets tickets | $" . number_format($total_price, 2) . "\n";
file_put_contents('booking_inquiries.txt', $booking_entry, FILE_APPEND);

// Send confirmation email
$to = $email;
$subject = "Ticket Booking Inquiry - $show";
$email_body = "Dear $name,\n\n";
$email_body .= "Thank you for your ticket booking inquiry!\n\n";
$email_body .= "Booking Details:\n";
$email_body .= "Show: $show\n";
$email_body .= "Date: $date\n";
$email_body .= "Section: " . ucfirst($section) . "\n";
$email_body .= "Number of Tickets: $tickets\n";
$email_body .= "Price per Ticket: $" . number_format($price_per_ticket, 2) . "\n";
$email_body .= "Total Price: $" . number_format($total_price, 2) . "\n\n";
$email_body .= "Our box office team will contact you within 24 hours to confirm your booking.\n\n";
$email_body .= "Best regards,\nThe Grand Theatre Box Office";

$headers = "From: boxoffice@thegrandtheatre.com\r\n";
$headers .= "Reply-To: boxoffice@thegrandtheatre.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@mail($to, $subject, $email_body, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Your booking inquiry has been received! We will contact you shortly.',
    'booking' => $booking_details
]);
?>


<?php
/**
 * Contact Form Handler
 * Processes contact form submissions and sends email notifications
 */

// Set content type for JSON response
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize form data
$name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$subject = isset($_POST['subject']) ? trim(htmlspecialchars($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please provide a valid email address';
}

if (empty($subject)) {
    $errors[] = 'Please select a subject';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters long';
}

// If there are validation errors, return them
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Prepare email
$to = 'info@thegrandtheatre.com';
$email_subject = 'Contact Form: ' . $subject;
$email_body = "New contact form submission from The Grand Theatre website\n\n";
$email_body .= "Name: $name\n";
$email_body .= "Email: $email\n";
$email_body .= "Phone: " . ($phone ? $phone : 'Not provided') . "\n";
$email_body .= "Subject: $subject\n\n";
$email_body .= "Message:\n$message\n";

$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Save to file (for demonstration purposes - in production, use database)
// Replace newlines in message with spaces for single-line log entry
$message_log = str_replace(["\r\n", "\r", "\n"], " ", $message);
$log_entry = date('Y-m-d H:i:s') . " | $name | $email | $subject | $message_log\n";
file_put_contents('contact_submissions.txt', $log_entry, FILE_APPEND);

// Attempt to send email
$mail_sent = @mail($to, $email_subject, $email_body, $headers);

if ($mail_sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We will get back to you within 24 hours.'
    ]);
} else {
    // Even if email fails, log the submission
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been received. We will contact you soon.'
    ]);
}
?>


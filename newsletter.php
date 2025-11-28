<?php
/**
 * Newsletter Subscription Handler
 * Manages newsletter subscriptions with email validation and storage
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get and sanitize email
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';

// Validate email
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please provide a valid email address']);
    exit;
}

// Check if email already exists
$subscribers_file = 'newsletter_subscribers.txt';
$subscribers = [];

if (file_exists($subscribers_file)) {
    $existing_emails = file($subscribers_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $subscribers = array_map('trim', $existing_emails);
}

// Check for duplicate
if (in_array(strtolower($email), array_map('strtolower', $subscribers))) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'This email is already subscribed to our newsletter']);
    exit;
}

// Add new subscriber
$subscribers[] = strtolower($email);
file_put_contents($subscribers_file, implode("\n", $subscribers) . "\n", LOCK_EX);

// Log subscription
$log_entry = date('Y-m-d H:i:s') . " | Subscribed: $email\n";
file_put_contents('newsletter_log.txt', $log_entry, FILE_APPEND);

// Send confirmation email (optional)
$to = $email;
$subject = 'Welcome to The Grand Theatre Newsletter!';
$message = "Thank you for subscribing to The Grand Theatre newsletter!\n\n";
$message .= "You will receive updates about our upcoming shows, special events, and exclusive offers.\n\n";
$message .= "Best regards,\nThe Grand Theatre Team";
$headers = "From: newsletter@thegrandtheatre.com\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

@mail($to, $subject, $message, $headers);

echo json_encode([
    'success' => true,
    'message' => 'Thank you for subscribing! Check your email for confirmation.'
]);
?>


# Setup Guide - The Grand Theatre Website

## Quick Start

### Option 1: PHP Built-in Server (Easiest - Recommended for Testing)

1. **Open Terminal/Command Prompt**
   - Navigate to the project directory:
     ```bash
     cd "d:\studies\internet tecnology\theatr"
     ```

2. **Start PHP Server**
   ```bash
   php -S localhost:8000
   ```
   
   If PHP is not in your PATH, use full path:
   ```bash
   "C:\xampp\php\php.exe" -S localhost:8000
   ```
   (Adjust path based on your PHP installation)

3. **Open Browser**
   - Visit: http://localhost:8000/index.html
   - Or: http://localhost:8000/contact.html
   - Or: http://localhost:8000/booking.html

### Option 2: XAMPP (Full Web Server)

1. **Install XAMPP** (if not already installed)
   - Download from: https://www.apachefriends.org/

2. **Copy Project**
   - Copy the `theatr` folder to: `C:\xampp\htdocs\theatr`

3. **Start XAMPP**
   - Open XAMPP Control Panel
   - Start Apache server

4. **Access Website**
   - Visit: http://localhost/theatr/index.html

### Option 3: WAMP (Windows)

1. **Install WAMP** (if not already installed)
   - Download from: https://www.wampserver.com/

2. **Copy Project**
   - Copy the `theatr` folder to: `C:\wamp64\www\theatr`

3. **Start WAMP**
   - Launch WAMP server
   - Wait for green icon

4. **Access Website**
   - Visit: http://localhost/theatr/index.html

## Testing the Features

### 1. Test Contact Form
- Go to: http://localhost:8000/contact.html
- Fill out the form
- Submit and check for success message
- Check `contact_submissions.txt` file (created automatically)

### 2. Test Newsletter Subscription
- Go to: http://localhost:8000/index.html
- Scroll to newsletter section
- Enter email and subscribe
- Check `newsletter_subscribers.txt` file

### 3. Test Booking Form
- Go to: http://localhost:8000/booking.html
- Fill out booking form
- Submit and check booking summary
- Check `booking_inquiries.txt` file

### 4. Test Interactive Features
- Test mobile menu (resize browser or use mobile view)
- Test smooth scrolling (click navigation links)
- Test scroll animations (scroll down page)
- Test FAQ accordion (click FAQ questions)
- Test back-to-top button (scroll down, button appears)

## File Permissions

Make sure PHP can write to the project directory for:
- `contact_submissions.txt`
- `newsletter_subscribers.txt`
- `newsletter_log.txt`
- `booking_inquiries.txt`

If you get permission errors, ensure the directory is writable.

## Troubleshooting

### PHP Not Found
- Install PHP: https://www.php.net/downloads.php
- Or use XAMPP/WAMP which includes PHP

### Forms Not Working
- Make sure you're accessing via `http://localhost` (not `file://`)
- Check browser console for JavaScript errors (F12)
- Verify PHP server is running

### Email Not Sending
- Email functionality requires server mail configuration
- For testing, check the `.txt` log files instead
- In production, configure SMTP settings

### JavaScript Errors
- Open browser Developer Tools (F12)
- Check Console tab for errors
- Ensure all JavaScript files are loading correctly

## Project Structure

```
theatr/
├── index.html          (Homepage with newsletter)
├── contact.html        (Contact form)
├── visit.html          (Visit information)
├── booking.html        (Ticket booking)
├── process_contact.php (Contact form handler)
├── newsletter.php      (Newsletter handler)
├── booking.php         (Booking handler)
├── js/
│   ├── form-validation.js
│   ├── dynamic-content.js
│   └── interactive.js
├── styles/
│   ├── styles.css
│   ├── contact.css
│   ├── visit.css
│   └── forms.css
└── images/
    └── placeholder.png
```

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Development Tips

1. **Keep Server Running**: Don't close the terminal while testing
2. **Check Console**: Use F12 Developer Tools to debug
3. **Clear Cache**: Use Ctrl+F5 to hard refresh if changes don't appear
4. **Test Forms**: Submit forms to verify PHP scripts work
5. **Check Log Files**: View `.txt` files to see form submissions

## Next Steps

1. ✅ Start the server
2. ✅ Test all forms
3. ✅ Verify JavaScript features
4. ✅ Take screenshots for Report II
5. ✅ Convert Report_II.md to .docx

---

**Ready to start!** Run `php -S localhost:8000` and open http://localhost:8000/index.html


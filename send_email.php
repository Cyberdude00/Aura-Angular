<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Permitir solicitudes desde Angular (CORS)
// Configuración de seguridad para producción: Solo permitir tu dominio y localhost
$allowedOrigins = ['https://www.aurascouting.com', 'http://localhost:4200'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once 'config.php';

// Cargar PHPMailer (Detecta si es Composer o Manual)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} elseif (file_exists(__DIR__ . '/PHPMailer/src/PHPMailer.php')) {
    require __DIR__ . '/PHPMailer/src/Exception.php';
    require __DIR__ . '/PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/PHPMailer/src/SMTP.php';
} else {
    http_response_code(500);
    echo json_encode(['error' => 'PHPMailer not found. Please install it via Composer or download it to a PHPMailer folder.']);
    exit;
}

// Crear directorios si no existen
if (!file_exists(UPLOAD_TEMP_DIR)) {
    mkdir(UPLOAD_TEMP_DIR, 0755, true);
}
if (!file_exists(dirname(EMAIL_ERROR_LOG_FILE))) {
    mkdir(dirname(EMAIL_ERROR_LOG_FILE), 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $height = $_POST['height'] ?? '';
    $cellphone = $_POST['cellphone'] ?? '';

    // Validación básica
    if (empty($name) || empty($email) || empty($height)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    // Manejo de archivo (Imagen)
    $attachmentPath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileSize = $_FILES['image']['size'];
        $fileType = $_FILES['image']['type'];

        if ($fileSize > MAX_UPLOAD_FILE_SIZE) {
            http_response_code(400);
            echo json_encode(['error' => 'File too large']);
            exit;
        }

        if (!in_array($fileType, ALLOWED_IMAGE_TYPES)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type']);
            exit;
        }

        // Mover archivo a temporal
        $attachmentPath = UPLOAD_TEMP_DIR . basename($fileName);
        move_uploaded_file($fileTmpPath, $attachmentPath);
    }

    $mail = new PHPMailer(true);

    try {
        // Configuración del Servidor SMTP
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER; // Descomentar para ver errores detallados
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USERNAME;
        $mail->Password   = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port       = SMTP_PORT;

        // Destinatarios
        $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
        $mail->addAddress(RECEIVER_EMAIL, RECEIVER_NAME);
        $mail->addReplyTo($email, $name); // Responder al usuario que llenó el formulario

        // Adjuntos (Imagen)
        if ($attachmentPath) {
            $mail->addAttachment($attachmentPath);
        }

        // Contenido del Correo
        $mail->isHTML(true);
        $mail->Subject = 'New Model Submission: ' . $name;
        $mail->Body    = "<h2>New Submission</h2><p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Height:</strong> $height</p><p><strong>Cell Phone:</strong> $cellphone</p>";
        $mail->AltBody = "Name: $name\nEmail: $email\nHeight: $height\nCell Phone: $cellphone";

        $mail->send();

        // Limpiar archivo temporal después de enviar
        if ($attachmentPath && file_exists($attachmentPath)) unlink($attachmentPath);

        echo json_encode(['success' => true, 'message' => 'Email processed successfully']);
    } catch (Exception $e) {
        if ($attachmentPath && file_exists($attachmentPath)) unlink($attachmentPath);
        error_log("Mailer Error: {$mail->ErrorInfo}", 3, EMAIL_ERROR_LOG_FILE);
        http_response_code(500);
        echo json_encode(['error' => 'Message could not be sent. Mailer Error: ' . $mail->ErrorInfo]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
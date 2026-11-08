<?php
/**
 * Nautilus Protein - ImgBB Secure Upload Proxy for Hostinger
 * Keeps API Key server-side on Hostinger Apache / Nginx PHP hosting.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests allowed']);
    exit;
}

$apiKey = getenv('IMGBB_API_KEY') ?: 'bfbd887ebc86001dfbbd00f361b65421';

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'No valid image file uploaded']);
    exit;
}

$tmpPath = $_FILES['image']['tmp_name'];
$fileName = $_FILES['image']['name'];
$mimeType = mime_content_type($tmpPath);

// Validation
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Unsupported image format: ' . $mimeType]);
    exit;
}

// Forward to ImgBB
$cfile = new CURLFile($tmpPath, $mimeType, $fileName);
$postData = [
    'key' => $apiKey,
    'image' => $cfile
];

$ch = curl_init('https://api.imgbb.com/1/upload');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Nautilus Hostinger Proxy)');

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'cURL error: ' . $curlError]);
    exit;
}

$result = json_decode($response, true);
if ($httpCode >= 200 && $httpCode < 300 && isset($result['data']['url'])) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'url' => $result['data']['url'],
        'displayUrl' => $result['data']['display_url'] ?? $result['data']['url'],
        'thumbUrl' => $result['data']['thumb']['url'] ?? null
    ]);
} else {
    http_response_code($httpCode ?: 400);
    echo json_encode([
        'success' => false,
        'error' => $result['error']['message'] ?? 'ImgBB upload rejected'
    ]);
}

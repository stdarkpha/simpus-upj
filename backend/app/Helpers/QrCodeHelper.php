<?php

namespace App\Helpers;

use SimpleSoftwareIO\QrCode\Facades\QrCode; // Use the Facade

class QrCodeHelper
{
    /**
     * Generates a QR code with an optional logo and text below, returning it as a base64 encoded string.
     *
     * @param string $token The string data to encode in the QR code.
     * @param string $text The text to display below the QR code.
     * @param string|null $logoPath Optional path to the logo image to merge.
     * @param float $logoMergeRatio The ratio of the logo size to the QR code size.
     * @param bool $logoIsAbsolute Whether the logo path is absolute.
     * @param string $fontPath Path to the TTF font file for the text.
     * @param int $qrSize Size of the QR code in pixels.
     * @param int $qrMargin Margin around the QR code.
     * @param int $fontSize Size of the text below the QR code.
     * @param array $textColorRGB Array [R, G, B] for the text color (default: black).
     * @param array $backgroundColorRGB Array [R, G, B] for the background color (default: white).
     * @return string Base64 encoded PNG image string.
     * @throws \Exception If font file is not found or unreadable.
     */
    public static function generateQR(
        string $token,
        string $text,
        ?string $logoPath = null,
        float $logoMergeRatio = 0.25,
        bool $logoIsAbsolute = true,
        string $fontPath = '', // Default to empty, will use public_path('font.ttf') if not set
        int $qrSize = 250,
        int $qrMargin = 1,
        int $fontSize = 12,
        array $textColorRGB = [0, 0, 0], // Black
        array $backgroundColorRGB = [255, 255, 255] // White
    ): string {
        // Ensure font path is provided and valid
        $actualFontPath = $fontPath ?: public_path('font.ttf'); // Default font path
        if (!file_exists($actualFontPath) || !is_readable($actualFontPath)) {
            // Fallback to a system font or handle error appropriately
            // For simplicity, we'll throw an exception here.
            // In a real app, you might log this and try a default system font if possible.
            throw new \Exception("Font file not found or not readable: " . $actualFontPath);
        }

        // Generate QR code
        $qrCodeGenerator = QrCode::format('png')->size($qrSize)->margin($qrMargin);


        $qrCodeGenerator->merge($logoPath ?: public_path('logo.png'), $logoMergeRatio, $logoIsAbsolute);


        $qrCodeBinary = $qrCodeGenerator->generate($token);

        // Create image resource from QR code binary string
        $qrCodeImage = imagecreatefromstring($qrCodeBinary);
        if ($qrCodeImage === false) {
            throw new \Exception("Failed to create image from QR code binary string.");
        }

        // --- Add text below QR code ---
        // Calculate text box size
        // Note: imagettfbbox can return different array structures based on GD version.
        // The typical order is [llx, lly, lrx, lry, urx, ury, ulx, uly]
        // We need width (lrx - llx) and height (lly - ury, or use font size as approximation for height)
        $textBox = imagettfbbox($fontSize, 0, $actualFontPath, $text);
        if ($textBox === false) {
            imagedestroy($qrCodeImage);
            throw new \Exception("Failed to calculate text bounding box. Check font path and text.");
        }

        // Calculate text width and height more reliably
        $textWidth = abs($textBox[2] - $textBox[0]); // abs for safety
        $textHeight = abs($textBox[5] - $textBox[3]); // abs for safety, approx height

        // Define padding below QR for text
        $textPaddingTop = 5; // Space between QR and text
        $textPaddingBottom = 5; // Space below text
        $totalTextSpaceHeight = $textHeight + $textPaddingTop + $textPaddingBottom;

        // Create a new image canvas with extra space for the text
        $finalImageWidth = imagesx($qrCodeImage);
        $finalImageHeight = imagesy($qrCodeImage) + $totalTextSpaceHeight;

        $finalImage = imagecreatetruecolor($finalImageWidth, $finalImageHeight);
        if ($finalImage === false) {
            imagedestroy($qrCodeImage);
            throw new \Exception("Failed to create final image canvas.");
        }

        // Allocate colors
        $bgColor = imagecolorallocate($finalImage, $backgroundColorRGB[0], $backgroundColorRGB[1], $backgroundColorRGB[2]);
        $txtColor = imagecolorallocate($finalImage, $textColorRGB[0], $textColorRGB[1], $textColorRGB[2]);

        // Fill background
        imagefill($finalImage, 0, 0, $bgColor);

        // Copy QR code onto the new canvas
        imagecopy($finalImage, $qrCodeImage, 0, 0, 0, 0, imagesx($qrCodeImage), imagesy($qrCodeImage));

        // Calculate text position (centered horizontally)
        $x = ($finalImageWidth - $textWidth) / 2;
        $y = imagesy($qrCodeImage) + $textPaddingTop + $textHeight - ($textHeight / 4); // Adjust Y to be baseline of text

        // Add text to the image
        imagettftext($finalImage, $fontSize, 0, (int)$x, (int)$y, $txtColor, $actualFontPath, $text);

        // Capture the image output into a buffer
        ob_start();
        imagepng($finalImage);
        $imageData = ob_get_contents();
        ob_end_clean();

        // Destroy image resources
        imagedestroy($qrCodeImage);
        imagedestroy($finalImage);

        // Return base64 encoded string
        return 'data:image/png;base64,' . base64_encode($imageData);
    }
}

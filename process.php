<?php

echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visa Check Result</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            padding: 40px 20px;
            margin: 0;
        }
        .result-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 30px;
        }
        .result {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            font-weight: 500;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .back-button {
            display: inline-block;
            margin-top: 20px;
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .back-button:hover {
            background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="result-container">
        <h1>Visa Check Result</h1>';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $country = isset($_POST['country']) ? $_POST['country'] : '';

    if (empty($country)) {
        echo '<div class="result error">Invalid country selection.</div>';
    } else {
        $message = '';
        switch ($country) {
            case 'USA':
                $message = 'Visa required for most applicants.';
                break;
            case 'Canada':
                $message = 'Visa required unless you have an eTA.';
                break;
            case 'India':
                $message = 'Visa required before travel.';
                break;
            case 'UK':
                $message = 'Visa depends on the duration of stay.';
                break;
            case 'Australia':
                $message = 'eVisa available for eligible travelers.';
                break;
            default:
                $message = 'Invalid country selection.';
        }

        if ($message === 'Invalid country selection.') {
            echo '<div class="result error">' . $message . '</div>';
        } else {
            echo '<div class="result success">' . $message . '</div>';
        }
    }
} else {
    echo '<div class="result error">Invalid request. Please use the form to check visa requirements.</div>';
}

echo '<a href="index.html" class="back-button">Back to Visa Checker</a>
    </div>
</body>
</html>';
?>

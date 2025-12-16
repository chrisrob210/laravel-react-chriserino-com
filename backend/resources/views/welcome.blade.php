@php
    $manifest = \App\Helpers\AssetHelper::getAssetManifest();
    $css = 'build/' . $manifest['entrypoints'][0];
    $js = 'build/' . $manifest['entrypoints'][1];
@endphp

<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- React App Assets -->
    <link rel="icon" href="{{ asset('favicon.opaque.ico') }}">
    <link rel="apple-touch-icon" href="{{ asset('favicon.opaque.ico') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <link href="{{ asset($css) }}" rel="stylesheet">
</head>

<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>

    <!-- React App Scripts -->
    {{-- <script src="{{ asset('static/js/main.5d443e31.js') }}"></script> --}}
    <script src="{{ asset($js) }}"></script>
</body>

</html>

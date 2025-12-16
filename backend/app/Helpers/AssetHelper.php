<?php

namespace App\Helpers;

class AssetHelper
{
    public static function getAssetManifest()
    {
        $manifestPath = public_path('build/asset-manifest.json');

        if (!file_exists($manifestPath)) {
            return null;
        }

        return json_decode(file_get_contents($manifestPath), true);
    }

    public static function asset($key)
    {
        $manifest = self::getAssetManifest();

        if ($manifest && isset($manifest['files'][$key])) {
            return asset($manifest['files'][$key]);
        }

        return asset($key);
    }
}

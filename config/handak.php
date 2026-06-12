<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Penandatangan Surat Rekomendasi Handak
    |--------------------------------------------------------------------------
    |
    | Data default penandatangan surat rekomendasi (a.n. Kapolda — Dirintelkam)
    | beserta daftar tembusan yang dicetak di kaki surat.
    |
    */

    'signatory' => [
        'position' => env('HANDAK_SIGNATORY_POSITION', 'DIRINTELKAM'),
        'name' => env('HANDAK_SIGNATORY_NAME', ''),
        'rank' => env('HANDAK_SIGNATORY_RANK', 'KOMISARIS BESAR POLISI'),
        'nrp' => env('HANDAK_SIGNATORY_NRP', ''),
    ],

    'letterhead' => [
        'line1' => 'KEPOLISIAN NEGARA REPUBLIK INDONESIA',
        'line2' => 'DAERAH JAWA TIMUR',
        'line3' => 'Jalan Achmad Yani 116, Surabaya 60231',
        'city' => 'Surabaya',
    ],

    'tembusan' => [
        'Kapolri.',
        'Kapolda Jatim.',
    ],

];

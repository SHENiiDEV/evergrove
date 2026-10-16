<?php

namespace App\Support;

class WorldCountries
{
    /**
     * Countries explicitly restricted from registration.
     *
     * @var list<string>
     */
    public const EXCLUDED_COUNTRIES = [
        'Afghanistan',
        'Belarus',
        'Central African Republic',
        'Cuba',
        'Dem. Rep. of the Congo',
        'Democratic Republic of the Congo',
        'Haiti',
        'Iran',
        'Iraq',
        'Mali',
        'Myanmar',
        'Myanmar (Burma)',
        'North Korea',
        'Russia',
        'Russian Federation',
        'Somalia',
        'South Sudan',
        'Sudan',
        'Syria',
        'Venezuela',
        'Yemen',
        'Zimbabwe',
    ];

    /**
     * Complete standard list of world countries.
     *
     * @var list<string>
     */
    protected const ALL_COUNTRIES = [
        'Albania',
        'Algeria',
        'Andorra',
        'Angola',
        'Antigua and Barbuda',
        'Argentina',
        'Armenia',
        'Australia',
        'Austria',
        'Azerbaijan',
        'Bahamas',
        'Bahrain',
        'Bangladesh',
        'Barbados',
        'Belgium',
        'Belize',
        'Benin',
        'Bhutan',
        'Bolivia',
        'Bosnia and Herzegovina',
        'Botswana',
        'Brazil',
        'Brunei',
        'Bulgaria',
        'Burkina Faso',
        'Burundi',
        'Cabo Verde',
        'Cambodia',
        'Cameroon',
        'Canada',
        'Chad',
        'Chile',
        'China',
        'Colombia',
        'Comoros',
        'Congo (Republic of)',
        'Costa Rica',
        'Côte d\'Ivoire',
        'Croatia',
        'Cyprus',
        'Czech Republic',
        'Denmark',
        'Djibouti',
        'Dominica',
        'Dominican Republic',
        'Ecuador',
        'Egypt',
        'El Salvador',
        'Equatorial Guinea',
        'Eritrea',
        'Estonia',
        'Eswatini',
        'Ethiopia',
        'Fiji',
        'Finland',
        'France',
        'Gabon',
        'Gambia',
        'Georgia',
        'Germany',
        'Ghana',
        'Greece',
        'Grenada',
        'Guatemala',
        'Guinea',
        'Guinea-Bissau',
        'Guyana',
        'Honduras',
        'Hungary',
        'Iceland',
        'India',
        'Indonesia',
        'Ireland',
        'Israel',
        'Italy',
        'Jamaica',
        'Japan',
        'Jordan',
        'Kazakhstan',
        'Kenya',
        'Kiribati',
        'Kuwait',
        'Kyrgyzstan',
        'Laos',
        'Latvia',
        'Lebanon',
        'Lesotho',
        'Liberia',
        'Libya',
        'Liechtenstein',
        'Lithuania',
        'Luxembourg',
        'Madagascar',
        'Malawi',
        'Malaysia',
        'Maldives',
        'Malta',
        'Marshall Islands',
        'Mauritania',
        'Mauritius',
        'Mexico',
        'Micronesia',
        'Moldova',
        'Monaco',
        'Mongolia',
        'Montenegro',
        'Morocco',
        'Mozambique',
        'Namibia',
        'Nauru',
        'Nepal',
        'Netherlands',
        'New Zealand',
        'Nicaragua',
        'Niger',
        'Nigeria',
        'North Macedonia',
        'Norway',
        'Oman',
        'Pakistan',
        'Palau',
        'Panama',
        'Papua New Guinea',
        'Paraguay',
        'Peru',
        'Philippines',
        'Poland',
        'Portugal',
        'Qatar',
        'Romania',
        'Rwanda',
        'Saint Kitts and Nevis',
        'Saint Lucia',
        'Saint Vincent and the Grenadines',
        'Samoa',
        'San Marino',
        'Sao Tome and Principe',
        'Saudi Arabia',
        'Senegal',
        'Serbia',
        'Seychelles',
        'Sierra Leone',
        'Singapore',
        'Slovakia',
        'Slovenia',
        'Solomon Islands',
        'South Africa',
        'South Korea',
        'Spain',
        'Sri Lanka',
        'Suriname',
        'Sweden',
        'Switzerland',
        'Taiwan',
        'Tajikistan',
        'Tanzania',
        'Thailand',
        'Timor-Leste',
        'Togo',
        'Tonga',
        'Trinidad and Tobago',
        'Tunisia',
        'Turkey',
        'Turkmenistan',
        'Tuvalu',
        'Uganda',
        'Ukraine',
        'United Arab Emirates',
        'United Kingdom',
        'United States',
        'Uruguay',
        'Uzbekistan',
        'Vanuatu',
        'Vatican City',
        'Vietnam',
        'Zambia',
    ];

    /**
     * Get list of allowed countries for registration.
     *
     * @return list<string>
     */
    public static function allowed(): array
    {
        $excludedMap = array_change_key_case(array_flip(self::EXCLUDED_COUNTRIES), CASE_LOWER);

        $allowed = array_filter(self::ALL_COUNTRIES, function (string $country) use ($excludedMap) {
            return ! isset($excludedMap[strtolower(trim($country))]);
        });

        sort($allowed);

        return array_values($allowed);
    }

    /**
     * Check if a country is valid and permitted.
     */
    public static function isPermitted(string $country): bool
    {
        $countryClean = strtolower(trim($country));

        foreach (self::EXCLUDED_COUNTRIES as $excluded) {
            if (strtolower($excluded) === $countryClean) {
                return false;
            }
        }

        return in_array($country, self::allowed(), true);
    }
}

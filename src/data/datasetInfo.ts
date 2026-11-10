import type { AmenityOption } from '../types';

export const CITIES = [
  { value: 'NYC', label: 'New York City (NYC)' },
  { value: 'LA', label: 'Los Angeles (LA)' },
  { value: 'SF', label: 'San Francisco (SF)' },
  { value: 'Chicago', label: 'Chicago' },
  { value: 'Boston', label: 'Boston' },
  { value: 'DC', label: 'Washington D.C. (DC)' },
];

export const NEIGHBOURHOODS_BY_CITY: Record<string, string[]> = {
  NYC: [
    "Hell's Kitchen",
    'Williamsburg',
    'Harlem',
    'Bedford-Stuyvesant',
    'East Village',
    'Upper East Side',
    'Upper West Side',
    'Astoria',
    'Bushwick',
    'Greenpoint',
    'Midtown',
    'Chelsea',
    'Lower East Side',
    'Crown Heights',
    'Unknown'
  ],
  LA: [
    'Hollywood',
    'Venice',
    'Downtown',
    'Santa Monica',
    'Silver Lake',
    'West Hollywood',
    'Koreatown',
    'Echo Park',
    'Los Feliz',
    'Unknown'
  ],
  SF: [
    'Mission',
    'SoMa',
    'Castro',
    'Nob Hill',
    'Marina',
    'Pacific Heights',
    'Financial District',
    'Haight-Ashbury',
    'North Beach',
    'Unknown'
  ],
  Chicago: [
    'West Town',
    'Lakeview',
    'Lincoln Park',
    'Logan Square',
    'Near North Side',
    'The Loop',
    'Wicker Park',
    'Hyde Park',
    'Unknown'
  ],
  Boston: [
    'Back Bay',
    'South End',
    'Beacon Hill',
    'Dorchester',
    'Cambridge',
    'Fenway',
    'North End',
    'Unknown'
  ],
  DC: [
    'Columbia Heights',
    'Capitol Hill',
    'Dupont Circle',
    'Adams Morgan',
    'Shaw',
    'Georgetown',
    'Foggy Bottom',
    'Unknown'
  ]
};

export const PROPERTY_TYPES = [
  'Apartment',
  'House',
  'Condominium',
  'Loft',
  'Townhouse',
  'Guest suite',
  'Guesthouse',
  'Bed & Breakfast',
  'Other'
];

export const ROOM_TYPES = [
  { value: 'Entire home/apt', label: 'Entire home/apt' },
  { value: 'Private room', label: 'Private room' },
  { value: 'Shared room', label: 'Shared room' }
];

export const BED_TYPES = [
  'Real Bed',
  'Futon',
  'Pull-out Sofa',
  'Airbed',
  'Couch'
];

export const CANCELLATION_POLICIES = [
  { value: 'flexible', label: 'Flexible (Full refund 1 day prior to arrival)' },
  { value: 'moderate', label: 'Moderate (Full refund 5 days prior to arrival)' },
  { value: 'strict', label: 'Strict (50% refund up to 7 days prior to arrival)' },
  { value: 'super_strict_30', label: 'Super Strict 30' },
  { value: 'super_strict_60', label: 'Super Strict 60' }
];

export const AMENITIES_LIST: AmenityOption[] = [
  { id: 'wifi', label: 'Wi-Fi', featureKey: 'has_wireless_internet', iconName: 'Wifi' },
  { id: 'kitchen', label: 'Kitchen', featureKey: 'has_kitchen', iconName: 'Utensils' },
  { id: 'ac', label: 'Air Conditioning', featureKey: 'has_air_conditioning', iconName: 'Wind' },
  { id: 'heating', label: 'Heating', featureKey: 'has_heating', iconName: 'Flame' },
  { id: 'tv', label: 'TV', featureKey: 'has_tv', iconName: 'Tv' },
  { id: 'washer', label: 'Washer', featureKey: 'has_washer', iconName: 'Shirt' },
  { id: 'dryer', label: 'Dryer', featureKey: 'has_dryer', iconName: 'Sun' },
  { id: 'parking', label: 'Parking', featureKey: 'has_parking', iconName: 'Car' },
  { id: 'pool', label: 'Pool', featureKey: 'has_pool', iconName: 'Waves' },
  { id: 'gym', label: 'Gym', featureKey: 'has_gym', iconName: 'Dumbbell' },
  { id: 'hot_tub', label: 'Hot Tub', featureKey: 'has_hot_tub', iconName: 'Bath' },
  { id: 'doorman', label: 'Doorman', featureKey: 'has_doorman', iconName: 'UserCheck' },
  { id: 'breakfast', label: 'Breakfast', featureKey: 'has_breakfast', iconName: 'Coffee' },
];

export const DEFAULT_FORM_VALUES = {
  city: 'NYC',
  neighbourhood: "Hell's Kitchen",
  property_type: 'Apartment',
  room_type: 'Entire home/apt',
  bed_type: 'Real Bed',
  accommodates: 2,
  bedrooms: 1,
  bathrooms: 1,
  beds: 1,
  cleaning_fee: true,
  instant_bookable: false,
  cancellation_policy: 'moderate',
  amenities: ['wifi', 'kitchen', 'ac', 'heating']
};

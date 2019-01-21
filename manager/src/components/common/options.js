/**
 * List name of all the modules which wiill be accessed on the basis of the
 * ROLE
 */
/**OPTIONS FOR MULTISELECT */

/**USERS/ADMIN ROLE OPTIONS */
export const OPTIONS = [
    { title: "Change Password", _id: "CHANGE_PASSWORD" },
    { title: "Manage Role", _id: "MANAGE_ROLE" },
    { title: "Manage Users", _id: "MANAGE_USER" },
    { title: "Profile", _id: "PROFILE" },
    { title: "Pages", _id: "PAGES" },
    { title: "Email Management", _id: "EMAIL_MANAGE" },
    { title: "Taxes", _id: "TAXES" },
    { title: "Customer Role Management", _id: "CUSTOMER_ROLE" },
    { title: "Property Management", _id: "PROPERTY_MANAGEMENT" },
    { title: "Market Management", _id: "MARKET_MANAGEMENT" },
    { title:"Short Form Lead", _id:"SHORT_FORM_LEAD"}

];

export const RoutesValue = {
    CHANGE_PASSWORD: "CHANGE_PASSWORD",
    MANAGE_ROLE: "MANAGE_ROLE",
    MANAGE_USER: "MANAGE_USER",
    PROFILE: "PROFILE",
    MANAGE_PAGES: "PAGES",
    MANAGE_BLOGS: "BLOGS",
    CUSTOMER_ROLE: "CUSTOMER_ROLE",
    EMAIL_MANAGE: "EMAIL_MANAGE",
    TAXES: "TAXES",
    GET_AN_OFFER: "GET_AN_OFFER",
    CONTACT_US: "CONTACT_US",
    MARKET_MANAGEMENT: "MARKET_MANAGEMENT",
    PROPERTY_MANAGEMENT: "PROPERTY_MANAGEMENT",
    SHORT_FORM_LEAD:"SHORT_FORM_LEAD"
   
};

/**STATUS related OPTIONS */
export const STATUS = [
    { title: "Active", value: true },
    { title: "In-Active", value: "false" }
];

/* Bad */
export const BED=[
    { title: "0", value: "0" },
    { title: "1", value: "1" },
    { title: "2", value: "2" },
    { title: "3", value: "3 "},
    { title: "4", value: "4" },
    { title: "5", value: "5" },
    { title: "6", value: "6" },
    { title: "7", value: "7" },
    { title: "8", value: "8" },
    { title: "9", value: "9" },
    { title: "10", value: "10" }
]
/* Bath */
export const BATH=[
    { title: "1", value: "1" },
    { title: "1.5", value: "1.5" },
    { title: "2", value: "2" },
    { title: "2.5", value: "2.5" },
    { title: "3", value: "3"},
    { title: "3.5", value: "3.5"},
    { title: "4", value: "4" },
    { title: "4.5", value: "4.5" },
    { title: "5", value: "5" },
    { title: "5.5", value: "5.5" },
    { title: "6", value: "6" },
    { title: "6.5", value: "6.5" },
    { title: "7", value: "7" },
    { title: "7.5", value: "7.5" },
    { title: "8", value: "8" },
    { title: "8.5", value: "8.5" },
    { title: "9", value: "9" },
    { title: "9.5", value: "9.5" },
    { title: "10", value: "10" }
]
/* basement */
export const Basement=[
    { title: "Fully Finished", value: "fully_finished" },
    { title: "Partially Finished", value: "partially_finished" },
    { title: "Unfinished", value: "unfinished" },
    { title: "None", value: "none" },
]
/* Appliances */
export const Appliances=[
    { title: "Refrigerator", _id: "refrigerator" },
    { title: "Cooktop", _id: "cooktop" },
    { title: "Range", _id: "range" },
    { title: "Dishwasher", _id: "dishwasher" },
    { title: "Built-In Microwave", _id: "builtInMicrowave" },
    { title: "Chimney", _id: "chimney" },
    { title: "Hood Vent", _id: "hood_vent" },
    { title: "Single Wall Oven", _id: "singleWallOven" },
    { title: "Double Wall", _id: "doubleWall" },
    { title: "Oven", _id: "oven" },
    
]
/* Other Features */
export const otherFeatures=[
    { title: "Stainless Steel Appliances", _id: "stainlessSteelAppliances" },
    { title: "Kitchen Island", _id: "kitchenIsland" },
    { title: "Pendant Lights", _id: "pendantLights" },
    { title: "Tile Backsplash", _id: "tileBacksplash" },
    { title: "Eat In Kitchen", _id: "eatInKitchen" },
    { title: "Open Floor Plan", _id: "openFloorPlan" },
    { title: "Recessed Lighting", _id: "recessedLighting" },
    { title: "Granite Counters", _id: "graniteCounters" },
    { title: "Quartz Counters", _id: "quartzCounters" },
    { title: "Vaulted Ceiling", _id: "vaultedCeiling" },
    { title: "Ceiling Fan(s)", _id: "ceilingFan" },
    
]
/* Exterior */
export const Exterior=[
    { title: "Brick", _id: 'brick' },
    { title:  'Vinyl', _id:  'vinyl' },
    { title:'Aluminum'  , _id:'aluminum'  },
    { title:'Metal'  , _id: 'metal' },
    { title:'Wood'  , _id:'wood'  },
    { title:'Stone'  , _id:'stone'  }
]
/* Back Yard */
export const BackYard=[
    { title: "Fully Fenced", value: 'fullyFenced' },
    { title:  'Partially Fenced', value:  'partiallyFenced' },
    { title:'Rear Fence'  , value:'rearFence'  },
    { title:'Privacy Fence'  , value: 'privacyFence' },
    { title:'No Fence'  , value:'noFence'  }
]

/* DECK */
export const DECK=[
    { title: "Single", value: 'single' },
    { title:  'Double', value:  'double' },
    { title:'Tiered'  , value:'tiered'  },
    { title:'None'  , value: 'none' },
]
/* Porch */
export const PORCH=[
    { title: "Front", value: 'front' },
    { title:  'Rear', value:  'rear' },
    { title:'Side'  , value:'side'  },
    { title:'Wrap Around'  , value: 'wrapAround' },
    { title:'None'  , value:'none'  },
]
/* VIEW */
export const VIEW=[
    { title: "Backs to Woods", value: 'backstoWoods' },
    { title:  'Water/Lake', value:  'waterLake' },
    { title:'Water/Beach'  , value:'waterBeach'  },
    { title:'Golf Course'  , value: 'golfCourse' },
    { title:'Nothing Special'  , value:'nothingSpecial'  },
]
/* HOAFeePeriod */
export const HOAFeePeriod=[
    { title: "Quarterly", value: 'quarterly' },
    { title:  'Annually', value:  'annually' },
    { title:'None'  , value:'none'  },
   
]
/* COAFeePeriod */
export const COAFeePeriod=[
    { title: "Quarterly", value: 'quarterly' },
    { title:  'Annually', value:  'annually' },
    { title:'None'  , value:'none'  },
]
/* State */
export const stateList = [
{ title: "AL", value: 'AL' },
{ title:  'AK', value:  'AK' },
{ title:'AZ'  , value:'AZ'  },
{ title:'AR'  , value: 'AR' },
{ title:'CA'  , value:'CA'  },
{ title:'CO'  , value:'CO'  },
{ title:'CT'  , value:'CT'  },
{ title:'DE'  , value:'DE'  },
{ title:'FL'  , value: 'FL' },
{ title:'GA'  , value: 'GA' },
{ title:'HI'  , value:'HI'  },
{ title:  'ID' , value:  'ID' },
{ title:'IL'  , value:'IL'  },
{ title:'IN'  , value:'IN'  },
{ title:'IS'  , value:'IS'  },
{ title:  'KA' , value:  'KA' },
{ title:'KY'  , value: 'KY' },
{ title:'LA'  , value:'LA'  },
{ title:'ME'  , value: 'ME' },
{ title: 'MD' , value: 'MD' },
{ title: 'MA' , value: 'MA' },
{ title: 'MI'  , value: 'MI'  },
{ title: 'MN' , value: 'MN' },
{ title: 'MS' , value:'MS'  },
{ title:'MO'  , value: 'MO' },
{ title: 'MT'  , value:  'MT' },
{ title:'NE'  , value:'NE'  },
{ title: 'NV' , value:'NV'  },
{ title:'NH'  , value: 'NH' },
{ title:'NJ'  , value: 'NJ' },
{ title: 'NM'  , value:  'NM' },
{ title:'NY'  , value:'NY'  },
{ title:'NC'  , value: 'NC' },
{ title: 'ND' , value:'ND'  },
{ title:'OH'  , value:'OH'  },
{ title:'OK'  , value:'OK'  },
{ title:'OR'  , value:'OR'  },
{ title:'PA'  , value:'PA'  },
{ title:'RI'  , value:'RI'  },
{ title:'SC'  , value:'SC'  },
{ title: 'SD'  , value: 'SD'  },
{ title: 'TN'  , value: 'TN'  },
{ title: 'TX'  , value: 'TX'  },
{ title:'UT'  , value:'UT'  },
{ title:'VT'  , value:'VT'  },
{ title:'VA'  , value:'VA'  },
{ title:'WA'  , value:'WA'  },
{ title:'WV'  , value:'WV'  },
{ title:'WI'  , value:'WI'  },
{ title:'WY'  , value:'WY'  },
{ title:'DC'  , value:'DC'  },
];

export const ACTIVESTATUS = [{ title: "Active" }];
export const INACTIVESTATUS = [{ title: "In-Active", value: "false" }];

export const POSITIONS = [
    { title: "Header", value: "header" },
    { title: "Footer", value: "footer" },
    { title: "Both", value: "both" }
];
export const AdPOSITION = [
    { title: "Header", value: "header" },
    { title: "Footer", value: "footer" },
    { title: "In Page", value: "inpage" },
    { title: "Sidebar", value: "sidebar" }
];
export const AdTYPE = [
    { title: "Internal", value: "internal" },
    { title: "External", value: "external" }
];

/**CUSTOMER ROLE OPTIONS */
export const Customer_Role_OPTIONS = [
    { title: "Sign TRF", _id: "SIGN_TRF" },
    { title: "Payment", _id: "PAYMENT" },
    { title: "Share", _id: "SHARE" }
];

/**
 * Review rating star options
 */
export const RatingStars = [
    { title: "1 Star", value: 1 },
    { title: "2 Star", value: 2 },
    { title: "3 Star", value: 3 },
    { title: "4 Star", value: 4 },
    { title: "5 Star", value: 5 }
];

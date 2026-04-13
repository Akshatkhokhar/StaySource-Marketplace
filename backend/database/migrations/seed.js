const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../../src/models/Category.model');
const Vendor = require('../../src/models/Vendor.model');
const User = require('../../src/models/User.model');

// Load env vars
dotenv.config();

// Connect to testing/dev database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.error(err));

const categoriesData = [
  'Accounting Services', 'Acoustics', 'ADA Compliance', 'Advertising/Marketing',
  'AI Automation', 'Air Purification/Water Filtration', 'Bed + Bath Accessories/Supplies',
  'Bedspreads/Draperies/Pillows', 'Cable/Satellite TV Services', 'Carpet Floor Care',
  'Carpet/Carpet Cushion', 'Casegoods', 'Chemicals', 'Computers Hardware',
  'Computers Software', 'Construction', 'Consulting', 'Credit Card Processing',
  'Doors/Windows', 'Electronics / Manufacturing', 'Energy Management',
  'Engineering / Design', 'Equipment/Appliance Provider', 'Financial Services',
  'Financing', 'Fitness Equipment', 'Floor Coverings', 'Food/Beverage',
  'Franchising', 'Furniture/Fixtures', 'Heating/Air Conditioning',
  'Housekeeping/Janitorial Services', 'In-Room Amenities', 'Insurance',
  'Interior Designers', 'Internet Services', 'IT / Business Services',
  'Lamps/Lampshade Lighting', 'Laundry Equipment', 'Linens/Textiles',
  'Maintenance Supplies', 'Management Companies', 'Mattresses/Box Springs',
  'Online Reservation Systems', 'Pest Control Products/Services', 'Plumbing Supplies',
  'POS Systems - Point of Sale', 'Printing/Design/Production', 'Property Management Software',
  'Renovation/Remodeling', 'Revenue Management', 'Security Control/Safety Products',
  'Signs', 'Swimming Pool Supplies/Equipment', 'Tax Consultants',
  'Telecommunication Service Equipment', 'Televisions/Electronics', 'Transportation/Shipping',
  'Vending Machines/Supplies', 'Wall Coverings', 'Water Heaters'
];

// Expanded vendor data mimicking real AAHOA vendor directory entries
const vendorsRawData = [
  {
    company_name: 'HD Supply Facilities Maintenance',
    description: 'HD Supply is a leading distributor of maintenance, repair and operations products and services for the hospitality industry.',
    address_line1: '3400 Cumberland Blvd SE', city: 'Atlanta', state: 'Georgia', zip_code: '30339',
    phone: '(770) 852-9000', email: 'hospitality@hdsupply.com', website: 'https://www.hdsupply.com',
    contact_first_name: 'Mark', contact_last_name: 'Palmer',
    categoryNames: ['Maintenance Supplies', 'Housekeeping/Janitorial Services', 'Plumbing Supplies'],
    is_featured: true
  },
  {
    company_name: 'Sysco Guest Supply',
    description: 'Sysco Guest Supply is the leading provider of personal care amenities, room accessories and textiles to the lodging industry worldwide.',
    address_line1: '1 Guest Supply Dr', city: 'Mount Olive', state: 'New Jersey', zip_code: '07828',
    phone: '(800) 524-2984', email: 'info@guestsupply.com', website: 'https://www.guestsupply.com',
    contact_first_name: 'Lisa', contact_last_name: 'Chen',
    categoryNames: ['In-Room Amenities', 'Bed + Bath Accessories/Supplies', 'Linens/Textiles'],
    is_featured: true
  },
  {
    company_name: 'Ecolab Inc.',
    description: 'Ecolab offers comprehensive cleaning, sanitizing and food safety programs for hospitality operations.',
    address_line1: '1 Ecolab Place', city: 'Saint Paul', state: 'Minnesota', zip_code: '55102',
    phone: '(800) 352-5326', email: 'customer.service@ecolab.com', website: 'https://www.ecolab.com',
    contact_first_name: 'James', contact_last_name: 'Rivera',
    categoryNames: ['Chemicals', 'Housekeeping/Janitorial Services', 'Pest Control Products/Services'],
    is_featured: true
  },
  {
    company_name: 'Serta Simmons Hospitality',
    description: 'Serta Simmons Hospitality delivers premium mattresses and sleep solutions to hotels worldwide with proven comfort and durability.',
    address_line1: '1 Concourse Pkwy NE', city: 'Atlanta', state: 'Georgia', zip_code: '30328',
    phone: '(888) 557-3782', email: 'hospitality@sfrbrands.com', website: 'https://www.sertasimmonshospitality.com',
    contact_first_name: 'Patricia', contact_last_name: 'Williams',
    categoryNames: ['Mattresses/Box Springs', 'Bed + Bath Accessories/Supplies'],
    is_featured: true
  },
  {
    company_name: 'Cintas Corporation',
    description: 'Cintas provides a range of products and services including uniforms, mats, mops, cleaning supplies, first aid and fire protection for hospitality businesses.',
    address_line1: '6800 Cintas Blvd', city: 'Mason', state: 'Ohio', zip_code: '45040',
    phone: '(800) 246-8271', email: 'info@cintas.com', website: 'https://www.cintas.com',
    contact_first_name: 'Thomas', contact_last_name: 'Anderson',
    categoryNames: ['Housekeeping/Janitorial Services', 'Maintenance Supplies', 'Security Control/Safety Products'],
    is_featured: false
  },
  {
    company_name: 'Diversey Inc.',
    description: 'Diversey delivers smart, sustainable solutions for cleaning and hygiene in the hospitality sector.',
    address_line1: '1300 Altura Rd', city: 'Fort Mill', state: 'South Carolina', zip_code: '29708',
    phone: '(888) 352-2249', email: 'northamerica@diversey.com', website: 'https://www.diversey.com',
    contact_first_name: 'Sarah', contact_last_name: 'Johnson',
    categoryNames: ['Chemicals', 'Housekeeping/Janitorial Services'],
    is_featured: false
  },
  {
    company_name: 'LG Business Solutions',
    description: 'LG Business Solutions provides commercial-grade televisions, digital signage, and appliance solutions for hotels.',
    address_line1: '2000 Millbrook Dr', city: 'Lincolnshire', state: 'Illinois', zip_code: '60069',
    phone: '(888) 865-3026', email: 'hospitality@lge.com', website: 'https://www.lg.com/us/business',
    contact_first_name: 'Kevin', contact_last_name: 'Park',
    categoryNames: ['Televisions/Electronics', 'Electronics / Manufacturing'],
    is_featured: true
  },
  {
    company_name: 'Samsung Hospitality',
    description: 'Samsung Hospitality TV solutions featuring LYNK REACH, Pro:Idiom and SMART technology for guest entertainment.',
    address_line1: '85 Challenger Rd', city: 'Ridgefield Park', state: 'New Jersey', zip_code: '07660',
    phone: '(866) 726-4249', email: 'hospitality@samsung.com', website: 'https://www.samsung.com/us/business/hospitality',
    contact_first_name: 'Michelle', contact_last_name: 'Kim',
    categoryNames: ['Televisions/Electronics', 'Cable/Satellite TV Services'],
    is_featured: false
  },
  {
    company_name: 'Procter & Gamble Professional',
    description: 'P&G Professional provides trusted cleaning, laundry and housekeeping brands for hospitality properties worldwide.',
    address_line1: '1 P&G Plaza', city: 'Cincinnati', state: 'Ohio', zip_code: '45202',
    phone: '(800) 332-7787', email: 'pgpro.info@pg.com', website: 'https://www.pgpro.com',
    contact_first_name: 'Robert', contact_last_name: 'Mitchell',
    categoryNames: ['Chemicals', 'Housekeeping/Janitorial Services', 'Laundry Equipment'],
    is_featured: false
  },
  {
    company_name: 'Oracle Hospitality',
    description: 'Oracle Hospitality provides cloud-based property management, POS and distribution solutions for the hospitality industry.',
    address_line1: '500 Oracle Pkwy', city: 'Redwood City', state: 'California', zip_code: '94065',
    phone: '(866) 287-4736', email: 'hospitalityinfo@oracle.com', website: 'https://www.oracle.com/hospitality',
    contact_first_name: 'David', contact_last_name: 'Martinez',
    categoryNames: ['Property Management Software', 'POS Systems - Point of Sale', 'Online Reservation Systems'],
    is_featured: true
  },
  {
    company_name: 'Kingsdown Hospitality',
    description: 'Kingsdown manufactures premium sleep systems and mattresses designed specifically for the demands of hospitality.',
    address_line1: '170 Village St', city: 'Mebane', state: 'North Carolina', zip_code: '27302',
    phone: '(800) 438-8476', email: 'hospitality@kingsdown.com', website: 'https://www.kingsdown.com',
    contact_first_name: 'Nancy', contact_last_name: 'Brown',
    categoryNames: ['Mattresses/Box Springs', 'Furniture/Fixtures'],
    is_featured: false
  },
  {
    company_name: 'Mohawk Industries Hospitality',
    description: 'Mohawk offers a complete portfolio of flooring solutions including carpet, hardwood, LVT and tile for hotel environments.',
    address_line1: '160 S Industrial Blvd', city: 'Calhoun', state: 'Georgia', zip_code: '30701',
    phone: '(800) 554-6637', email: 'hospitality@mohawkind.com', website: 'https://www.mohawkind.com',
    contact_first_name: 'Daniel', contact_last_name: 'Garcia',
    categoryNames: ['Carpet/Carpet Cushion', 'Floor Coverings', 'Carpet Floor Care'],
    is_featured: false
  },
  {
    company_name: 'Honeywell Building Technologies',
    description: 'Honeywell provides energy management, fire safety, security and HVAC controls for hotels and commercial properties.',
    address_line1: '715 Peachtree St NE', city: 'Atlanta', state: 'Georgia', zip_code: '30308',
    phone: '(800) 345-6770', email: 'buildingsolutions@honeywell.com', website: 'https://www.honeywell.com',
    contact_first_name: 'Jennifer', contact_last_name: 'Davis',
    categoryNames: ['Energy Management', 'Heating/Air Conditioning', 'Security Control/Safety Products'],
    is_featured: true
  },
  {
    company_name: 'GE Appliances Commercial',
    description: 'GE Appliances serves hospitality with commercial-grade refrigerators, microwaves, washers, dryers and cooking equipment.',
    address_line1: 'Appliance Park', city: 'Louisville', state: 'Kentucky', zip_code: '40225',
    phone: '(800) 626-8774', email: 'commercial@geappliances.com', website: 'https://www.geappliances.com',
    contact_first_name: 'Michael', contact_last_name: 'Thompson',
    categoryNames: ['Equipment/Appliance Provider', 'Laundry Equipment'],
    is_featured: false
  },
  {
    company_name: 'Spectrum Enterprise',
    description: 'Spectrum Enterprise provides managed WiFi, TV, and internet solutions tailored for hospitality environments.',
    address_line1: '400 Atlantic St', city: 'Stamford', state: 'Connecticut', zip_code: '06901',
    phone: '(833) 267-6094', email: 'enterprise@charter.com', website: 'https://enterprise.spectrum.com',
    contact_first_name: 'Emily', contact_last_name: 'Wilson',
    categoryNames: ['Internet Services', 'Cable/Satellite TV Services', 'Telecommunication Service Equipment'],
    is_featured: false
  },
  {
    company_name: 'Kohler Hospitality',
    description: 'Kohler delivers premium plumbing products, fixtures, and accessories for luxury and select-service hospitality properties.',
    address_line1: '444 Highland Dr', city: 'Kohler', state: 'Wisconsin', zip_code: '53044',
    phone: '(800) 456-4537', email: 'hospitality@kohler.com', website: 'https://www.kohler.com',
    contact_first_name: 'Andrew', contact_last_name: 'Taylor',
    categoryNames: ['Plumbing Supplies', 'Bed + Bath Accessories/Supplies'],
    is_featured: true
  },
  {
    company_name: 'Hilldrup Hospitality',
    description: 'Hilldrup provides FF&E installation, warehousing, logistics and project management services for hotel renovations.',
    address_line1: '218 Dill Ave', city: 'Stafford', state: 'Virginia', zip_code: '22554',
    phone: '(800) 476-6683', email: 'hospitality@hilldrup.com', website: 'https://www.hilldrup.com',
    contact_first_name: 'Rebecca', contact_last_name: 'Moore',
    categoryNames: ['Transportation/Shipping', 'Renovation/Remodeling', 'Furniture/Fixtures'],
    is_featured: false
  },
  {
    company_name: 'Standard Textile Hospitality',
    description: 'Standard Textile designs and manufactures bed linens, bath towels, and terry products for leading hotel brands worldwide.',
    address_line1: '1 Knollcrest Dr', city: 'Cincinnati', state: 'Ohio', zip_code: '45237',
    phone: '(800) 999-0400', email: 'hospitality@standardtextile.com', website: 'https://www.standardtextile.com',
    contact_first_name: 'Amanda', contact_last_name: 'Lee',
    categoryNames: ['Linens/Textiles', 'Bedspreads/Draperies/Pillows', 'Bed + Bath Accessories/Supplies'],
    is_featured: true
  },
  {
    company_name: 'ASSA ABLOY Hospitality',
    description: 'ASSA ABLOY provides mobile access, RFID and electronic lock solutions for major hotel brands worldwide.',
    address_line1: '110 Terry Dr', city: 'Newtown', state: 'Pennsylvania', zip_code: '18940',
    phone: '(800) 626-7590', email: 'hospitality@assaabloy.com', website: 'https://www.assaabloyhospitality.com',
    contact_first_name: 'Steven', contact_last_name: 'Harris',
    categoryNames: ['Security Control/Safety Products', 'Doors/Windows', 'Electronics / Manufacturing'],
    is_featured: true
  },
  {
    company_name: 'CleanPro Hospitality Services',
    description: 'Professional cleaning supplies and housekeeping products for hotels and resorts.',
    address_line1: '3200 Southwest Freeway', city: 'Houston', state: 'Texas', zip_code: '77027',
    phone: '(713) 555-0134', email: 'info@cleanprohospitality.com', website: 'https://cleanprohospitality.com',
    contact_first_name: 'David', contact_last_name: 'Williams',
    categoryNames: ['Chemicals', 'Housekeeping/Janitorial Services'],
    is_featured: false
  },
  {
    company_name: 'FurnishRite Hotel Solutions',
    description: 'Custom hotel furniture and fixtures for lobbies, rooms, and common areas.',
    address_line1: '5600 Wilshire Blvd', city: 'Los Angeles', state: 'California', zip_code: '90036',
    phone: '(323) 555-0178', email: 'hello@furnishrite.com', website: 'https://furnishrite.com',
    contact_first_name: 'Jennifer', contact_last_name: 'Davis',
    categoryNames: ['Furniture/Fixtures', 'Casegoods', 'Interior Designers'],
    is_featured: true
  },
  {
    company_name: 'BrewRight Coffee Hospitality',
    description: 'Specialty coffee and beverage solutions for in-room and lobby service at hotels.',
    address_line1: '2100 Pike St', city: 'Seattle', state: 'Washington', zip_code: '98101',
    phone: '(206) 555-0156', email: 'orders@brewright.com', website: 'https://brewright.com',
    contact_first_name: 'Michael', contact_last_name: 'Anderson',
    categoryNames: ['Food/Beverage', 'Vending Machines/Supplies'],
    is_featured: false
  },
  {
    company_name: 'SecureStay Systems',
    description: 'Electronic locking systems, surveillance, and security products for hotel properties.',
    address_line1: '400 Las Vegas Blvd S', city: 'Las Vegas', state: 'Nevada', zip_code: '89101',
    phone: '(702) 555-0189', email: 'sales@securestay.com', website: 'https://securestay.com',
    contact_first_name: 'James', contact_last_name: 'Martinez',
    categoryNames: ['Security Control/Safety Products', 'Electronics / Manufacturing'],
    is_featured: false
  },
  {
    company_name: 'TechRoom AV Solutions',
    description: 'In-room televisions, interactive TV services, and AV systems for hospitality.',
    address_line1: '1 Financial Center', city: 'Boston', state: 'Massachusetts', zip_code: '02111',
    phone: '(617) 555-0145', email: 'info@techroom.com', website: 'https://techroom.com',
    contact_first_name: 'Emily', contact_last_name: 'Thompson',
    categoryNames: ['Televisions/Electronics', 'Cable/Satellite TV Services'],
    is_featured: true
  },
  {
    company_name: 'FreshWash Laundry Equipment',
    description: 'Commercial laundry machines for high volume hotel and resort operations.',
    address_line1: '200 S Orange Ave', city: 'Orlando', state: 'Florida', zip_code: '32801',
    phone: '(407) 555-0167', email: 'contact@freshwash.com', website: 'https://freshwash.com',
    contact_first_name: 'Daniel', contact_last_name: 'Garcia',
    categoryNames: ['Laundry Equipment', 'Equipment/Appliance Provider'],
    is_featured: false
  },
  {
    company_name: 'PestShield Hotel Protection',
    description: 'Pest control products and integrated pest management services for hospitality properties.',
    address_line1: '300 Bourbon St', city: 'New Orleans', state: 'Louisiana', zip_code: '70130',
    phone: '(504) 555-0123', email: 'service@pestshield.com', website: 'https://pestshield.com',
    contact_first_name: 'Lisa', contact_last_name: 'Robinson',
    categoryNames: ['Pest Control Products/Services'],
    is_featured: false
  },
  {
    company_name: 'AquaComfort Pool Supply',
    description: 'Swimming pool chemicals, equipment and maintenance services for hotels and resorts.',
    address_line1: '7890 Biscayne Blvd', city: 'Miami', state: 'Florida', zip_code: '33138',
    phone: '(305) 555-0198', email: 'info@aquacomfort.com', website: 'https://aquacomfort.com',
    contact_first_name: 'Kevin', contact_last_name: 'Lee',
    categoryNames: ['Swimming Pool Supplies/Equipment', 'Chemicals'],
    is_featured: true
  },
  {
    company_name: 'Heartland Payment Systems',
    description: 'Heartland provides point-of-sale, credit card processing and payroll solutions for the hotel industry.',
    address_line1: '1 Heartland Way', city: 'Jeffersonville', state: 'Indiana', zip_code: '47130',
    phone: '(888) 963-3600', email: 'hospitality@heartland.us', website: 'https://www.heartland.us',
    contact_first_name: 'Christopher', contact_last_name: 'White',
    categoryNames: ['Credit Card Processing', 'POS Systems - Point of Sale'],
    is_featured: false
  },
  {
    company_name: 'Kforce Studios',
    description: 'Interior design and FF&E procurement services for boutique and lifestyle hotel projects.',
    address_line1: '325 N St Paul St', city: 'Dallas', state: 'Texas', zip_code: '75201',
    phone: '(214) 555-0212', email: 'projects@kforcestudios.com', website: 'https://kforcestudios.com',
    contact_first_name: 'Rachel', contact_last_name: 'Green',
    categoryNames: ['Interior Designers', 'Engineering / Design', 'Consulting'],
    is_featured: false
  },
  {
    company_name: 'SkyTech WiFi Solutions',
    description: 'Managed WiFi infrastructure, guest network systems, and bandwidth solutions for hotel properties.',
    address_line1: '100 Pine St', city: 'San Francisco', state: 'California', zip_code: '94111',
    phone: '(415) 555-0299', email: 'info@skytechifi.com', website: 'https://skytechifi.com',
    contact_first_name: 'Jason', contact_last_name: 'Nguyen',
    categoryNames: ['Internet Services', 'IT / Business Services', 'Telecommunication Service Equipment'],
    is_featured: true
  },
  {
    company_name: 'Champion Industries Sign Co',
    description: 'Interior and exterior signage, wayfinding systems and branding displays for hotel properties.',
    address_line1: '2601 W Main St', city: 'Tupelo', state: 'Mississippi', zip_code: '38801',
    phone: '(662) 555-0177', email: 'info@championsigns.com', website: 'https://championsigns.com',
    contact_first_name: 'Brian', contact_last_name: 'Clark',
    categoryNames: ['Signs', 'Printing/Design/Production', 'Advertising/Marketing'],
    is_featured: false
  },
  {
    company_name: 'National Sign & Signal',
    description: 'LED message boards, pylon signs and monument signs for hotels and hospitality brands.',
    address_line1: '901 Commerce Dr', city: 'Perrysburg', state: 'Ohio', zip_code: '43551',
    phone: '(419) 555-0188', email: 'sales@nationalsign.com', website: 'https://nationalsign.com',
    contact_first_name: 'Scott', contact_last_name: 'Phillips',
    categoryNames: ['Signs', 'Electronics / Manufacturing'],
    is_featured: false
  },
  {
    company_name: 'Hyatt Franchise Group',
    description: 'Hotel franchise opportunities and management consulting for the Hyatt brand portfolio.',
    address_line1: '150 N Riverside Plz', city: 'Chicago', state: 'Illinois', zip_code: '60606',
    phone: '(312) 555-0145', email: 'franchise@hyatt.com', website: 'https://www.hyatt.com',
    contact_first_name: 'Peter', contact_last_name: 'Adams',
    categoryNames: ['Franchising', 'Management Companies', 'Consulting'],
    is_featured: true
  },
  {
    company_name: 'Revenue Analytics Pro',
    description: 'Revenue management software and consulting bringing AI-powered pricing to independent hotels.',
    address_line1: '1100 Peachtree St', city: 'Atlanta', state: 'Georgia', zip_code: '30309',
    phone: '(404) 555-0311', email: 'info@revenueanalytics.com', website: 'https://revenueanalyticspro.com',
    contact_first_name: 'Priya', contact_last_name: 'Patel',
    categoryNames: ['Revenue Management', 'Computers Software', 'AI Automation'],
    is_featured: false
  },
  {
    company_name: 'Staywell Hospitality Insurance',
    description: 'Comprehensive property, liability, and business interruption insurance designed for the hospitality sector.',
    address_line1: '1 Liberty Plz', city: 'New York', state: 'New York', zip_code: '10006',
    phone: '(212) 555-0266', email: 'hospitality@staywell.com', website: 'https://staywellinsurance.com',
    contact_first_name: 'Karen', contact_last_name: 'Jackson',
    categoryNames: ['Insurance', 'Financial Services'],
    is_featured: false
  },
  {
    company_name: 'RightKey Tax Advisors',
    description: 'Tax planning, cost segregation studies, and compliance services for hotel owners and investors.',
    address_line1: '400 Park Ave', city: 'New York', state: 'New York', zip_code: '10022',
    phone: '(212) 555-0399', email: 'info@rightkeytax.com', website: 'https://rightkeytax.com',
    contact_first_name: 'Gregory', contact_last_name: 'Watson',
    categoryNames: ['Tax Consultants', 'Accounting Services', 'Financial Services'],
    is_featured: false
  },
  {
    company_name: 'Fitness Design Group',
    description: 'Design, supply and installation of fitness centers and wellness facilities for hotels.',
    address_line1: '8950 Cal Center Dr', city: 'Sacramento', state: 'California', zip_code: '95826',
    phone: '(916) 555-0144', email: 'sales@fitnessdesigngroup.com', website: 'https://fitnessdesigngroup.com',
    contact_first_name: 'Amy', contact_last_name: 'Rodriguez',
    categoryNames: ['Fitness Equipment', 'Construction', 'Interior Designers'],
    is_featured: false
  },
  {
    company_name: 'AO Smith Water Heating',
    description: 'Commercial water heaters and boilers for hotel laundry, kitchen, and guest room applications.',
    address_line1: '11270 W Park Pl', city: 'Milwaukee', state: 'Wisconsin', zip_code: '53224',
    phone: '(800) 527-1953', email: 'commercial@aosmith.com', website: 'https://www.aosmith.com',
    contact_first_name: 'George', contact_last_name: 'Baker',
    categoryNames: ['Water Heaters', 'Plumbing Supplies', 'Heating/Air Conditioning'],
    is_featured: false
  },
  {
    company_name: 'Wallcraft Interiors',
    description: 'Commercial wallcovering, vinyl wall wraps and accent walls for hotel rooms, corridors and lobbies.',
    address_line1: '500 Frank W Burr Blvd', city: 'Teaneck', state: 'New Jersey', zip_code: '07666',
    phone: '(201) 555-0233', email: 'projects@wallcraft.com', website: 'https://wallcraftinteriors.com',
    contact_first_name: 'Linda', contact_last_name: 'Nelson',
    categoryNames: ['Wall Coverings', 'Interior Designers', 'Renovation/Remodeling'],
    is_featured: false
  },
  {
    company_name: 'Hussmann Vending Solutions',
    description: 'Ice machines, vending machines and automated retail solutions for hotel lobbies and corridors.',
    address_line1: '12999 St Charles Rock Rd', city: 'Bridgeton', state: 'Missouri', zip_code: '63044',
    phone: '(314) 555-0188', email: 'vending@hussmann.com', website: 'https://hussmann.com',
    contact_first_name: 'Paul', contact_last_name: 'Allen',
    categoryNames: ['Vending Machines/Supplies', 'Equipment/Appliance Provider'],
    is_featured: false
  },
  {
    company_name: 'Carrier Global HVAC',
    description: 'Heating, ventilation, air conditioning and refrigeration systems for hotel infrastructure.',
    address_line1: '13995 Pasteur Blvd', city: 'Palm Beach Gardens', state: 'Florida', zip_code: '33418',
    phone: '(800) 227-7437', email: 'info@carrier.com', website: 'https://www.carrier.com',
    contact_first_name: 'William', contact_last_name: 'Wright',
    categoryNames: ['Heating/Air Conditioning', 'Energy Management'],
    is_featured: true
  },
];

const seedData = async () => {
  try {
    // Clear existing
    await Category.deleteMany({});
    await Vendor.deleteMany({});
    await User.deleteMany({}); // Delete users generated from previous seeding

    // Seed categories
    const categoryDocs = categoriesData.map(name => ({ name }));
    const insertedCategories = await Category.insertMany(categoryDocs);

    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Seed vendors & dummy users for each
    const vendorDocs = [];
    
    for (let index = 0; index < vendorsRawData.length; index++) {
      const v = vendorsRawData[index];
      
      // Create a dummy user for the vendor (as required by schema)
      const user = await User.create({
        full_name: `${v.contact_first_name} ${v.contact_last_name}`,
        email: `vendor${index}@${v.company_name.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0,14)}.com`,
        password: 'password123',
        role: 'vendor',
        phone: v.phone
      });

      const catIds = v.categoryNames
        .map(name => categoryMap[name])
        .filter(Boolean); // remove undefined if category name doesn't match
      
      vendorDocs.push({
        user_id: user._id,
        company_name: v.company_name,
        description: v.description,
        address_line1: v.address_line1,
        city: v.city,
        state: v.state,
        zip_code: v.zip_code,
        phone: v.phone,
        email: v.email,
        website: v.website,
        contact_first_name: v.contact_first_name,
        contact_last_name: v.contact_last_name,
        categories: catIds,
        is_featured: v.is_featured,
        is_approved: true
      });
    }

    await Vendor.insertMany(vendorDocs);

    console.log(`\n✅ Categories seeded: ${insertedCategories.length}`);
    console.log(`✅ Vendors seeded: ${vendorDocs.length}`);
    console.log(`✅ Users seeded: ${vendorDocs.length}`);
    console.log("\n🎉 Database seeded successfully!\n");
    
    process.exit(0);
  } catch (err) {
      console.error('❌ Seeding error:', err);
      process.exit(1);
  }
};

seedData();

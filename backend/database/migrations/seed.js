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

const { categoriesData, vendorsRawData } = require('./constant');


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
        email: `vendor${index}@${v.company_name.replace(/[^a-zA-Z]/g, '').toLowerCase().substring(0, 14)}.com`,
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

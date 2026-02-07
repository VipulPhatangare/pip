// Seed Script - Populates MongoDB with demo data
import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDatabase();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('✅ Cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@alphabyte.com',
      password: 'admin123',
      phone: '+1-555-0100',
      role: 'admin'
    });

    const agent1 = await User.create({
      name: 'John Smith',
      email: 'john.smith@alphabyte.com',
      password: 'agent123',
      phone: '+1-555-0101',
      role: 'agent'
    });

    const agent2 = await User.create({
      name: 'Sarah Johnson',
      email: 'sarah.johnson@alphabyte.com',
      password: 'agent123',
      phone: '+1-555-0102',
      role: 'agent'
    });

    const user1 = await User.create({
      name: 'Michael Brown',
      email: 'michael@example.com',
      password: 'user123',
      phone: '+1-555-0201',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Emily Davis',
      email: 'emily@example.com',
      password: 'user123',
      phone: '+1-555-0202',
      role: 'user'
    });

    console.log(`✅ Created ${5} users\n`);

    // Create properties
    console.log('🏠 Creating properties...');
    const properties = [
      {
        title: 'Luxury Downtown Apartment',
        description: 'Beautiful modern apartment in the heart of downtown with stunning city views. Features high-end finishes, smart home technology, and access to premium amenities.',
        type: 'apartment',
        status: 'available',
        price: 850000,
        currency: 'USD',
        location: {
          address: '123 Main Street, Unit 2501',
          city: 'New York',
          state: 'NY',
          country: 'USA',
          zipCode: '10001',
          coordinates: { lat: 40.7484, lng: -73.9857 }
        },
        features: {
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          parking: 1,
          yearBuilt: 2020,
          amenities: ['Gym', 'Pool', 'Concierge', 'Rooftop Terrace', 'Pet Friendly']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
            thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
            alt: 'Living room with city view'
          }
        ],
        agent: agent1._id,
        featured: true
      },
      {
        title: 'Spacious Family House with Garden',
        description: 'Perfect family home with large backyard, modern kitchen, and excellent school district. Recently renovated with energy-efficient upgrades.',
        type: 'house',
        status: 'available',
        price: 675000,
        currency: 'USD',
        location: {
          address: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          zipCode: '90001',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          area: 2500,
          parking: 2,
          yearBuilt: 2015,
          amenities: ['Garden', 'Garage', 'Home Office', 'Solar Panels']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
            thumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
            alt: 'Modern house exterior'
          }
        ],
        agent: agent1._id,
        featured: true
      },
      {
        title: 'Beachfront Villa with Ocean Views',
        description: 'Stunning luxury villa right on the beach with panoramic ocean views. Private pool, direct beach access, and high-end finishes throughout.',
        type: 'villa',
        status: 'available',
        price: 2500000,
        currency: 'USD',
        location: {
          address: '789 Beach Road',
          city: 'Miami',
          state: 'FL',
          country: 'USA',
          zipCode: '33101',
          coordinates: { lat: 25.7617, lng: -80.1918 }
        },
        features: {
          bedrooms: 5,
          bathrooms: 4,
          area: 4000,
          parking: 3,
          yearBuilt: 2019,
          amenities: ['Private Pool', 'Beach Access', 'Wine Cellar', 'Home Theater', 'Smart Home']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811',
            thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
            alt: 'Luxury villa with pool'
          }
        ],
        agent: agent2._id,
        featured: true
      },
      {
        title: 'Cozy Studio in Arts District',
        description: 'Perfect starter home or investment property. Located in vibrant arts district with cafes, galleries, and public transport nearby.',
        type: 'apartment',
        status: 'available',
        price: 320000,
        currency: 'USD',
        location: {
          address: '321 Art Street, Unit 5B',
          city: 'Chicago',
          state: 'IL',
          country: 'USA',
          zipCode: '60601',
          coordinates: { lat: 41.8781, lng: -87.6298 }
        },
        features: {
          bedrooms: 1,
          bathrooms: 1,
          area: 550,
          parking: 0,
          yearBuilt: 2018,
          amenities: ['Hardwood Floors', 'Updated Kitchen', 'Pet Friendly']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            thumbnail: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            alt: 'Cozy studio apartment'
          }
        ],
        agent: agent2._id,
        featured: false
      },
      {
        title: 'Modern Condo with City Skyline',
        description: 'Contemporary 2-bedroom condo with floor-to-ceiling windows and breathtaking skyline views. Walking distance to shopping and dining.',
        type: 'condo',
        status: 'available',
        price: 595000,
        currency: 'USD',
        location: {
          address: '555 Tower Boulevard, Floor 18',
          city: 'Seattle',
          state: 'WA',
          country: 'USA',
          zipCode: '98101',
          coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        features: {
          bedrooms: 2,
          bathrooms: 2,
          area: 1100,
          parking: 1,
          yearBuilt: 2021,
          amenities: ['Gym', 'Concierge', 'Bike Storage', 'EV Charging']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
            thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
            alt: 'Modern condo interior'
          }
        ],
        agent: agent1._id,
        featured: false
      },
      {
        title: 'Commercial Space in Business District',
        description: 'Prime commercial property ready for your business. High foot traffic area, modern infrastructure, and flexible floor plan.',
        type: 'commercial',
        status: 'available',
        price: 1200000,
        currency: 'USD',
        location: {
          address: '888 Commerce Street',
          city: 'San Francisco',
          state: 'CA',
          country: 'USA',
          zipCode: '94102',
          coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        features: {
          bedrooms: 0,
          bathrooms: 2,
          area: 3000,
          parking: 5,
          yearBuilt: 2017,
          amenities: ['Loading Dock', 'Security System', 'Conference Room', 'Fiber Internet']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
            thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
            alt: 'Modern office space'
          }
        ],
        agent: agent2._id,
        featured: false
      },
      {
        title: 'Mountain Retreat with Stunning Views',
        description: 'Escape to your own mountain paradise. Secluded property with hiking trails, wildlife, and year-round outdoor activities.',
        type: 'house',
        status: 'available',
        price: 890000,
        currency: 'USD',
        location: {
          address: '100 Mountain Ridge Road',
          city: 'Denver',
          state: 'CO',
          country: 'USA',
          zipCode: '80201',
          coordinates: { lat: 39.7392, lng: -104.9903 }
        },
        features: {
          bedrooms: 3,
          bathrooms: 2,
          area: 2200,
          parking: 2,
          yearBuilt: 2016,
          amenities: ['Fireplace', 'Deck', 'Mountain Views', 'Wood Stove']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
            thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
            alt: 'Mountain cabin'
          }
        ],
        agent: agent1._id,
        featured: true
      },
      {
        title: 'Lakefront Property with Private Dock',
        description: 'Enjoy lakefront living with your own private dock. Perfect for water enthusiasts with boating, fishing, and swimming at your doorstep.',
        type: 'house',
        status: 'pending',
        price: 1150000,
        currency: 'USD',
        location: {
          address: '222 Lakeshore Drive',
          city: 'Austin',
          state: 'TX',
          country: 'USA',
          zipCode: '73301',
          coordinates: { lat: 30.2672, lng: -97.7431 }
        },
        features: {
          bedrooms: 4,
          bathrooms: 3,
          area: 2800,
          parking: 2,
          yearBuilt: 2018,
          amenities: ['Private Dock', 'Boat House', 'Outdoor Kitchen', 'Fire Pit']
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1494203484021-3c454daf695d',
            thumbnail: 'https://images.unsplash.com/photo-1494203484021-3c454daf695d?w=400',
            alt: 'Lakefront house'
          }
        ],
        agent: agent2._id,
        featured: false
      }
    ];

    await Property.insertMany(properties);
    console.log(`✅ Created ${properties.length} properties\n`);

    console.log('═══════════════════════════════════════');
    console.log('✨ Database seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Users: ${5}`);
    console.log(`   - Properties: ${properties.length}`);
    console.log('\n👥 Test Accounts:');
    console.log('   Admin: admin@alphabyte.com / admin123');
    console.log('   Agent: john.smith@alphabyte.com / agent123');
    console.log('   Agent: sarah.johnson@alphabyte.com / agent123');
    console.log('   User: michael@example.com / user123');
    console.log('   User: emily@example.com / user123');
    console.log('═══════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedDatabase();

// Real Estate Property Data - Works across all tiers
export const properties = [
  {
    id: "prop-001",
    title: "Luxury Modern Villa",
    price: 2500000,
    location: {
      city: "Mumbai",
      area: "Bandra West",
      address: "123 Hill Road, Bandra West"
    },
    specs: {
      beds: 4,
      baths: 3,
      sqft: 2500,
      parking: 2,
      type: "Villa"
    },
    images: {
      // Tier A: High-res images
      high: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1920",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920"
      ],
      // Tier B: Medium-res images
      medium: [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"
      ],
      // Tier C: Low-res single image
      low: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400"
    },
    model3D: {
      spline: null, // Tier A (add Spline URL if available)
      gltf: "/models/villa-01.glb" // Tier B (Three.js)
    },
    features: [
      "Private swimming pool",
      "Modern kitchen with island",
      "Walk-in closets",
      "Smart home system",
      "Rooftop terrace",
      "Home theater room"
    ],
    description: "Stunning modern villa with contemporary design and luxury amenities. Features an open-plan living space, floor-to-ceiling windows, and breathtaking city views. Perfect for families seeking premium lifestyle.",
    agent: {
      name: "Priya Sharma",
      phone: "+91 98765 43210",
      email: "priya@realestate.com",
      photo: "https://i.pravatar.cc/150?img=5"
    },
    status: "available",
    yearBuilt: 2022
  },
  {
    id: "prop-002",
    title: "Spacious 3BHK Apartment",
    price: 1200000,
    location: {
      city: "Pune",
      area: "Koregaon Park",
      address: "456 North Main Road"
    },
    specs: {
      beds: 3,
      baths: 2,
      sqft: 1500,
      parking: 1,
      type: "Apartment"
    },
    images: {
      high: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920"
      ],
      medium: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
      ],
      low: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"
    },
    model3D: {
      spline: null,
      gltf: "/models/apartment-01.glb"
    },
    features: [
      "Club house",
      "24/7 security",
      "Children's play area",
      "Gym and swimming pool",
      "Power backup",
      "Covered parking"
    ],
    description: "Well-designed 3BHK apartment in a prime residential area. Close to schools, hospitals, and shopping centers. Ideal for families.",
    agent: {
      name: "Rahul Verma",
      phone: "+91 98123 45678",
      email: "rahul@realestate.com",
      photo: "https://i.pravatar.cc/150?img=12"
    },
    status: "available",
    yearBuilt: 2021
  },
  {
    id: "prop-003",
    title: "Penthouse with City View",
    price: 4500000,
    location: {
      city: "Bangalore",
      area: "Whitefield",
      address: "789 Tech Boulevard"
    },
    specs: {
      beds: 5,
      baths: 4,
      sqft: 3500,
      parking: 3,
      type: "Penthouse"
    },
    images: {
      high: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920"
      ],
      medium: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
      ],
      low: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400"
    },
    model3D: {
      spline: null,
      gltf: "/models/penthouse-01.glb"
    },
    features: [
      "360-degree city views",
      "Private elevator access",
      "Jacuzzi on terrace",
      "Wine cellar",
      "Home automation",
      "Concierge service"
    ],
    description: "Ultra-luxury penthouse with panoramic city views. Features designer interiors, premium fittings, and exclusive amenities. A true statement of success.",
    agent: {
      name: "Anjali Reddy",
      phone: "+91 97654 32109",
      email: "anjali@realestate.com",
      photo: "https://i.pravatar.cc/150?img=30"
    },
    status: "available",
    yearBuilt: 2023
  },
  {
    id: "prop-004",
    title: "Cozy 2BHK Starter Home",
    price: 750000,
    location: {
      city: "Hyderabad",
      area: "Gachibowli",
      address: "321 Tech Park Road"
    },
    specs: {
      beds: 2,
      baths: 2,
      sqft: 1100,
      parking: 1,
      type: "Apartment"
    },
    images: {
      high: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920"
      ],
      medium: [
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800"
      ],
      low: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400"
    },
    model3D: {
      spline: null,
      gltf: "/models/apartment-02.glb"
    },
    features: [
      "Modular kitchen",
      "Vastu compliant",
      "Ample natural light",
      "Near metro station",
      "Shopping complex nearby",
      "Peaceful neighborhood"
    ],
    description: "Perfect starter home for young professionals and small families. Affordable yet comfortable living in a well-connected area.",
    agent: {
      name: "Sanjay Kumar",
      phone: "+91 96543 21098",
      email: "sanjay@realestate.com",
      photo: "https://i.pravatar.cc/150?img=15"
    },
    status: "available",
    yearBuilt: 2020
  },
  {
    id: "prop-005",
    title: "Farmhouse with Land",
    price: 3200000,
    location: {
      city: "Lonavala",
      area: "Khandala",
      address: "Hill Station Road"
    },
    specs: {
      beds: 6,
      baths: 5,
      sqft: 4000,
      parking: 5,
      type: "Farmhouse"
    },
    images: {
      high: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920",
        "https://images.unsplash.com/photo-1600047508788-786826d18ec5?w=1920"
      ],
      medium: [
        "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800"
      ],
      low: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400"
    },
    model3D: {
      spline: null,
      gltf: "/models/farmhouse-01.glb"
    },
    features: [
      "2 acres of land",
      "Private garden",
      "Outdoor pavilion",
      "Fruit orchards",
      "Mountain views",
      "100% organic farm"
    ],
    description: "Serene farmhouse retreat surrounded by nature. Perfect weekend getaway with modern amenities and rustic charm.",
    agent: {
      name: "Meera Patel",
      phone: "+91 95432 10987",
      email: "meera@realestate.com",
      photo: "https://i.pravatar.cc/150?img=25"
    },
    status: "available",
    yearBuilt: 2019
  }
];

// Filter helpers
export const getCities = () => {
  return [...new Set(properties.map(p => p.location.city))];
};

export const getPropertyTypes = () => {
  return [...new Set(properties.map(p => p.specs.type))];
};

export const filterProperties = (filters) => {
  return properties.filter(property => {
    if (filters.city && property.location.city !== filters.city) return false;
    if (filters.type && property.specs.type !== filters.type) return false;
    if (filters.minPrice && property.price < filters.minPrice) return false;
    if (filters.maxPrice && property.price > filters.maxPrice) return false;
    return true;
  });
};

export const getPropertyById = (id) => {
  return properties.find(p => p.id === id);
};

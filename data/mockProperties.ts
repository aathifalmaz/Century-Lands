export interface Property {
    id: number
    slug: string
    title: string
    tagline: string
    location: string
    address: string
    price: string
    pricePerSqft: string
    status: "Available" | "Under Offer" | "Sold" | "For Sale" | "For Rent"
    beds: number
    baths: number
    size: string
    landSize: string
    parking: number
    yearBuilt: number
    propertyType: string
    listingId: string
    furnishing: string
    ownership: string
    images: string[]
    description: string
    amenities: string[]
    coordinates: { lat: number; lng: number }
    nearbyPlaces: { name: string; distance: string; type: string }[]
    agent: {
        name: string
        company: string
        phone: string
        email: string
        whatsapp: string
        photo: string
    }
}

export const properties: Property[] = [
    {
        id: 1,
        slug: "luxury-beachfront-villa",
        title: "Luxury Beachfront Villa",
        tagline: "Sea view | 5 mins to beach",
        location: "Negombo",
        address: "42 Beach Road, Negombo, Western Province",
        price: "LKR 8,500,000",
        pricePerSqft: "LKR 26,562",
        status: "For Sale",
        beds: 4,
        baths: 3,
        size: "3,200 sqft",
        landSize: "15 Perches",
        parking: 2,
        yearBuilt: 2021,
        propertyType: "Villa",
        listingId: "CLH-1001",
        furnishing: "Fully Furnished",
        ownership: "Freehold",
        images: [
            "/mock/1.jpg",
            "/mock/2.jpg",
            "/mock/3.jpg",
            "/mock/4.jpg",
            "/mock/5.jpg",
        ],
        description: `This stunning beachfront villa offers the ultimate coastal living experience in Negombo. Featuring contemporary architecture with floor-to-ceiling windows that frame breathtaking ocean views, this property is a rare gem on Sri Lanka's western coast.

The open-plan living area flows seamlessly onto a spacious terrace, perfect for entertaining or enjoying serene sunsets. The gourmet kitchen is equipped with premium appliances and a large island. Each bedroom is a private retreat with en-suite bathrooms and walk-in closets.

The landscaped garden features a private infinity pool overlooking the sea, a BBQ area, and mature tropical plants. Located just minutes from Negombo's vibrant restaurants, boutiques, and the international airport.`,
        amenities: [
            "Swimming Pool",
            "Air Conditioning",
            "Garden",
            "Parking",
            "Security",
            "CCTV",
            "Hot Water",
            "Backup Generator",
            "Gym",
            "Rooftop Terrace",
        ],
        coordinates: { lat: 7.2094, lng: 79.8358 },
        nearbyPlaces: [
            { name: "Negombo Beach", distance: "0.3 km", type: "Beach" },
            { name: "St. Joseph's College", distance: "1.2 km", type: "School" },
            { name: "Negombo General Hospital", distance: "2.5 km", type: "Hospital" },
            { name: "Keells Super", distance: "0.8 km", type: "Supermarket" },
        ],
        agent: {
            name: "Kasun Perera",
            company: "Century Lands & Homes",
            phone: "+94 77 123 4567",
            email: "kasun@centurylands.lk",
            whatsapp: "+94771234567",
            photo: "/mock/agent1.jpg",
        },
    },
    {
        id: 2,
        slug: "modern-city-apartment",
        title: "Modern City Apartment",
        tagline: "Heart of Colombo 07 | Panoramic city views",
        location: "Colombo 07",
        address: "15 Flower Road, Colombo 07",
        price: "LKR 4,500,000",
        pricePerSqft: "LKR 31,034",
        status: "For Sale",
        beds: 3,
        baths: 2,
        size: "1,450 sqft",
        landSize: "N/A",
        parking: 1,
        yearBuilt: 2023,
        propertyType: "Apartment",
        listingId: "CLH-1002",
        furnishing: "Semi Furnished",
        ownership: "Leasehold (99 years)",
        images: [
            "/mock/2.jpg",
            "/mock/3.jpg",
            "/mock/4.jpg",
            "/mock/5.jpg",
            "/mock/1.jpg",
        ],
        description: `Experience luxury urban living in this sleek modern apartment located in the prestigious Colombo 07 district. The open-concept design maximizes natural light and offers stunning panoramic views of the city skyline.

This thoughtfully designed space features high-end finishes throughout, including imported Italian tiles, German kitchen fittings, and smart home automation. The master suite includes a spa-like bathroom with rain shower and soaking tub.

Residents enjoy exclusive access to world-class amenities including a rooftop infinity pool, state-of-the-art fitness center, residents' lounge, and 24/7 concierge service. Walking distance to international schools, fine dining, and shopping.`,
        amenities: [
            "Swimming Pool",
            "Gym",
            "Parking",
            "Security",
            "CCTV",
            "Air Conditioning",
            "Elevator",
            "Concierge",
            "Smart Home",
            "Rooftop Terrace",
        ],
        coordinates: { lat: 6.9019, lng: 79.8612 },
        nearbyPlaces: [
            { name: "Cinnamon Gardens", distance: "0.5 km", type: "Landmark" },
            { name: "Royal College", distance: "1.0 km", type: "School" },
            { name: "Nawaloka Hospital", distance: "2.0 km", type: "Hospital" },
            { name: "Arpico Supercentre", distance: "0.6 km", type: "Supermarket" },
        ],
        agent: {
            name: "Amaya Fernando",
            company: "Century Lands & Homes",
            phone: "+94 77 234 5678",
            email: "amaya@centurylands.lk",
            whatsapp: "+94772345678",
            photo: "/mock/agent2.jpg",
        },
    },
    {
        id: 3,
        slug: "elegant-family-house",
        title: "Elegant Family House",
        tagline: "Surrounded by nature | Quiet neighborhood",
        location: "Kandy",
        address: "8 Hill Crest Lane, Kandy",
        price: "LKR 62,000,000",
        pricePerSqft: "LKR 22,143",
        status: "For Sale",
        beds: 5,
        baths: 4,
        size: "2,800 sqft",
        landSize: "20 Perches",
        parking: 3,
        yearBuilt: 2019,
        propertyType: "House",
        listingId: "CLH-1003",
        furnishing: "Semi Furnished",
        ownership: "Freehold",
        images: [
            "/mock/3.jpg",
            "/mock/4.jpg",
            "/mock/5.jpg",
            "/mock/1.jpg",
            "/mock/2.jpg",
        ],
        description: `Nestled in the lush green hills of Kandy, this elegant family home combines classic Sri Lankan architecture with modern comforts. The property sits on a generous 20-perch plot surrounded by mature trees and beautifully landscaped gardens.

The interior boasts spacious living and dining areas with polished teak wood floors, a modern chef's kitchen, and five generously sized bedrooms. The master suite features a private balcony with panoramic hill country views.

The grounds include a private garden, fruit trees, and a covered outdoor entertainment area. Located in a quiet, prestigious neighborhood just minutes from Kandy's cultural attractions, schools, and healthcare facilities.`,
        amenities: [
            "Garden",
            "Parking",
            "Security",
            "Hot Water",
            "Backup Generator",
            "Air Conditioning",
            "Solar Panels",
            "Servant Quarters",
            "Study Room",
            "Pantry",
        ],
        coordinates: { lat: 7.2906, lng: 80.6337 },
        nearbyPlaces: [
            { name: "Temple of the Tooth", distance: "3.0 km", type: "Landmark" },
            { name: "Trinity College", distance: "2.0 km", type: "School" },
            { name: "Kandy General Hospital", distance: "2.5 km", type: "Hospital" },
            { name: "Cargills Food City", distance: "1.5 km", type: "Supermarket" },
        ],
        agent: {
            name: "Nimal Jayawardena",
            company: "Century Lands & Homes",
            phone: "+94 77 345 6789",
            email: "nimal@centurylands.lk",
            whatsapp: "+94773456789",
            photo: "/mock/agent1.jpg",
        },
    },
    {
        id: 4,
        slug: "lake-view-residence",
        title: "Lake View Residence",
        tagline: "Misty mountains | Serene lakefront living",
        location: "Nuwara Eliya",
        address: "22 Lake Gregory Road, Nuwara Eliya",
        price: "LKR 78,000,000",
        pricePerSqft: "LKR 31,200",
        status: "For Sale",
        beds: 4,
        baths: 3,
        size: "2,500 sqft",
        landSize: "12 Perches",
        parking: 2,
        yearBuilt: 2020,
        propertyType: "Villa",
        listingId: "CLH-1004",
        furnishing: "Fully Furnished",
        ownership: "Freehold",
        images: [
            "/mock/4.jpg",
            "/mock/5.jpg",
            "/mock/1.jpg",
            "/mock/2.jpg",
            "/mock/3.jpg",
        ],
        description: `This exquisite lakefront residence in Nuwara Eliya offers a rare opportunity to own a slice of paradise in Sri Lanka's hill country. Overlooking the serene Gregory Lake, the property combines colonial charm with contemporary luxury.

The residence features a grand entrance, formal living and dining rooms with fireplaces, a modern kitchen, and four beautifully appointed bedrooms. Large windows throughout maximize the stunning lake and mountain views.

Set in manicured gardens with a private pathway to the lake, this property is perfect as a family retreat or luxury holiday home. Minutes from Nuwara Eliya's golf course, tea plantations, and nature trails.`,
        amenities: [
            "Garden",
            "Parking",
            "Security",
            "Hot Water",
            "Fireplace",
            "Backup Generator",
            "Servant Quarters",
            "Wine Cellar",
            "Library",
            "Lake Access",
        ],
        coordinates: { lat: 6.9497, lng: 80.7891 },
        nearbyPlaces: [
            { name: "Gregory Lake", distance: "0.1 km", type: "Landmark" },
            { name: "St. Andrew's Church", distance: "1.0 km", type: "Landmark" },
            { name: "District Hospital", distance: "2.0 km", type: "Hospital" },
            { name: "Keells Super", distance: "1.8 km", type: "Supermarket" },
        ],
        agent: {
            name: "Kasun Perera",
            company: "Century Lands & Homes",
            phone: "+94 77 123 4567",
            email: "kasun@centurylands.lk",
            whatsapp: "+94771234567",
            photo: "/mock/agent1.jpg",
        },
    },
    {
        id: 5,
        slug: "minimalist-urban-loft",
        title: "Minimalist Urban Loft",
        tagline: "Open concept | Creative lifestyle space",
        location: "Colombo 05",
        address: "77 Havelock Road, Colombo 05",
        price: "LKR 36,000,000",
        pricePerSqft: "LKR 30,000",
        status: "For Rent",
        beds: 2,
        baths: 2,
        size: "1,200 sqft",
        landSize: "N/A",
        parking: 1,
        yearBuilt: 2022,
        propertyType: "Apartment",
        listingId: "CLH-1005",
        furnishing: "Fully Furnished",
        ownership: "Leasehold (99 years)",
        images: [
            "/mock/5.jpg",
            "/mock/1.jpg",
            "/mock/2.jpg",
            "/mock/3.jpg",
            "/mock/4.jpg",
        ],
        description: `A stunning minimalist loft in the heart of Colombo 05, designed for the modern creative professional. The industrial-chic aesthetic features exposed concrete ceilings, polished concrete floors, and floor-to-ceiling glass walls.

The open-concept layout combines living, dining, and workspace in a light-filled environment. The custom-designed kitchen features high-end smeg appliances and a waterfall quartz island. Both bedrooms are generous in size with built-in wardrobes.

Located in one of Colombo's most vibrant neighborhoods, with cafés, art galleries, and boutique shops at your doorstep. The building offers secure parking, a rooftop lounge, and a co-working space.`,
        amenities: [
            "Air Conditioning",
            "Parking",
            "Security",
            "CCTV",
            "Elevator",
            "Smart Home",
            "High-Speed WiFi",
            "Rooftop Lounge",
            "Co-Working Space",
            "Laundry Room",
        ],
        coordinates: { lat: 6.8882, lng: 79.8625 },
        nearbyPlaces: [
            { name: "Havelock City Mall", distance: "0.3 km", type: "Shopping" },
            { name: "Colombo International School", distance: "1.5 km", type: "School" },
            { name: "Lanka Hospitals", distance: "2.0 km", type: "Hospital" },
            { name: "Arpico Supercentre", distance: "0.5 km", type: "Supermarket" },
        ],
        agent: {
            name: "Amaya Fernando",
            company: "Century Lands & Homes",
            phone: "+94 77 234 5678",
            email: "amaya@centurylands.lk",
            whatsapp: "+94772345678",
            photo: "/mock/agent2.jpg",
        },
    },
    {
        id: 6,
        slug: "tropical-garden-villa",
        title: "Tropical Garden Villa",
        tagline: "Private oasis | Resort-style living",
        location: "Bentota",
        address: "18 River Avenue, Bentota",
        price: "LKR 104,000,000",
        pricePerSqft: "LKR 28,889",
        status: "For Sale",
        beds: 5,
        baths: 4,
        size: "3,600 sqft",
        landSize: "25 Perches",
        parking: 3,
        yearBuilt: 2020,
        propertyType: "Villa",
        listingId: "CLH-1006",
        furnishing: "Fully Furnished",
        ownership: "Freehold",
        images: [
            "/mock/6.jpg",
            "/mock/7.jpg",
            "/mock/1.jpg",
            "/mock/2.jpg",
            "/mock/3.jpg",
        ],
        description: `A magnificent tropical villa set within a lush 25-perch private garden in Bentota. This resort-style property is the perfect blend of luxury and nature, offering complete privacy and tranquility.

The villa features an expansive open living pavilion, a professional kitchen, and five luxurious bedroom suites. Traditional Sri Lankan design elements are seamlessly integrated with modern amenities. The master suite occupies the entire upper floor with panoramic garden views.

The grounds are a tropical paradise featuring an infinity pool, outdoor rain shower, meditation pavilion, and a variety of exotic plants and fruit trees. Minutes from Bentota Beach and the Bentota River for water sports.`,
        amenities: [
            "Swimming Pool",
            "Garden",
            "Air Conditioning",
            "Parking",
            "Security",
            "CCTV",
            "Hot Water",
            "Backup Generator",
            "Outdoor Shower",
            "BBQ Area",
        ],
        coordinates: { lat: 6.4245, lng: 80.0000 },
        nearbyPlaces: [
            { name: "Bentota Beach", distance: "0.5 km", type: "Beach" },
            { name: "Bentota International School", distance: "2.0 km", type: "School" },
            { name: "Bentota Hospital", distance: "3.0 km", type: "Hospital" },
            { name: "Food City", distance: "1.0 km", type: "Supermarket" },
        ],
        agent: {
            name: "Nimal Jayawardena",
            company: "Century Lands & Homes",
            phone: "+94 77 345 6789",
            email: "nimal@centurylands.lk",
            whatsapp: "+94773456789",
            photo: "/mock/agent1.jpg",
        },
    },
    {
        id: 7,
        slug: "cozy-suburban-home",
        title: "Cozy Suburban Home",
        tagline: "Family-friendly | Great neighborhood",
        location: "Gampaha",
        address: "5 Temple Road, Gampaha",
        price: "LKR 52,000,000",
        pricePerSqft: "LKR 27,368",
        status: "For Sale",
        beds: 3,
        baths: 2,
        size: "1,900 sqft",
        landSize: "10 Perches",
        parking: 2,
        yearBuilt: 2018,
        propertyType: "House",
        listingId: "CLH-1007",
        furnishing: "Semi Furnished",
        ownership: "Freehold",
        images: [
            "/mock/7.jpg",
            "/mock/1.jpg",
            "/mock/2.jpg",
            "/mock/3.jpg",
            "/mock/4.jpg",
        ],
        description: `A charming family home in a quiet, established neighborhood in Gampaha. This well-maintained property offers comfortable modern living with spacious rooms and a beautiful garden.

The home features a welcoming living room, a separate dining area, a well-equipped kitchen, and three spacious bedrooms. The master bedroom includes an en-suite bathroom and a private balcony. Large windows ensure plenty of natural light throughout.

The property includes a mature garden with a covered patio, ideal for outdoor dining and family gatherings. Located close to reputed schools, healthcare facilities, supermarkets, and public transport. An excellent investment for growing families.`,
        amenities: [
            "Garden",
            "Parking",
            "Hot Water",
            "Security",
            "Backup Generator",
            "Study Room",
            "Servant Quarters",
            "Pantry",
        ],
        coordinates: { lat: 7.0840, lng: 80.0098 },
        nearbyPlaces: [
            { name: "Gampaha Town", distance: "1.0 km", type: "City Center" },
            { name: "Taxila Central College", distance: "1.5 km", type: "School" },
            { name: "Gampaha District Hospital", distance: "2.0 km", type: "Hospital" },
            { name: "Keells Super", distance: "0.8 km", type: "Supermarket" },
        ],
        agent: {
            name: "Kasun Perera",
            company: "Century Lands & Homes",
            phone: "+94 77 123 4567",
            email: "kasun@centurylands.lk",
            whatsapp: "+94771234567",
            photo: "/mock/agent1.jpg",
        },
    },
    {
        id: 8,
        slug: "mountain-view-retreat",
        title: "Mountain View Retreat",
        tagline: "Serene mountain views | Perfect getway",
        location: "Ella",
        address: "Ella-Passara Road, Ella",
        price: "LKR 45,000,000",
        pricePerSqft: "LKR 22,500",
        status: "For Sale",
        beds: 3,
        baths: 2,
        size: "2,000 sqft",
        landSize: "30 Perches",
        parking: 2,
        yearBuilt: 2022,
        propertyType: "Villa",
        listingId: "CLH-1008",
        furnishing: "Fully Furnished",
        ownership: "Freehold",
        images: ["/mock/1.jpg", "/mock/2.jpg", "/mock/3.jpg"],
        description: "Escape to the tranquility of Ella mountains with this stunning 3-bedroom retreat. This property offers breathtaking panoramic views of the famous Ella Gap and the surrounding tea plantations. Designed with a blend of rustic charm and modern luxury, the villa features high wooden ceilings, cozy fireplaces, and expansive glass windows that bring nature closer to you. A great investment for a holiday home or a high-yield boutique rental.",
        amenities: ["Mountain View", "Fireplace", "Parking", "Security", "High-Speed WiFi", "Large Deck", "Garden", "Solar Hot Water", "Study Area"],
        coordinates: { lat: 6.8722, lng: 81.0456 },
        nearbyPlaces: [
            { name: "Little Adam's Peak", distance: "1.2 km", type: "Hiking" },
            { name: "Ella Railway Station", distance: "2.5 km", type: "Transport" },
            { name: "Nine Arches Bridge", distance: "3.5 km", type: "Landmark" },
        ],
        agent: {
            name: "Kasun Perera",
            company: "Century Lands & Homes",
            phone: "+94 77 123 4567",
            email: "kasun@centurylands.lk",
            whatsapp: "+94771234567",
            photo: "/mock/agent1.jpg",
        }
    },
    {
        id: 9,
        slug: "coastal-luxury-apartment",
        title: "Coastal Luxury Apartment",
        tagline: "Unmatched ocean breeze | Modern seaside living",
        location: "Tangalle",
        address: "Tangalle Road, Tangalle",
        price: "LKR 65,000,000",
        pricePerSqft: "LKR 36,111",
        status: "For Sale",
        beds: 2,
        baths: 2,
        size: "1,800 sqft",
        landSize: "N/A",
        parking: 1,
        yearBuilt: 2023,
        propertyType: "Apartment",
        listingId: "CLH-1009",
        furnishing: "Semi Furnished",
        ownership: "Freehold",
        images: ["/mock/2.jpg", "/mock/3.jpg", "/mock/4.jpg"],
        description: "Experience the epitome of coastal luxury in this brand new oceanfront apartment in Tangalle. This exclusive residence offers unobstructed views of the Indian Ocean from every room. With high-end finishes, an open-concept living area, and a large private terrace, it's perfect for those seeking a premium lifestyle by the sea. Residents also benefit from a private beach club and rooftop pool access.",
        amenities: ["Beach Access", "Rooftop Pool", "Security", "CCTV", "Lobby", "Elevator", "Backup Power", "Terrace", "Ocean View"],
        coordinates: { lat: 6.0244, lng: 80.7936 },
        nearbyPlaces: [
            { name: "Tangalle Beach", distance: "0.1 km", type: "Beach" },
            { name: "Rekawa Lagoon", distance: "5.0 km", type: "Nature" },
            { name: "Tangalle City", distance: "2.0 km", type: "City Center" },
        ],
        agent: {
            name: "Amaya Fernando",
            company: "Century Lands & Homes",
            phone: "+94 77 234 5678",
            email: "amaya@centurylands.lk",
            whatsapp: "+94772345678",
            photo: "/mock/agent2.jpg",
        }
    },
    {
        id: 10,
        slug: "heritage-fort-house",
        title: "Heritage Fort House",
        tagline: "Historic charm | Within the walls of Galle Fort",
        location: "Galle Fort",
        address: "Leyn Baan Street, Galle Fort",
        price: "LKR 125,000,000",
        pricePerSqft: "LKR 41,666",
        status: "Sold",
        beds: 4,
        baths: 4,
        size: "3,000 sqft",
        landSize: "8 Perches",
        parking: 1,
        yearBuilt: 1950,
        propertyType: "House",
        listingId: "CLH-1010",
        furnishing: "Antique Furnished",
        ownership: "Freehold",
        images: ["/mock/4.jpg", "/mock/5.jpg", "/mock/6.jpg"],
        description: "A rare opportunity to own a meticulously restored heritage house within the UNESCO World Heritage site of Galle Fort. This colonial-era property captures the essence of old-world charm with its grand archways, high ceilings, and courtyard gardens. While retaining its historical character, the house has been updated with modern plumbing, electricity, and luxurious bathrooms. Perfect as a prestigious residence or an boutique guest house.",
        amenities: ["Heritage Site", "Courtyard", "Security", "Garden", "Study Room", "Staff Quarters", "Luxury Bathrooms", "Air Conditioning"],
        coordinates: { lat: 6.0262, lng: 80.2176 },
        nearbyPlaces: [
            { name: "Galle Fort Lighthouse", distance: "0.5 km", type: "Landmark" },
            { name: "Old Dutch Hospital", distance: "0.4 km", type: "Dining" },
            { name: "Galle Cricket Stadium", distance: "1.0 km", type: "Sports" },
        ],
        agent: {
            name: "Nimal Jayawardena",
            company: "Century Lands & Homes",
            phone: "+94 77 345 6789",
            email: "nimal@centurylands.lk",
            whatsapp: "+94773456789",
            photo: "/mock/agent1.jpg",
        }
    },
]

export function getPropertyById(id: number): Property | undefined {
    return properties.find((p) => p.id === id)
}

export function getPropertyBySlug(slug: string): Property | undefined {
    return properties.find((p) => p.slug === slug)
}

export function getSimilarProperties(property: Property, limit = 4): Property[] {
    return properties
        .filter(
            (p) =>
                p.id !== property.id &&
                (p.location === property.location || p.propertyType === property.propertyType)
        )
        .slice(0, limit)
}

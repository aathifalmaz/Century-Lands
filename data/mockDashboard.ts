export const mockDashboard = {
    stats: [
        { label: "Saved Properties", value: 12, icon: "Heart", href: "/dashboard/saved" },
        { label: "Upcoming Appointments", value: 3, icon: "Calendar", href: "/dashboard/appointments" },
        { label: "Inquiries Sent", value: 7, icon: "MessageSquare", href: "/dashboard/inquiries" },
        { label: "Viewed Properties", value: 25, icon: "Eye", href: "#" },
    ],
    recentActivity: [
        {
            id: 1,
            type: "appointment",
            message: "Site visit confirmed 'Luxury Villa in Colombo 7'",
            date: "2 hours ago",
        },
        {
            id: 2,
            type: "inquiry",
            message: "Agent replied to your inquiry about 'Kandy Commercial Plot'",
            date: "1 day ago",
        },
        {
            id: 3,
            type: "saved",
            message: "You saved 'Beachfront Land in Galle'",
            date: "2 days ago",
        },
        {
            id: 4,
            type: "appointment",
            message: "Upcoming: 'Modern City Apartment' viewing",
            date: "1 hour ago",
        },
        {
            id: 5,
            type: "inquiry",
            message: "New message from Agent Sarah about 'Havelock City'",
            date: "3 hours ago",
        },
    ],
    upcomingAppointments: [
        {
            id: 101,
            property: "Luxury Villa in Colombo 7",
            date: "Feb 15, 2024",
            time: "10:00 AM",
            agent: "Kamal Perera",
            status: "Confirmed",
        },
        {
            id: 102,
            property: "Apartment in Havelock City",
            date: "Feb 18, 2024",
            time: "2:30 PM",
            agent: "Sarah Silva",
            status: "Pending",
        },
        {
            id: 103,
            property: "Modern City Apartment",
            date: "Feb 20, 2024",
            time: "11:00 AM",
            agent: "John Doe",
            status: "Confirmed",
        },
        {
            id: 104,
            property: "Elegant Family House",
            date: "Feb 22, 2024",
            time: "3:00 PM",
            agent: "Michael Wick",
            status: "Pending",
        },
    ]
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Plus, Search, ChevronLeft, ChevronRight, MapPin, Tag, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { BackgroundDecor } from "@/components/BackgroundDecor";

import { getProperties, deleteProperty } from "@/lib/backend/properties"
import { toast } from "sonner"

const ITEMS_PER_PAGE = 10

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("All")
    const [filterStatus, setFilterStatus] = useState("All")
    const [filterPrice, setFilterPrice] = useState("All")
    const [currentPage, setCurrentPage] = useState(1)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        setLoading(true)
        try {
            const data = await getProperties()
            setProperties(data)
        } catch (error) {
            toast.error("Failed to fetch properties")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return

        try {
            await deleteProperty(id)
            toast.success("Property deleted successfully")
            fetchProperties()
        } catch (error) {
            toast.error("Failed to delete property")
        }
    }

    // Helper to parse price string "LKR 8,500,000" -> 8500000
    const parsePrice = (priceStr: string) => {
        return parseInt(priceStr.replace(/\D/g, '')) || 0
    }

    // Filter properties
    const filteredProperties = properties.filter(property => {
        // Search
        const matchesSearch =
            (property.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.location || "").toLowerCase().includes(searchTerm.toLowerCase())

        // Type Filter
        const matchesType = filterType === "All" || property.propertyType === filterType

        // Status Filter
        const matchesStatus = filterStatus === "All" || property.status === filterStatus

        // Price Filter
        let matchesPrice = true
        if (filterPrice !== "All") {
            const price = parsePrice(property.price)
            if (filterPrice === "under_10m") matchesPrice = price < 10000000
            else if (filterPrice === "10m_50m") matchesPrice = price >= 10000000 && price <= 50000000
            else if (filterPrice === "50m_100m") matchesPrice = price > 50000000 && price <= 100000000
            else if (filterPrice === "above_100m") matchesPrice = price > 100000000
        }

        return matchesSearch && matchesType && matchesStatus && matchesPrice
    })

    // Pagination
    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE)
    const paginatedProperties = filteredProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterType, filterStatus, filterPrice])

    return (
        <div className="p-4 pt-1 sm:pt-4 space-y-4">
            <BackgroundDecor />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Properties</h2>
                    <p className="text-muted-foreground text-sm">Manage your property listings.</p>
                </div>
                <Link href="/admin/properties/add">
                    <Button className="hover:bg-secondary w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Add Property
                    </Button>
                </Link>
            </div>

            {/* Search + Filter Toggle */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <div className="relative flex-1 bg-white rounded-md">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search properties..."
                            className="pl-9 w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="outline"
                        className="lg:hidden bg-white shrink-0"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                    </Button>
                </div>

                {/* Filters - always visible on desktop, toggle on mobile */}
                <div className={`flex flex-col sm:flex-row gap-2 ${showFilters ? 'flex' : 'hidden lg:flex'}`}>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
                            <SelectValue placeholder="Property Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Types</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="Villa">Villa</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Statuses</SelectItem>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="For Rent">For Rent</SelectItem>
                            <SelectItem value="Sold">Sold</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterPrice} onValueChange={setFilterPrice}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white">
                            <SelectValue placeholder="Price Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Prices</SelectItem>
                            <SelectItem value="under_10m">Under 10M</SelectItem>
                            <SelectItem value="10m_50m">10M - 50M</SelectItem>
                            <SelectItem value="50m_100m">50M - 100M</SelectItem>
                            <SelectItem value="above_100m">Above 100M</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block border rounded-md bg-white">
                <Table>
                    <TableHeader className="bg-slate-100">
                        <TableRow>
                            <TableHead className="w-[100px] pl-10">Image</TableHead>
                            <TableHead className="pl-12">Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    Loading properties...
                                </TableCell>
                            </TableRow>
                        ) : paginatedProperties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedProperties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell className="pl-10">
                                        <div className="relative h-10 w-16 overflow-hidden rounded-md bg-slate-200">
                                            <NextImage
                                                src={(property.images && property.images.length > 0) ? property.images[0] : "/placeholder.png"}
                                                alt={property.title || "Property Image"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium pl-12">
                                        {property.title}
                                    </TableCell>
                                    <TableCell>{property.location}</TableCell>
                                    <TableCell>{property.price}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            property.status === "For Sale" ? "default" :
                                                property.status === "For Rent" ? "secondary" : "destructive"
                                        }>
                                            {property.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{property.propertyType}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={`/admin/properties/${property.id}`}>
                                                    <DropdownMenuItem>
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(property.id)}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-muted-foreground">Loading properties...</div>
                ) : paginatedProperties.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No results.</div>
                ) : (
                    paginatedProperties.map((property) => (
                        <Card key={property.id} className="overflow-hidden bg-white border shadow-sm">
                            <CardContent className="p-0">
                                <div className="flex gap-3 p-3">
                                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                                        <NextImage
                                            src={(property.images && property.images.length > 0) ? property.images[0] : "/placeholder.png"}
                                            alt={property.title || "Property Image"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-sm truncate pr-2">{property.title}</h3>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-7 w-7 p-0 shrink-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <Link href={`/admin/properties/${property.id}`}>
                                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(property.id)}>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                            <MapPin className="h-3 w-3" />
                                            <span className="truncate">{property.location}</span>
                                        </div>
                                        <p className="text-sm font-bold text-primary mt-1">{property.price}</p>
                                        <div className="flex gap-1.5 mt-1.5">
                                            <Badge variant={
                                                property.status === "For Sale" ? "default" :
                                                    property.status === "For Rent" ? "secondary" : "destructive"
                                            } className="text-[10px] h-5">
                                                {property.status}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] h-5">
                                                <Tag className="h-2.5 w-2.5 mr-1" />
                                                {property.propertyType}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProperties.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length}
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-1 order-1 sm:order-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="h-8 w-8 p-0 text-xs"
                            >
                                {page}
                            </Button>
                        ))}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 w-8 p-0"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

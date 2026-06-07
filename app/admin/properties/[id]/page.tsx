"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { useParams, useRouter } from "next/navigation"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { getAgents, getPropertyById, updateProperty } from "@/lib/backend/properties"
import { toast } from "sonner"

export default function EditPropertyPage() {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [agents, setAgents] = useState<any[]>([])
    const [customPropertyType, setCustomPropertyType] = useState("")

    const [formData, setFormData] = useState({
        title: "",
        price: "",
        property_type: "house",
        description: "",
        address: "",
        location: "",
        district: "colombo",
        beds: 0,
        baths: 0,
        size: "",
        land_size: "",
        status: "For Sale",
        agent_id: "",
        parking_spots: 0,
        year_built: new Date().getFullYear(),
        furnishing: "Unfurnished",
        ownership: "Freehold"
    })

    useEffect(() => {
        async function fetchData() {
            if (!id) return

            setLoading(true)
            try {
                // Fetch Agents
                const agentsData = await getAgents()
                setAgents(agentsData)

                // Fetch Property
                const property = await getPropertyById(id)

                if (property) {
                    const isPredefined = ["house", "land", "commercial", "apartment"].includes(property.property_type)
                    const displayType = isPredefined ? (property.property_type || "house") : "other"
                    
                    if (!isPredefined && property.property_type) {
                        setCustomPropertyType(property.property_type)
                    }

                    setFormData({
                        title: property.title || "",
                        price: property.price || "",
                        property_type: displayType,
                        description: property.description || "",
                        address: property.address || "",
                        location: property.location || "",
                        district: property.district || "colombo",
                        beds: property.beds || 0,
                        baths: property.baths || 0,
                        size: property.size || "",
                        land_size: property.land_size || "",
                        status: property.status || "For Sale",
                        agent_id: property.agent_id?.toString() || "",
                        parking_spots: property.parking_spots || 0,
                        year_built: property.year_built || new Date().getFullYear(),
                        furnishing: property.furnishing || "Unfurnished",
                        ownership: property.ownership || "Freehold"
                    })
                    setImages(property.images || [])
                }
            } catch (error) {
                toast.error("Failed to load property data")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploading(true)
            const files = Array.from(e.target.files)

            for (const file of files) {
                try {
                    const formData = new FormData()
                    formData.append("file", file)
                    const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData
                    })
                    if (!res.ok) throw new Error("Upload failed")
                    const data = await res.json()
                    setImages(prev => [...prev, data.url])
                } catch (err) {
                    console.error("Upload failed", err)
                    toast.error(`Failed to upload ${file.name}`)
                }
            }
            setUploading(false)
        }
    }

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            if (formData.property_type === "other" && !customPropertyType.trim()) {
                toast.error("Please enter a custom property type.")
                setSaving(false)
                return
            }

            const finalPropertyType = formData.property_type === "other"
                ? customPropertyType.trim()
                : formData.property_type

            const finalFormData = {
                ...formData,
                property_type: finalPropertyType
            }

            await updateProperty(id, finalFormData, images)
            toast.success("Property updated successfully")
            router.push("/admin/properties")
        } catch (err) {
            console.error("Failed to update property", err)
            toast.error("Error updating property. Please try again.")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-4 space-y-4">
            <BackgroundDecor />
            {/* Header */}
            <div className="flex items-center gap-2">
                <Link href="/admin/properties">
                    <Button variant="outline" size="icon" className="h-8 w-8 mr-2" disabled={saving}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Property</h2>
                    <p className="text-muted-foreground">Modify your property listing.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" className="hover:bg-accent" disabled={saving}>Discard</Button>
                    <Button className="hover:bg-secondary" onClick={handleSave} disabled={saving || uploading}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Updates
                    </Button>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Left Column: Details */}
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Details</CardTitle>
                            <CardDescription>Basic information about the property.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Property Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (LKR)</Label>
                                    <Input
                                        id="price"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Property Type</Label>
                                    <Select
                                        value={formData.property_type}
                                        onValueChange={(val) => setFormData({ ...formData, property_type: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="house">House</SelectItem>
                                            <SelectItem value="land">Land</SelectItem>
                                            <SelectItem value="commercial">Commercial</SelectItem>
                                            <SelectItem value="apartment">Apartment</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {formData.property_type === "other" && (
                                <div className="space-y-2 p-4 bg-muted/40 rounded-xl border border-dashed border-border/80 animate-in slide-in-from-top duration-300">
                                    <Label htmlFor="custom_property_type" className="font-semibold text-primary">Specify Custom Property Type</Label>
                                    <Input
                                        id="custom_property_type"
                                        placeholder="e.g. Penthouse, Townhouse, Cabin, Warehouse"
                                        value={customPropertyType}
                                        onChange={(e) => setCustomPropertyType(e.target.value)}
                                        className="bg-white"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    className="min-h-[150px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Location</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">City/Town</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district">District</Label>
                                    <Select
                                        value={formData.district}
                                        onValueChange={(val) => setFormData({ ...formData, district: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select district" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="colombo">Colombo</SelectItem>
                                            <SelectItem value="gampaha">Gampaha</SelectItem>
                                            <SelectItem value="kandy">Kandy</SelectItem>
                                            <SelectItem value="galle">Galle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Features</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beds">Bedrooms</Label>
                                    <Input
                                        id="beds"
                                        type="number"
                                        value={formData.beds}
                                        onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="baths">Bathrooms</Label>
                                    <Input
                                        id="baths"
                                        type="number"
                                        value={formData.baths}
                                        onChange={(e) => setFormData({ ...formData, baths: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="size">Floor Area (sqft)</Label>
                                    <Input
                                        id="size"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="landSize">Land Size</Label>
                                    <Input
                                        id="landSize"
                                        value={formData.land_size}
                                        onChange={(e) => setFormData({ ...formData, land_size: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: Media & Status */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Agent</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Availability</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(val) => setFormData({ ...formData, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="For Sale">For Sale</SelectItem>
                                        <SelectItem value="For Rent">For Rent</SelectItem>
                                        <SelectItem value="Sold">Sold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Assigned Agent</Label>
                                <Select
                                    value={formData.agent_id}
                                    onValueChange={(val) => setFormData({ ...formData, agent_id: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map(agent => (
                                            <SelectItem key={agent.id} value={agent.id.toString()}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>Manage images.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    multiple
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    disabled={uploading}
                                />
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                                ) : (
                                    <Upload className="h-8 w-8 text-muted-foreground mb-4" />
                                )}
                                <p className="text-sm font-medium">{uploading ? "Uploading..." : "Click to upload"}</p>
                            </div>

                            {/* Image Preview Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {images.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border group">
                                        <NextImage src={img} alt="Preview" fill className="object-cover" />
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

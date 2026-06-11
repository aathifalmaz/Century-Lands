"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import NextImage from "next/image"
import { BackgroundDecor } from "@/components/BackgroundDecor"
import { useRouter } from "next/navigation"
import { createProperty } from "@/lib/backend/properties"
import { toast } from "sonner"

export default function AddPropertyPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageFiles, setImageFiles] = useState<{ file: File, preview: string }[]>([])
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
        parking_spots: 0,
        year_built: new Date().getFullYear(),
        furnishing: "Unfurnished",
        ownership: "Freehold"
    })

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault()
            e.returnValue = ''
        }
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [])

    const BackConfirmDialog = ({ children }: { children: React.ReactNode }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to discard?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your informations are not saved. Are you sure you want to discard?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.push("/admin/properties")}>Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            const newImageFiles = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
            setImageFiles(prev => [...prev, ...newImageFiles])
            
            // Clear the input value so the same file can be selected again
            e.target.value = ""
        }
    }

    const removeImage = (index: number) => {
        const item = imageFiles[index]
        if (item) URL.revokeObjectURL(item.preview)
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            setUploading(true)
            const uploadedUrls: string[] = []
            
            for (const img of imageFiles) {
                const uploadData = new FormData()
                uploadData.append("file", img.file)
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData
                })
                if (!res.ok) throw new Error("Upload failed for " + img.file.name)
                const data = await res.json()
                uploadedUrls.push(data.url)
            }

            if (formData.property_type === "other" && !customPropertyType.trim()) {
                toast.error("Please enter a custom property type.")
                setLoading(false)
                setUploading(false)
                return
            }

            const finalPropertyType = formData.property_type === "other"
                ? customPropertyType.trim()
                : formData.property_type

            const finalFormData = {
                ...formData,
                property_type: finalPropertyType
            }

            await createProperty(finalFormData, uploadedUrls)
            toast.success("Property created successfully")
            router.push("/admin/properties")
        } catch (err: any) {
            console.error("Failed to save property", err)
            toast.error(`Error: ${err.message || "Failed to save property"}. Please try again.`)
        } finally {
            setUploading(false)
            setLoading(false)
        }
    }

    return (
        <div className="p-4 pt-1 sm:pt-4 space-y-4">
            <BackgroundDecor />
            {/* Header */}
            <div className="flex items-center gap-2">
                <BackConfirmDialog>
                    <Button variant="outline" size="icon" className="h-8 w-8 mr-2 cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </BackConfirmDialog>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Add Property</h2>
                    <p className="text-muted-foreground">Create a new property listing.</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <BackConfirmDialog>
                        <Button variant="outline" className="hover:bg-accent" disabled={loading || uploading}>Discard</Button>
                    </BackConfirmDialog>
                    <Button className="hover:bg-secondary" onClick={handleSave} disabled={loading || uploading}>
                        {(loading || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {uploading ? "Uploading Images..." : "Save Property"}
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
                                    placeholder="e.g. Luxury Villa in Colombo 7"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (LKR)</Label>
                                    <Input
                                        id="price"
                                        placeholder="e.g. 45,000,000"
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
                                    placeholder="Describe the property features..."
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
                                        placeholder="Full address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">City/Town</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g. Colombo 07"
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
                                            <SelectItem value="ampara">Ampara</SelectItem>
                                            <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                                            <SelectItem value="badulla">Badulla</SelectItem>
                                            <SelectItem value="batticaloa">Batticaloa</SelectItem>
                                            <SelectItem value="colombo">Colombo</SelectItem>
                                            <SelectItem value="galle">Galle</SelectItem>
                                            <SelectItem value="gampaha">Gampaha</SelectItem>
                                            <SelectItem value="hambantota">Hambantota</SelectItem>
                                            <SelectItem value="jaffna">Jaffna</SelectItem>
                                            <SelectItem value="kalutara">Kalutara</SelectItem>
                                            <SelectItem value="kandy">Kandy</SelectItem>
                                            <SelectItem value="kegalle">Kegalle</SelectItem>
                                            <SelectItem value="kilinochchi">Kilinochchi</SelectItem>
                                            <SelectItem value="kurunegala">Kurunegala</SelectItem>
                                            <SelectItem value="mannar">Mannar</SelectItem>
                                            <SelectItem value="matale">Matale</SelectItem>
                                            <SelectItem value="matara">Matara</SelectItem>
                                            <SelectItem value="moneragala">Moneragala</SelectItem>
                                            <SelectItem value="mullaitivu">Mullaitivu</SelectItem>
                                            <SelectItem value="nuwara eliya">Nuwara Eliya</SelectItem>
                                            <SelectItem value="polonnaruwa">Polonnaruwa</SelectItem>
                                            <SelectItem value="puttalam">Puttalam</SelectItem>
                                            <SelectItem value="ratnapura">Ratnapura</SelectItem>
                                            <SelectItem value="trincomalee">Trincomalee</SelectItem>
                                            <SelectItem value="vavuniya">Vavuniya</SelectItem>
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
                                        placeholder="2500"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="landSize">Land Size</Label>
                                    <Input
                                        id="landSize"
                                        placeholder="15 Perches"
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

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Media</CardTitle>
                            <CardDescription>Upload images to Cloudflare R2.</CardDescription>
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
                                <p className="text-xs text-muted-foreground mt-1">Multi-select supported</p>
                            </div>

                            {/* Image Preview Grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {imageFiles.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border group bg-slate-100">
                                        <img src={img.preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
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

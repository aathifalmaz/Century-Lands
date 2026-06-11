"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, Save, TrendingUp, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { getSalesRecords, updateSalesRecord, createSalesRecord, type SalesRecord as SoldProperty } from "@/lib/backend/sales"
import { getProperties } from "@/lib/backend/properties"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const ITEMS_PER_PAGE = 10

export default function AccountsPage() {
    const [soldProperties, setSoldProperties] = useState<SoldProperty[]>([])
    const [properties, setProperties] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
    const [soldPriceInput, setSoldPriceInput] = useState<string>("")
    const [percentageInput, setPercentageInput] = useState<string>("5")
    const [savingSale, setSavingSale] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const [editingId, setEditingId] = useState<number | null>(null)
    const [editValues, setEditValues] = useState<{ soldPrice: string; percentage: string }>({
        soldPrice: "",
        percentage: "",
    })

    useEffect(() => {
        fetchSoldProperties()
        fetchProperties()
    }, [])

    async function fetchSoldProperties() {
        try {
            const data = await getSalesRecords()
            setSoldProperties(data)
        } catch (error) {
            toast.error("Failed to fetch records")
        }
    }

    async function fetchProperties() {
        try {
            const data = await getProperties()
            setProperties(data)
        } catch (error) {
            console.error("Failed to fetch properties:", error)
        }
    }

    const handlePropertySelect = (id: string) => {
        setSelectedPropertyId(id)
        const prop = properties.find(p => p.id.toString() === id)
        if (prop) {
            const originalPrice = prop.price || "0"
            const parsedPrice = parseFloat(originalPrice.replace(/[^0-9.]/g, '')) || 0
            setSoldPriceInput(parsedPrice.toString())
        }
    }

    const handleRecordSale = async () => {
        if (!selectedPropertyId) {
            toast.error("Please select a property.")
            return
        }

        setSavingSale(true)
        try {
            const prop = properties.find(p => p.id.toString() === selectedPropertyId)
            if (!prop) throw new Error("Property not found")

            const soldPrice = parseFloat(soldPriceInput) || 0
            const percentage = parseFloat(percentageInput) || 0
            const commissionAmount = (soldPrice * percentage) / 100

            // 1. Create sales record in database
            await createSalesRecord({
                property_id: prop.id,
                title: prop.title,
                original_price: prop.price || "LKR 0",
                sold_price: soldPrice,
                commission_percentage: percentage,
                commission_amount: commissionAmount,
            })

            // 2. Update property status in properties table
            const { error: updateError } = await supabase
                .from('properties')
                .update({ status: 'Sold' })
                .eq('id', prop.id)

            if (updateError) throw updateError

            toast.success("Sale recorded successfully!")
            setIsDialogOpen(false)
            
            // Reset dialog state
            setSelectedPropertyId("")
            setSoldPriceInput("")
            setPercentageInput("5")

            // Refresh lists
            fetchSoldProperties()
            fetchProperties()
        } catch (error: any) {
            toast.error("Failed to record sale: " + error.message)
        } finally {
            setSavingSale(false)
        }
    }

    const handleEdit = (prop: SoldProperty) => {
        setEditingId(prop.id)
        setEditValues({
            soldPrice: (prop.sold_price || 0).toString(),
            percentage: (prop.commission_percentage || 0).toString(),
        })
    }

    const handleSave = async (id: number) => {
        const soldPrice = parseFloat(editValues.soldPrice) || 0
        const percentage = parseFloat(editValues.percentage) || 0
        const commissionAmount = (soldPrice * percentage) / 100

        try {
            await updateSalesRecord(id, {
                sold_price: soldPrice,
                commission_percentage: percentage,
                commission_amount: commissionAmount,
            })
            toast.success("Record updated")
            fetchSoldProperties()
            setEditingId(null)
        } catch (error) {
            toast.error("Could not update record")
        }
    }

    const totalCommission = soldProperties.reduce((sum, p) => sum + p.commission_amount, 0)

    const unsoldProperties = properties.filter(p => p.status !== "Sold")
    const liveSoldPrice = parseFloat(soldPriceInput) || 0
    const livePercentage = parseFloat(percentageInput) || 0
    const liveCommission = (liveSoldPrice * livePercentage) / 100

    // Pagination
    const totalPages = Math.ceil(soldProperties.length / ITEMS_PER_PAGE)
    const paginatedProperties = soldProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    return (
        <div className="p-4 pt-1 sm:p-8 space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-third">Accounts Management</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Record sales and calculate commissions for sold properties.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 rounded-xl h-11 px-5 shadow-md transition-all active:scale-[0.98] w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5" />
                        Record New Sale
                    </Button>
                    <div className="bg-emerald-500/10 px-4 sm:px-6 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-3 sm:gap-4 shadow-sm text-emerald-700">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider">Total Commission</p>
                            <p className="text-xl sm:text-2xl font-bold truncate">LKR {totalCommission.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] w-[95vw] rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-primary">Record New Property Sale</DialogTitle>
                        <DialogDescription>
                            Select an unsold property to record its final sale details and commission.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="property" className="font-semibold text-primary">Select Property</Label>
                            <Select value={selectedPropertyId} onValueChange={handlePropertySelect}>
                                <SelectTrigger className="w-full h-11 rounded-xl">
                                    <SelectValue placeholder="Select unsold property" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unsoldProperties.map(p => (
                                        <SelectItem key={p.id} value={p.id.toString()}>
                                            {p.title} ({p.price})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="soldPrice" className="font-semibold text-primary">Final Sold Price (LKR)</Label>
                                <Input
                                    id="soldPrice"
                                    type="number"
                                    placeholder="Enter sold price"
                                    value={soldPriceInput}
                                    onChange={(e) => setSoldPriceInput(e.target.value)}
                                    className="h-11 rounded-xl focus-visible:ring-emerald-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="percentage" className="font-semibold text-primary">Commission Rate (%)</Label>
                                <Input
                                    id="percentage"
                                    type="number"
                                    placeholder="Enter rate"
                                    value={percentageInput}
                                    onChange={(e) => setPercentageInput(e.target.value)}
                                    className="h-11 rounded-xl focus-visible:ring-emerald-500"
                                />
                            </div>
                        </div>

                        {selectedPropertyId && (
                            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col gap-1.5 animate-in fade-in duration-300">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Original Listing Price:</span>
                                    <span className="font-medium text-primary">
                                        {properties.find(p => p.id.toString() === selectedPropertyId)?.price || "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Final Sold Price:</span>
                                    <span className="font-medium text-emerald-700">LKR {liveSoldPrice.toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-emerald-100/60 my-1" />
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-emerald-800 text-sm">Commission Earned ({livePercentage}%):</span>
                                    <span className="font-bold text-emerald-700 text-lg">LKR {liveCommission.toLocaleString()}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                            className="rounded-xl h-11"
                            disabled={savingSale}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRecordSale}
                            disabled={savingSale || !selectedPropertyId || liveSoldPrice <= 0}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 font-semibold"
                        >
                            {savingSale ? "Recording..." : "Record Sale"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Desktop Table */}
            <Card className="hidden md:block border-border/60 shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-border/40 py-6">
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                        <Calculator className="h-6 w-6 text-emerald-500" />
                        Sales & Commission Records
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="font-bold py-4 pl-6 text-primary">Property Information</TableHead>
                                <TableHead className="font-bold text-primary">Original Price</TableHead>
                                <TableHead className="font-bold text-primary">Sold Price (LKR)</TableHead>
                                <TableHead className="font-bold text-primary">Comm. %</TableHead>
                                <TableHead className="font-bold text-primary">Commission Amount</TableHead>
                                <TableHead className="font-bold text-right pr-6 text-primary">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-border/40">
                            {paginatedProperties.map((prop) => (
                                <TableRow key={prop.id} className="hover:bg-emerald-50/30 transition-colors">
                                    <TableCell className="font-semibold text-primary py-5 pl-6">{prop.title}</TableCell>
                                    <TableCell className="text-muted-foreground">{prop.original_price}</TableCell>
                                    <TableCell>
                                        {editingId === prop.id ? (
                                            <Input
                                                type="number"
                                                value={editValues.soldPrice}
                                                onChange={(e) => setEditValues({ ...editValues, soldPrice: e.target.value })}
                                                className="w-40 h-10 border-emerald-500/30 focus-visible:ring-emerald-500"
                                            />
                                        ) : (
                                            <span className="font-medium text-lg">LKR {prop.sold_price.toLocaleString()}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === prop.id ? (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    value={editValues.percentage}
                                                    onChange={(e) => setEditValues({ ...editValues, percentage: e.target.value })}
                                                    className="w-20 h-10 border-emerald-500/30 focus-visible:ring-emerald-500"
                                                />
                                                <span className="text-muted-foreground font-bold">%</span>
                                            </div>
                                        ) : (
                                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1">
                                                {prop.commission_percentage}%
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-xl text-primary">LKR {prop.commission_amount.toLocaleString()}</span>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        {editingId === prop.id ? (
                                            <Button
                                                size="sm"
                                                onClick={() => handleSave(prop.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-sm"
                                            >
                                                <Save className="h-4 w-4" /> Save Record
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(prop)}
                                                className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 gap-2"
                                            >
                                                <Calculator className="h-4 w-4" /> Edit Record
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <Calculator className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-primary">Sales & Commission Records</h3>
                </div>
                {paginatedProperties.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No sales records yet.</div>
                ) : (
                    paginatedProperties.map((prop) => (
                        <Card key={prop.id} className="overflow-hidden bg-white border shadow-sm">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-sm text-primary flex-1 min-w-0 truncate pr-2">{prop.title}</h3>
                                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 px-2 py-0.5 text-xs shrink-0">
                                        {prop.commission_percentage}%
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground block">Original Price</span>
                                        <span className="font-medium">{prop.original_price}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block">Sold Price</span>
                                        {editingId === prop.id ? (
                                            <Input
                                                type="number"
                                                value={editValues.soldPrice}
                                                onChange={(e) => setEditValues({ ...editValues, soldPrice: e.target.value })}
                                                className="h-8 text-xs mt-0.5"
                                            />
                                        ) : (
                                            <span className="font-bold text-sm">LKR {prop.sold_price.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>

                                {editingId === prop.id && (
                                    <div className="text-xs">
                                        <span className="text-muted-foreground block">Commission Rate</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <Input
                                                type="number"
                                                value={editValues.percentage}
                                                onChange={(e) => setEditValues({ ...editValues, percentage: e.target.value })}
                                                className="h-8 w-20 text-xs"
                                            />
                                            <span className="text-muted-foreground font-bold">%</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-2 border-t">
                                    <div>
                                        <span className="text-xs text-muted-foreground">Commission</span>
                                        <p className="font-bold text-primary text-base">LKR {prop.commission_amount.toLocaleString()}</p>
                                    </div>
                                    {editingId === prop.id ? (
                                        <Button
                                            size="sm"
                                            onClick={() => handleSave(prop.id)}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8 text-xs rounded-lg"
                                        >
                                            <Save className="h-3.5 w-3.5" /> Save
                                        </Button>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEdit(prop)}
                                            className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 gap-1 h-8 text-xs rounded-lg"
                                        >
                                            <Calculator className="h-3.5 w-3.5" /> Edit
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 py-2">
                    <div className="text-sm text-muted-foreground order-2 sm:order-1">
                        Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, soldProperties.length)}–{Math.min(currentPage * ITEMS_PER_PAGE, soldProperties.length)} of {soldProperties.length}
                    </div>
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
                </div>
            )}
        </div>
    )
}

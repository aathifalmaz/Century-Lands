"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, Save, TrendingUp, Plus } from "lucide-react"
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

export default function AccountsPage() {
    const [soldProperties, setSoldProperties] = useState<SoldProperty[]>([])
    const [properties, setProperties] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedPropertyId, setSelectedPropertyId] = useState<string>("")
    const [soldPriceInput, setSoldPriceInput] = useState<string>("")
    const [percentageInput, setPercentageInput] = useState<string>("5")
    const [savingSale, setSavingSale] = useState(false)

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

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-third">Accounts Management</h1>
                    <p className="text-muted-foreground mt-1">Record sales and calculate commissions for sold properties.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 rounded-xl h-11 px-5 shadow-md transition-all active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" />
                        Record New Sale
                    </Button>
                    <div className="bg-emerald-500/10 px-6 py-3 rounded-2xl border border-emerald-500/20 flex items-center gap-4 shadow-sm text-emerald-700">
                        <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider">Total Commission Earned</p>
                            <p className="text-2xl font-bold">LKR {totalCommission.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
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

            <Card className="border-border/60 shadow-lg bg-white overflow-hidden">
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
                            {soldProperties.map((prop) => (
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
        </div>
    )
}

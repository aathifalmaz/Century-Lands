import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"

interface PropertyDetailsTableProps {
    propertyType: string
    listingId: string
    landSize: string
    size: string
    furnishing: string
    ownership: string
}

export function PropertyDetailsTable({
    propertyType = "N/A",
    listingId = "N/A",
    landSize = "N/A",
    size = "N/A",
    furnishing = "N/A",
    ownership = "N/A",
}: PropertyDetailsTableProps) {
    const details = [
        { label: "Property Type", value: propertyType },
        { label: "Listing ID", value: listingId },
        { label: "Land Size", value: landSize },
        { label: "Floor Area", value: size },
        { label: "Furnishing", value: furnishing },
        { label: "Ownership", value: ownership },
    ]

    return (
        <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground">Property Details</h2>

            <div className="rounded-xl border border-border/40 overflow-hidden bg-white/60 dark:bg-white/5 backdrop-blur-sm">
                <Table>
                    <TableBody>
                        {details.map((item) => (
                            <TableRow key={item.label} className="border-border/30 hover:bg-muted/30">
                                <TableCell className="font-medium text-muted-foreground text-sm py-3 w-1/2">
                                    {item.label}
                                </TableCell>
                                <TableCell className="text-foreground text-sm font-semibold py-3">
                                    {item.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

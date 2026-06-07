export interface SoldProperty {
    id: number
    propertyId: number
    title: string
    originalPrice: string
    soldPrice: number
    commissionPercentage: number
    commissionAmount: number
    saleDate: string
}

export const mockSoldProperties: SoldProperty[] = [
    {
        id: 1,
        propertyId: 10,
        title: "Heritage Fort House",
        originalPrice: "LKR 125,000,000",
        soldPrice: 120000000,
        commissionPercentage: 5,
        commissionAmount: 6000000,
        saleDate: "2024-02-10",
    },
    {
        id: 2,
        propertyId: 6,
        title: "Tropical Garden Villa",
        originalPrice: "LKR 104,000,000",
        soldPrice: 100000000,
        commissionPercentage: 5,
        commissionAmount: 5000000,
        saleDate: "2024-01-25",
    },
]

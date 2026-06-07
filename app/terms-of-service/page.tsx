import { PolicyLayout } from "@/components/PolicyLayout"

export default function TermsOfServicePage() {
    return (
        <PolicyLayout
            title="📜 Terms of Service"
            subtitle="Effective Date: January 2026"
        >
            <p>By accessing or using our website, you agree to these Terms of Service.</p>

            <h2>1. Use of Website</h2>
            <p>You agree to use this website only for lawful purposes, including:</p>
            <ul>
                <li>Browsing property listings</li>
                <li>Making genuine inquiries</li>
                <li>Booking appointments</li>
            </ul>
            <p>You must not:</p>
            <ul>
                <li>Submit false information</li>
                <li>Attempt system breaches</li>
                <li>Copy or scrape listings</li>
            </ul>

            <h2>2. Property Listings</h2>
            <p>All property details including:</p>
            <ul>
                <li>Prices</li>
                <li>Availability</li>
                <li>Features</li>
                <li>Images</li>
            </ul>
            <p>are subject to change without notice.</p>
            <p>We strive for accuracy but do not guarantee completeness.</p>

            <h2>3. Appointments &amp; Bookings</h2>
            <p>When booking site visits or consultations:</p>
            <ul>
                <li>Provide accurate contact details</li>
                <li>Attend scheduled appointments</li>
                <li>Inform us of cancellations in advance</li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>All website content including:</p>
            <ul>
                <li>Logos</li>
                <li>Images</li>
                <li>Text</li>
                <li>Branding</li>
                <li>Designs</li>
            </ul>
            <p>belongs to Century Lands &amp; Homes and may not be reused without permission.</p>

            <h2>5. Limitation of Liability</h2>
            <p>We are not liable for:</p>
            <ul>
                <li>Investment decisions made by users</li>
                <li>Property price fluctuations</li>
                <li>Third-party legal or banking processes</li>
            </ul>
            <p>Clients are advised to perform due diligence.</p>

            <h2>6. Modifications</h2>
            <p>We may update these terms at any time. Continued use of the website constitutes acceptance.</p>
        </PolicyLayout>
    )
}

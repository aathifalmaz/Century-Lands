import { PolicyLayout } from "@/components/PolicyLayout"

export default function PrivacyPolicyPage() {
    return (
        <PolicyLayout
            title="🔐 Privacy Policy"
            subtitle="Effective Date: January 2026"
        >
            <p>
                Century Lands &amp; Homes (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) values your privacy and is committed to protecting your personal information.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following information when you use our website or services:</p>
            <ul>
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Property preferences</li>
                <li>Appointment details</li>
                <li>Location / IP data</li>
                <li>Browsing behavior on our website</li>
            </ul>
            <p>This information is collected when you:</p>
            <ul>
                <li>Fill contact forms</li>
                <li>Book site visits</li>
                <li>Register inquiries</li>
                <li>Subscribe to updates</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
                <li>Respond to property inquiries</li>
                <li>Schedule appointments</li>
                <li>Provide property recommendations</li>
                <li>Send updates &amp; offers</li>
                <li>Improve website experience</li>
                <li>Comply with legal obligations</li>
            </ul>
            <p><strong>We do not sell or rent your personal data to third parties.</strong></p>

            <h2>3. Data Protection</h2>
            <p>We implement security measures including:</p>
            <ul>
                <li>Secure servers</li>
                <li>Encrypted communications (SSL)</li>
                <li>Restricted staff access</li>
            </ul>
            <p>However, no online system is 100% secure.</p>

            <h2>4. Third-Party Services</h2>
            <p>We may use trusted third-party tools such as:</p>
            <ul>
                <li>Google Analytics</li>
                <li>Meta Pixel / Ads tracking</li>
                <li>CRM systems</li>
                <li>Payment or banking partners</li>
            </ul>
            <p>These providers follow their own privacy policies.</p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Request access to your data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion</li>
                <li>Opt-out of marketing communications</li>
            </ul>
            <p>Contact us to exercise these rights.</p>

            <h2>6. Contact Information</h2>
            <p>
                <strong>Century Lands &amp; Homes</strong><br />
                135/3/10, 3rd Floor, Nabeesha Complex,<br />
                Kotugodalla Street, Kandy, Sri Lanka
            </p>
            <p>
                Email: <a href="mailto:centurylandshomes@gmail.com">centurylandshomes@gmail.com</a><br />
                Phone: 081 XXXXXXXX / 070 XXXXXXXXXX
            </p>
        </PolicyLayout>
    )
}

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

            <h2>3. Data Protection & Authentication</h2>
            <p>We use industry-standard security measures to protect your personal data, including:</p>
            <ul>
                <li><strong>Supabase Authentication:</strong> Your login credentials and authentication sessions are securely handled by Supabase utilizing cryptographically secure tokens.</li>
                <li><strong>Encrypted Communications:</strong> All data transmitted to and from our website is encrypted using Secure Socket Layer (SSL) technology.</li>
                <li><strong>Access Control:</strong> Access to user and client database records is strictly restricted to authorized administrative personnel on a need-to-know basis.</li>
            </ul>
            <p>While we implement strict data safeguarding protocols, please note that no system of transmission or storage over the internet is completely infallible.</p>

            <h2>4. Third-Party Services & Integrations</h2>
            <p>To deliver an optimized platform experience, we integrate with trusted third-party providers:</p>
            <ul>
                <li><strong>Supabase:</strong> For cloud hosting, database management, and user authentication infrastructure.</li>
                <li><strong>Google Analytics:</strong> To analyze web traffic and understand visitor engagement behavior.</li>
                <li><strong>Map Embed Services:</strong> To display property locations and highlight nearby landmarks or transport links.</li>
            </ul>
            <p>Each of these external providers maintains their own individual privacy policies governing data processing.</p>

            <h2>5. Data Retention</h2>
            <p>
                We retain your personal information, such as name, email address, and inquiry records, only for as long as necessary to fulfill the purposes outlined in this policy, satisfy legal, accounting, or reporting requirements, and resolve customer inquiries.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
                <li>Request access to the personal data we store about you.</li>
                <li>Request correction of any inaccurate or outdated information.</li>
                <li>Request the deletion of your account and personal history, subject to legal retention obligations.</li>
                <li>Opt-out of email newsletters or marketing communications at any point.</li>
            </ul>
            <p>Please contact us using the details below to submit a data request.</p>

            <h2>7. Contact Information</h2>
            <p>
                <strong>Century Lands &amp; Homes (Pvt) Ltd</strong><br />
                135/3/10, 3rd Floor, Nabeesha Complex,<br />
                Kotugodalla Street, Kandy, Sri Lanka
            </p>
            <p>
                Email: <a href="mailto:centurylandshomes@gmail.com">centurylandshomes@gmail.com</a><br />
                Phone: 070 722 0224
            </p>
        </PolicyLayout>
    )
}

import { PolicyLayout } from "@/components/PolicyLayout"

export default function CookiePolicyPage() {
    return (
        <PolicyLayout
            title="🍪 Cookie Policy"
            subtitle="Effective Date: January 2026"
        >
            <p>This Cookie Policy explains how Century Lands &amp; Homes uses cookies.</p>

            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small data files stored on your device when visiting websites. They help improve functionality and user experience.</p>

            <h2>2. Types of Cookies We Use</h2>

            <h3>Essential Cookies</h3>
            <p>Required for website operation (navigation, forms).</p>

            <h3>Analytics Cookies</h3>
            <p>Used to understand visitor behavior (Google Analytics).</p>

            <h3>Marketing Cookies</h3>
            <p>Used for ad targeting (Meta / Google Ads).</p>

            <h3>Preference Cookies</h3>
            <p>Remember user settings and preferences.</p>

            <h2>3. How We Use Cookies</h2>
            <p>We use cookies to:</p>
            <ul>
                <li>Improve website performance</li>
                <li>Analyze traffic</li>
                <li>Personalize property recommendations</li>
                <li>Measure ad effectiveness</li>
            </ul>

            <h2>4. Managing Cookies</h2>
            <p>You can control cookies via browser settings:</p>
            <ul>
                <li>Disable cookies</li>
                <li>Clear stored cookies</li>
                <li>Block tracking cookies</li>
            </ul>
            <p><strong>Note:</strong> Disabling may affect site functionality.</p>
        </PolicyLayout>
    )
}

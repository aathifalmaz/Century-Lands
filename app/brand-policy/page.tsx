import { PolicyLayout } from "@/components/PolicyLayout"

export default function BrandPolicyPage() {
    return (
        <PolicyLayout
            title="🏷️ Brand Policy"
            subtitle="Protecting the identity and assets of Century Lands & Homes"
        >
            <h2>1. Brand Ownership</h2>
            <p>All brand assets including:</p>
            <ul>
                <li>Company name</li>
                <li>Logo</li>
                <li>Taglines</li>
                <li>Marketing materials</li>
                <li>Website content</li>
            </ul>
            <p>are the intellectual property of Century Lands &amp; Homes.</p>

            <h2>2. Logo Usage</h2>
            <p>You may not:</p>
            <ul>
                <li>Modify the logo</li>
                <li>Change colors or proportions</li>
                <li>Use low-quality or distorted versions</li>
                <li>Place on misleading materials</li>
            </ul>
            <p>Permission is required for partnerships or media use.</p>

            <h2>3. Name Usage</h2>
            <p>The name &ldquo;Century Lands &amp; Homes&rdquo; must not be used:</p>
            <ul>
                <li>For fraudulent listings</li>
                <li>Fake advertisements</li>
                <li>Unauthorized property promotions</li>
            </ul>
            <p><strong>Legal action may be taken against misuse.</strong></p>

            <h2>4. Marketing &amp; Advertising</h2>
            <p>Only authorized representatives may:</p>
            <ul>
                <li>Publish property ads</li>
                <li>Run paid campaigns</li>
                <li>Use brand visuals</li>
            </ul>

            <h2>5. Brand Assets Guidelines</h2>
            <p>Our official brand colors consist of:</p>
            <ul>
                <li><strong>Primary:</strong> Deep Navy Blue (`#0B2545`)</li>
                <li><strong>Secondary:</strong> Gold/Yellow (`#F5C518`)</li>
                <li><strong>Supporting Elements:</strong> Clean Whites, Slate Grays, and Dark Accent tones.</li>
            </ul>
            <p>
                To request high-resolution vector assets of the official Century Lands logo or to obtain authorization for media features, please write to us.
            </p>

            <h2>6. Reporting Brand Misuse</h2>
            <p>If you encounter fake property ads, phishing attempts, or unauthorized representatives claiming association with us, please contact us immediately:</p>
            <p>
                Email: <a href="mailto:centurylandshomes@gmail.com">centurylandshomes@gmail.com</a><br />
                Phone: 070 722 0224
            </p>
        </PolicyLayout>
    )
}

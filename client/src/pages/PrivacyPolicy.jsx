export default function PrivacyPolicy() {
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Privacy Policy
        </h1>

        <p className="text-gray-500 text-sm text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-600">
            We value your privacy. This Privacy Policy explains how we collect,
            use, and protect your information when you use our Resume Builder platform.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p className="text-gray-600">
            We may collect personal information such as your name, email address,
            phone number, and resume data (education, experience, skills).
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>To provide and improve our services</li>
            <li>To generate and store your resume</li>
            <li>To communicate with you</li>
            <li>To ensure platform security</li>
          </ul>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Data Sharing</h2>
          <p className="text-gray-600">
            We do not sell or rent your personal data. Your information may be
            shared only when required by law or to provide our services (e.g., email delivery).
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate security measures to protect your data from
            unauthorized access, alteration, or disclosure.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Cookies</h2>
          <p className="text-gray-600">
            We may use cookies to enhance your experience, analyze usage, and
            improve performance.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
          <p className="text-gray-600">
            You have the right to access, update, or delete your personal data.
            You can contact us for any privacy-related requests.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p className="text-gray-600">
            We may update this Privacy Policy from time to time. Continued use of
            the service means you accept the updated policy.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, contact us at{" "}
            <span className="text-blue-600">support@yourapp.com</span>.
          </p>
        </div>

      </div>
    </section>
  );
}

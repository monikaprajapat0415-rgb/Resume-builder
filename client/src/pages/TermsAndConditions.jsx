export default function TermsAndConditions() {
  return (
    <section className="bg-gray-50 py-14 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6">
        
        <h1 className="text-3xl font-bold text-center">
          Terms & Conditions
        </h1>

        <p className="text-gray-500 text-sm text-center">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-600">
            Welcome to our Resume Builder platform. By accessing or using our
            services, you agree to comply with and be bound by these Terms &
            Conditions.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">2. Use of Service</h2>
          <p className="text-gray-600">
            You agree to use our platform only for lawful purposes. You must not
            misuse the service or attempt to access it using unauthorized methods.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">3. User Data</h2>
          <p className="text-gray-600">
            You are responsible for the information you provide. We do not share
            your personal data with third parties without consent, except as required by law.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
          <p className="text-gray-600">
            All templates, designs, and content are the intellectual property of
            our platform. You may not copy or redistribute without permission.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p className="text-gray-600">
            We are not responsible for any damages resulting from the use of our
            service, including loss of data or job opportunities.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">6. Termination</h2>
          <p className="text-gray-600">
            We reserve the right to suspend or terminate your access if you violate
            these terms.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
          <p className="text-gray-600">
            We may update these Terms & Conditions at any time. Continued use of
            the service means you accept the updated terms.
          </p>
        </div>

        {/* Section */}
        <div>
          <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions, contact us at{" "}
            <span className="text-blue-600">support@yourapp.com</span>.
          </p>
        </div>

      </div>
    </section>
  );
}

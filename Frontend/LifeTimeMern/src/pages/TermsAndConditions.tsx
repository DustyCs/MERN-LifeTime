
export default function TermsAndConditions() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-4 text-center">Terms and Conditions</h1>
      
      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold">1. Data Security</h2>
          <p>
            We are committed to ensuring that your personal data remains secure at all times. To achieve this, we implement
            industry-standard encryption protocols and security measures to prevent unauthorized access, data breaches, and
            any potential misuse of your information. By using our platform, you acknowledge and agree that while we strive to
            maintain the highest security standards, no online system is entirely foolproof, and you accept any associated risks.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">2. Consent and Usage</h2>
          <p>
            By accessing and using our platform, you hereby agree to comply with these terms and provide your explicit consent
            for the collection and use of your data solely for academic and research purposes. Under no circumstances will your
            data be sold, shared, or used for commercial purposes. You acknowledge that our research aims to analyze data in
            an ethical manner and that any findings will be anonymized to protect user identities.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">3. Data Retention and Deletion</h2>
          <p>
            All collected data will be stored securely and retained only for the duration of the research study. Upon the
            conclusion of the thesis, all personal data will be permanently deleted from our systems. If you wish to retrieve
            a copy of your data before it is deleted, an official announcement will be made providing instructions on how you
            may request a copy by submitting your email address. Failure to make such a request before the given deadline will
            result in the irreversible deletion of your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">4. Right to Delete Data</h2>
          <p>
            As a user, you have the right to access, modify, or delete any of your personal data at any time during the course
            of this research. You may choose to delete your data manually through the platform's interface or request a full
            data wipe by contacting us via email. Upon receiving such a request, we will take the necessary steps to ensure that
            your data is permanently removed from our system within a reasonable timeframe. Please note that once your data is
            deleted, it cannot be recovered.
          </p>
        </section>
      </div>

      <p className="text-sm text-gray-500 mt-6">Last updated: March 2025</p>
    </div>
  );
}

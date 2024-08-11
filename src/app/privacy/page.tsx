import React from "react"

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 relative z-10">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mb-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Privacy Policy
        </h1>
        <p className="mb-4">
          {`Welcome to StocksPlan.com! This Privacy Policy describes how
          StocksPlan Inc. ("StocksPlan," "we," "our," or "us") collects, uses,
          and discloses information about you when you use our website (the
          "Service"). By accessing or using the Service, you agree to be bound
          by this Privacy Policy. If you do not agree to this Privacy Policy,
          please do not use the Service.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          1. Information We Collect
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          1.1 Information You Provide
        </h3>
        <p className="mb-4">
          {`We collect information that you provide directly to us when you use
          the Service, including when you sign up for an account, enter
          information into calculators or tools, or communicate with us.`}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          1.2 Automatically Collected Information
        </h3>
        <p className="mb-4">
          {`When you use the Service, we may automatically collect certain
          information about your device and usage of the Service, such as your
          IP address, browser type, operating system, and interactions with the
          Service.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          2. Use of Information
        </h2>
        <p className="mb-4">
          {`We may use the information we collect for various purposes, including
          to:`}
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Provide, maintain, and improve the Service;</li>
          <li>Customize and personalize your experience with the Service;</li>
          <li>Respond to your inquiries and provide customer support;</li>
          <li>
            {`Communicate with you about the Service, including updates and
            promotions;`}
          </li>
          <li>
            Generate statistics and analysis based on aggregated and anonymized
            user data; and
          </li>
          <li>Comply with legal obligations.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          3. Sharing of Information
        </h2>
        <p className="mb-4">
          We may share your information with third parties in the following
          circumstances:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>With your consent or at your direction;</li>
          <li>With service providers who perform services on our behalf;</li>
          <li>
            To comply with legal obligations or respond to legal requests; and
          </li>
          <li>
            To protect the rights, property, or safety of StocksPlan, our users,
            or others.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          4. Data Retention
        </h2>
        <p className="mb-4">
          We retain the information we collect for as long as necessary to
          fulfill the purposes for which it was collected, unless a longer
          retention period is required or permitted by law.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          5. Your Choices
        </h2>
        <p className="mb-4">
          You may choose not to provide certain information to us, but this may
          limit your ability to use certain features of the Service. You may
          also opt out of receiving promotional communications from us by
          following the instructions provided in such communications.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          6. Security
        </h2>
        <p className="mb-4">
          We take reasonable measures to protect the information we collect from
          unauthorized access, disclosure, alteration, or destruction.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          {`7. Children's Privacy`}
        </h2>
        <p className="mb-4">
          The Service is not intended for children under the age of 18, and we
          do not knowingly collect personal information from children under this
          age. If we become aware that we have collected personal information
          from a child under 18 without parental consent, we will take steps to
          delete such information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          8. Changes to this Privacy Policy
        </h2>
        <p className="mb-4">
          {`We may update this Privacy Policy from time to time. If we make
          material changes to this Privacy Policy, we will notify you by posting
          the updated Privacy Policy on the Service and updating the "Last
          Updated" date.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          9. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions or concerns about this Privacy Policy,
          please contact us at{" "}
          <a
            href="mailto:contactus@stocksplan.com"
            className="text-blue-600 hover:underline"
          >
            contactus@stocksplan.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage

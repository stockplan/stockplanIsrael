import React from "react"

interface TermsPageProps {}

const TermsPage: React.FC<TermsPageProps> = ({}) => {
  return (
    <div className="bg-gray-100 min-h-screen py-12 relative z-10">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg mb-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Terms of Service
        </h1>
        <p className="mb-4">
          {` Welcome to StocksPlan.com! These Terms of Service ("Terms") govern
          your use of StocksPlan.com (the "Service"), provided by
          STOCKSPLAN.COM. By accessing or using the Service, you agree to be
          bound by these Terms. If you do not agree to these Terms, please do
          not use the Service.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          1. Use of the Service
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          1.1 Eligibility
        </h3>
        <p className="mb-4">
          You must be at least 18 years old to use the Service. By using the
          Service, you represent and warrant that you are at least 18 years old.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          1.2 Accuracy of Information
        </h3>
        <p className="mb-4">
          While we strive to provide accurate and up-to-date information,
          STOCKSPLAN.COM makes no warranties or representations regarding the
          accuracy, completeness, or reliability of any information provided
          through the Service. You acknowledge and agree that any reliance on
          such information is at your own risk.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          1.3 Prohibited Conduct
        </h3>
        <p className="mb-4">
          {`You agree not to engage in any conduct that violates these Terms or is
          harmful to STOCKSPLAN.COM, its users, or third parties. Prohibited
          conduct includes, but is not limited to, unauthorized access to the
          Service, interference with the Service's operation, and any activity
          that may damage, disable, or impair the Service.`}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          2. Intellectual Property
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          2.1 Ownership
        </h3>
        <p className="mb-4">
          All content and materials available through the Service, including but
          not limited to text, graphics, logos, images, and software, are the
          property of STOCKSPLAN.COM or its licensors and are protected by
          copyright, trademark, and other intellectual property laws.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          2.2 License
        </h3>
        <p className="mb-4">
          Subject to these Terms, STOCKSPLAN.COM grants you a limited,
          non-exclusive, non-transferable license to access and use the Service
          for your personal, non-commercial use.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          3. Limitation of Liability
        </h2>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          3.1 Disclaimer
        </h3>
        <p className="mb-4">
          {`TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, STOCKSPLAN.COM
          DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT
          LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT. THE SERVICE IS PROVIDED "AS IS" AND "AS
          AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND.`}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
          3.2 Limitation of Liability
        </h3>
        <p className="mb-4">
          UNDER NO CIRCUMSTANCES SHALL STOCKSPLAN.COM BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
          ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE
          THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
          NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF STOCKSPLAN.COM HAS
          BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          4. Termination
        </h2>
        <p className="mb-4">
          STOCKSPLAN.COM reserves the right to suspend or terminate your access
          to the Service at any time, without prior notice or liability, for any
          reason whatsoever, including but not limited to a breach of these
          Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          5. Changes to Terms
        </h2>
        <p className="mb-4">
          STOCKSPLAN.COM reserves the right to update or modify these Terms at
          any time without prior notice. Your continued use of the Service after
          any such changes constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          6. Governing Law
        </h2>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the
          laws of the State of Israel, without regard to its conflict of law
          principles.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions or concerns about these Terms, please
          contact us at{" "}
          <a href="mailto:contact@stocksplan.com" className="text-blue-600">
            contact@stocksplan.com
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default TermsPage

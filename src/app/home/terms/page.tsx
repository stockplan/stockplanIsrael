import React from "react"

const TermsPage: React.FC = () => {
  return (
    <div className="py-8 ">
      <div className="container mx-auto p-8 bg-gray-800 shadow-lg rounded-lg text-gray-100 mb-20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-white text-center">
          Terms of Service
        </h1>
        <p className="mb-6 leading-relaxed text-sm md:text-base">
          {`Welcome to StocksPlan.com! These Terms of Service ("Terms") govern your use of StocksPlan.com (the "Service"), provided by STOCKSPLAN.COM. By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.`}
        </p>

        <div className="space-y-8">
          <Section
            title="1. Use of the Service"
            content={[
              {
                subtitle: "1.1 Eligibility",
                text: `You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old.`,
              },
              {
                subtitle: "1.2 Accuracy of Information",
                text: `While we strive to provide accurate and up-to-date information, STOCKSPLAN.COM makes no warranties or representations regarding the accuracy, completeness, or reliability of any information provided through the Service. You acknowledge and agree that any reliance on such information is at your own risk.`,
              },
              {
                subtitle: "1.3 Prohibited Conduct",
                text: `You agree not to engage in any conduct that violates these Terms or is harmful to STOCKSPLAN.COM, its users, or third parties. Prohibited conduct includes, but is not limited to, unauthorized access to the Service, interference with the Service's operation, and any activity that may damage, disable, or impair the Service.`,
              },
            ]}
          />

          <Section
            title="2. Intellectual Property"
            content={[
              {
                subtitle: "2.1 Ownership",
                text: `All content and materials available through the Service, including but not limited to text, graphics, logos, images, and software, are the property of STOCKSPLAN.COM or its licensors and are protected by copyright, trademark, and other intellectual property laws.`,
              },
              {
                subtitle: "2.2 License",
                text: `Subject to these Terms, STOCKSPLAN.COM grants you a limited, non-exclusive, non-transferable license to access and use the Service for your personal, non-commercial use.`,
              },
            ]}
          />

          <Section
            title="3. Limitation of Liability"
            content={[
              {
                subtitle: "3.1 Disclaimer",
                text: `TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, STOCKSPLAN.COM DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY OF ANY KIND.`,
              },
              {
                subtitle: "3.2 Limitation of Liability",
                text: `UNDER NO CIRCUMSTANCES SHALL STOCKSPLAN.COM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OF OR INABILITY TO USE THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, EVEN IF STOCKSPLAN.COM HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.`,
              },
            ]}
          />

          <Section
            title="4. Termination"
            content={[
              {
                text: `STOCKSPLAN.COM reserves the right to suspend or terminate your access to the Service at any time, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms.`,
              },
            ]}
          />

          <Section
            title="5. Changes to Terms"
            content={[
              {
                text: `STOCKSPLAN.COM reserves the right to update or modify these Terms at any time without prior notice. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.`,
              },
            ]}
          />

          <Section
            title="6. Governing Law"
            content={[
              {
                text: `These Terms shall be governed by and construed in accordance with the laws of the State of Israel, without regard to its conflict of law principles.`,
              },
            ]}
          />

          <Section
            title="Contact Us"
            content={[
              {
                text: `If you have any questions or concerns about these Terms, please contact us at `,
              },
              {
                link: {
                  href: "mailto:contact@stocksplan.com",
                  text: "contact@stocksplan.com",
                },
              },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

const Section = ({
  title,
  content,
}: {
  title: string
  content: Array<{
    subtitle?: string
    text?: string
    list?: string[]
    link?: { href: string; text: string }
  }>
}) => {
  return (
    <section>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mt-8 mb-4 text-white">
        {title}
      </h2>
      {content.map((item, index) => (
        <div key={index} className="mb-4">
          {item.subtitle && (
            <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-gray-300">
              {item.subtitle}
            </h3>
          )}
          {item.text && (
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
              {item.text}
            </p>
          )}
          {item.list && (
            <ul className="list-disc list-inside text-gray-200 text-sm md:text-base">
              {item.list.map((listItem, idx) => (
                <li key={idx}>{listItem}</li>
              ))}
            </ul>
          )}
          {item.link && (
            <p>
              <a
                href={item.link.href}
                className="text-blue-400 hover:underline"
              >
                {item.link.text}
              </a>
            </p>
          )}
        </div>
      ))}
    </section>
  )
}

export default TermsPage

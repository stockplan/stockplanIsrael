import React from "react"

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto p-8 bg-gray-800 shadow-lg rounded-lg text-gray-100 mb-20">
        <h1 className="text-2xl md:text-3xl lg:text-4xl  font-extrabold mb-6 text-white text-center">
          Privacy Policy
        </h1>
        <p className="mb-6 leading-relaxed text-sm md:text-base">
          {`Welcome to StocksPlan.com! This Privacy Policy describes how StocksPlan Inc. ("StocksPlan," "we," "our," or "us") collects, uses, and discloses information about you when you use our website (the "Service"). By accessing or using the Service, you agree to be bound by this Privacy Policy. If you do not agree to this Privacy Policy, please do not use the Service.`}
        </p>

        <div className="space-y-8">
          <Section
            title="1. Information We Collect"
            content={[
              {
                subtitle: "1.1 Information You Provide",
                text: `We collect information that you provide directly to us when you use the Service, including when you sign up for an account, enter information into calculators or tools, or communicate with us.`,
              },
              {
                subtitle: "1.2 Automatically Collected Information",
                text: `When you use the Service, we may automatically collect certain information about your device and usage of the Service, such as your IP address, browser type, operating system, and interactions with the Service.`,
              },
            ]}
          />

          <Section
            title="2. Use of Information"
            content={[
              {
                text: `We may use the information we collect for various purposes, including to:`,
              },
              {
                list: [
                  "Provide, maintain, and improve the Service;",
                  "Customize and personalize your experience with the Service;",
                  "Respond to your inquiries and provide customer support;",
                  "Communicate with you about the Service, including updates and promotions;",
                  "Generate statistics and analysis based on aggregated and anonymized user data;",
                  "Comply with legal obligations.",
                ],
              },
            ]}
          />

          <Section
            title="3. Sharing of Information"
            content={[
              {
                text: `We may share your information with third parties in the following circumstances:`,
              },
              {
                list: [
                  "With your consent or at your direction;",
                  "With service providers who perform services on our behalf;",
                  "To comply with legal obligations or respond to legal requests; and",
                  "To protect the rights, property, or safety of StocksPlan, our users, or others.",
                ],
              },
            ]}
          />

          <Section
            title="4. Data Retention"
            content={[
              {
                text: `We retain the information we collect for as long as necessary to fulfill the purposes for which it was collected, unless a longer retention period is required or permitted by law.`,
              },
            ]}
          />

          <Section
            title="5. Your Choices"
            content={[
              {
                text: `You may choose not to provide certain information to us, but this may limit your ability to use certain features of the Service. You may also opt out of receiving promotional communications from us by following the instructions provided in such communications.`,
              },
            ]}
          />

          <Section
            title="6. Security"
            content={[
              {
                text: `We take reasonable measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction.`,
              },
            ]}
          />

          <Section
            title={`7. Children's Privacy`}
            content={[
              {
                text: `The Service is not intended for children under the age of 18, and we do not knowingly collect personal information from children under this age. If we become aware that we have collected personal information from a child under 18 without parental consent, we will take steps to delete such information.`,
              },
            ]}
          />

          <Section
            title="8. Changes to this Privacy Policy"
            content={[
              {
                text: `We may update this Privacy Policy from time to time. If we make material changes to this Privacy Policy, we will notify you by posting the updated Privacy Policy on the Service and updating the "Last Updated" date.`,
              },
            ]}
          />

          <Section
            title="9. Contact Us"
            content={[
              {
                text: `If you have any questions or concerns about this Privacy Policy, please contact us at `,
              },
              {
                link: {
                  href: "mailto:contactus@stocksplan.com",
                  text: "contactus@stocksplan.com",
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
            <p className="text-gray-200 leading-relaxed">{item.text}</p>
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

export default PrivacyPolicyPage

import Footer from "@/components/Footer"
import Header from "@/components/Header"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col justify-between min-h-screen bg-background-main">
      <Header />
      <div className="flex-grow">{children}</div>
      <Footer />
    </section>
  )
}

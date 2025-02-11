import Footer from "@/components/Footer"
import Header from "@/components/Header"
import { UnsavedChangesProvider } from "@/hooks/useUnsavedChangesContext"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnsavedChangesProvider>
      <section className="flex flex-col justify-between h-screen bg-background-main">
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
      </section>
    </UnsavedChangesProvider>
  )
}

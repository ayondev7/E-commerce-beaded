import Navbar from "@/components/generalComponents/Navbar"
import Footer from "@/components/generalComponents/Footer"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
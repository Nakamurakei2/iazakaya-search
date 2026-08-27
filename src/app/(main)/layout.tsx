import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

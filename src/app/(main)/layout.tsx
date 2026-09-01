import { Header } from "@/components/header/header";
import { Navigation } from "@/components/nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Navigation />
    </>
  );
}

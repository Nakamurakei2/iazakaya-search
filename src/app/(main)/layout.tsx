import { Header } from "@/components/header/header";
import { Navigation } from "@/components/nav";
import { Providers } from "../providers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <Header />
      {children}
      <Navigation />
    </Providers>
  );
}

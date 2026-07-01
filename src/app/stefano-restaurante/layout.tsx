import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function RestauranteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader unit="restaurante" />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

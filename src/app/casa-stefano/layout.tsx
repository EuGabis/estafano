import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function CasaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader unit="casa" />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}

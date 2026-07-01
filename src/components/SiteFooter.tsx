import Link from "next/link";
import { SITE, UNITS } from "@/lib/site";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.21 8.8 2.2 12 2.2Zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25Zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38Zm6.99-11.4a1.58 1.58 0 1 1-1.58-1.57 1.58 1.58 0 0 1 1.58 1.57Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.3 2.1 1.5 3.5 3.5 3.7v2.5c-1.2.1-2.4-.2-3.5-.8v6.1c0 3.4-2.5 5.9-5.7 5.9A5.5 5.5 0 0 1 5.3 15c0-3.2 2.9-5.7 6.4-5v2.7c-.4-.1-.9-.2-1.3-.2-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7V3h3.4Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-carvao text-creme">
      <div className="container-max grid gap-10 py-16 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-2xl text-dourado">Família Stefano</h3>
          <p className="mt-2 text-sm uppercase tracking-wider2 text-creme/60">
            {SITE.tagline}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-creme/75">
            {SITE.address.street}
            <br />
            {SITE.address.district}, {SITE.address.city} — {SITE.address.state}
            <br />
            CEP {SITE.address.cep}
          </p>
        </div>

        <div>
          <h4 className="eyebrow text-dourado">Conheça nossa família</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {Object.values(UNITS).map((u) => (
              <li key={u.key}>
                <Link
                  href={u.base}
                  className="link-underline text-creme/80 hover:text-dourado"
                >
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="eyebrow text-dourado">Contato</h4>
          <ul className="mt-5 space-y-3 text-sm text-creme/80">
            <li>
              <a href={SITE.phoneHref} className="hover:text-dourado">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-dourado">
                {SITE.email}
              </a>
            </li>
            <li className="text-creme/60">CNPJ {SITE.cnpj}</li>
          </ul>

          <div className="mt-6 flex gap-4">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-creme/70 transition-colors hover:text-dourado"
            >
              <InstagramIcon />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-creme/70 transition-colors hover:text-dourado"
            >
              <FacebookIcon />
            </a>
            <a
              href={SITE.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="text-creme/70 transition-colors hover:text-dourado"
            >
              <TiktokIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-creme/10">
        <div className="container-max py-6 text-center text-xs text-creme/50">
          {SITE.copyright}
        </div>
      </div>
    </footer>
  );
}

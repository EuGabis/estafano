// Dados globais do site Família Stefano

export const SITE = {
  name: "Família Stefano",
  tagline: "sua experiência completa",
  address: {
    street: "Avenida Antonio Pannellini, 2635",
    district: "Taboão",
    city: "São Roque",
    state: "SP",
    cep: "18135-131",
  },
  phone: "+55 (11) 4714-1464",
  phoneHref: "tel:+551147141464",
  whatsapp: "https://wa.me/551147141464",
  email: "contato@familiastefano.com.br",
  cnpj: "48.333.371/0001-11",
  copyright: "Família Stefano 2022 - Todos os Direitos Reservados",
  social: {
    instagram: "https://www.instagram.com/stefanorestaurante/",
    facebook: "https://www.facebook.com/stefanohotelerestaurante/",
    tiktok: "http://tiktok.com/@stefanohotelerestaurante",
  },
  maps: {
    waze:
      "https://www.waze.com/en/live-map/directions?latlng=-23.551084020172627%2C-47.10083484649659",
    google: "https://maps.app.goo.gl/BPDAE61ZcMZCx4pH6",
  },
} as const;

export type NavItem = { label: string; href: string };

export type Unit = {
  key: "restaurante" | "casa" | "hotel";
  name: string;
  short: string;
  tagline: string;
  base: string;
  nav: NavItem[];
};

export const UNITS: Record<Unit["key"], Unit> = {
  restaurante: {
    key: "restaurante",
    name: "Stefano Restaurante",
    short: "Restaurante",
    tagline: "gastronomia piemontesa feita por autênticos italianos",
    base: "/stefano-restaurante",
    nav: [
      { label: "Home", href: "/stefano-restaurante" },
      { label: "Nossa História", href: "/stefano-restaurante/nossa-historia" },
      { label: "Galeria", href: "/stefano-restaurante/galeria" },
      { label: "Nosso Espaço", href: "/stefano-restaurante/nosso-espaco" },
      { label: "Contato", href: "/stefano-restaurante/contato" },
    ],
  },
  casa: {
    key: "casa",
    name: "Casa Stefano",
    short: "Casa Stefano",
    tagline: "momentos inesquecíveis esperam por você",
    base: "/casa-stefano",
    nav: [
      { label: "Home", href: "/casa-stefano" },
      { label: "Casamento", href: "/casa-stefano/casamento" },
      { label: "Nossa Estrutura", href: "/casa-stefano/nossa-estrutura" },
      { label: "Buffet", href: "/casa-stefano/buffet" },
      {
        label: "Sociais e Corporativos",
        href: "/casa-stefano/sociais-e-corporativos",
      },
      { label: "Galeria", href: "/casa-stefano/galeria" },
      {
        label: "Hotel e Hospedagem",
        href: "/casa-stefano/hotel-e-hospedagem",
      },
      {
        label: "Contato e Orçamento",
        href: "/casa-stefano/contato-e-orcamento",
      },
    ],
  },
  hotel: {
    key: "hotel",
    name: "Hotel Stefano",
    short: "Hotel",
    tagline: "tranquilidade e conforto em meio a natureza",
    base: "/hotel-stefano",
    nav: [
      { label: "Home", href: "/hotel-stefano" },
      { label: "Acomodações", href: "/hotel-stefano/acomodacoes" },
      {
        label: "Lazer e Comodidades",
        href: "/hotel-stefano/lazer-e-comodidades",
      },
      {
        label: "O que fazer em São Roque",
        href: "/hotel-stefano/o-que-fazer-em-sao-roque",
      },
      { label: "Localização", href: "/hotel-stefano/localizacao" },
      { label: "Reservas", href: "/hotel-stefano/reservas" },
    ],
  },
};

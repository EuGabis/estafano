import type { RoomType } from "./types";

export const SEED_ROOM_TYPES: RoomType[] = [
  {
    id: "deluxe",
    nome: "Suíte Deluxe",
    slug: "suite-deluxe",
    descricao:
      "Conforto e tranquilidade com cama Queen Size, varanda e vista para a natureza.",
    capacidade: 2,
    tamanhoM2: 20,
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Varanda",
      "Secador",
      "Wi-Fi",
      "Frigobar",
      "Ar condicionado",
    ],
    fotos: [
      "/images/hotel/deluxe-1.png",
      "/images/hotel/deluxe-2.png",
      "/images/hotel/deluxe-3.png",
    ],
    precoBase: 420,
  },
  {
    id: "deluxe-familia",
    nome: "Suíte Deluxe Família",
    slug: "suite-deluxe-familia",
    descricao:
      "Espaço para toda a família, com cama Queen Size e acomodação para até 4 pessoas.",
    capacidade: 4,
    tamanhoM2: 23,
    amenidades: [
      "Cama Queen Size",
      'TV 32" com canais pagos',
      "Wi-Fi",
      "Secador",
      "Frigobar",
      "Ar condicionado",
    ],
    fotos: ["/images/hotel/familia-1.png", "/images/hotel/familia-2.png"],
    precoBase: 560,
  },
  {
    id: "standard",
    nome: "Suíte Standard",
    slug: "suite-standard",
    descricao:
      "Aconchego com cama de casal padrão, ideal para uma estadia prática e confortável.",
    capacidade: 3,
    tamanhoM2: 20,
    amenidades: ["Cama casal padrão", 'TV 32"', "Wi-Fi", "Secador"],
    fotos: ["/images/hotel/standard-1.png", "/images/hotel/banheiro-1.png"],
    precoBase: 320,
  },
];

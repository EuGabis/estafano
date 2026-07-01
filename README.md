# Família Stefano — Site reestilizado

Clone da estrutura do site [familiastefano.com.br](https://familiastefano.com.br/) — o complexo da **Família Stefano** em São Roque/SP, reunindo três unidades: **Stefano Restaurante**, **Casa Stefano** (eventos) e **Hotel Stefano**.

Os textos originais em PT-BR foram mantidos e as imagens originais preservadas; o layout recebeu uma nova identidade visual "elegante italiana" (bordô, dourado e tipografia serifada).

## Stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- Export estático (`output: "export"`)

## Rodando localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build de produção (site estático)

```bash
npm run build    # gera a pasta ./out com o site estático
```

## Estrutura de rotas

- `/` — Portal da Família Stefano
- `/stefano-restaurante` — Home, Nossa História, Galeria, Nosso Espaço, Contato
- `/casa-stefano` — Home, Casamento, Nossa Estrutura, Buffet, Sociais e Corporativos, Galeria, Hotel e Hospedagem, Contato e Orçamento
- `/hotel-stefano` — Home, Acomodações, Lazer e Comodidades, O que fazer em São Roque, Localização, Reservas

## Organização

```
src/
  app/            # rotas (App Router) espelhando o site original
  components/     # componentes compartilhados (Header, Footer, Hero, Gallery, etc.)
  lib/            # dados globais do site (site.ts)
public/images/    # imagens originais baixadas, organizadas por unidade
docs/             # spec de design
```

## Observações

- Os formulários de contato usam `mailto:` (não há backend).
- As reservas do hotel apontam para o motor original (Cloudbeds).
- Algumas fotos de galeria do site original são carregadas dinamicamente (Elementor) e não estavam expostas no HTML; nesses casos foram usadas as imagens originais disponíveis das demais páginas.

---

Projeto sem vínculo comercial — recriação para fins de portfólio/estudo a partir do site público.

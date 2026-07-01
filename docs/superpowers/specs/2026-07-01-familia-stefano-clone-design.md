# Família Stefano — Clone reestilizado (Design)

**Data:** 2026-07-01
**Fonte:** https://familiastefano.com.br/

## Objetivo
Recriar toda a estrutura do site portal da Família Stefano (Restaurante + Casa de eventos + Hotel, em São Roque/SP), mantendo os textos originais em PT-BR e as imagens originais, porém com uma nova identidade visual "elegante italiana".

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Site estático (`output: export` compatível) — sobe em qualquer repo/Vercel
- Sem backend: formulários são maquetes (não enviam) ou usam `mailto`

## Estrutura de rotas (espelha o original)
- `/` — Portal com as 3 unidades
- `/stefano-restaurante` — home + `/nossa-historia`, `/galeria`, `/nosso-espaco`, `/contato`
- `/casa-stefano` — home + `/casamento`, `/nossa-estrutura`, `/buffet`, `/sociais-e-corporativos`, `/galeria`, `/hotel-e-hospedagem`, `/contato-e-orcamento`
- `/hotel-stefano` — home + `/acomodacoes`, `/lazer-e-comodidades`, `/o-que-fazer-em-sao-roque`, `/localizacao`, `/reservas`

## Componentes compartilhados
- `SiteHeader` — navegação contextual por unidade (troca o menu conforme a seção)
- `SiteFooter` — endereço, telefone, e-mail, CNPJ, redes sociais, Waze/Maps
- `Hero` — bloco de destaque com imagem de fundo + título serifado
- `Section` — wrapper de seção com respiro
- `Gallery` — grade de imagens com lightbox simples
- `UnitCard` — card das unidades no portal
- `ContactForm` — formulário maquetado (mailto)
- `Button` — botão dourado/bordô reutilizável

## Sistema visual (elegante italiano)
- Cores: bordô `#5B1A1A`, dourado `#C6A15B`, off-white `#F7F3EC`, carvão `#2A2320`
- Tipografia: títulos serifada (Playfair Display), corpo sans (Inter)
- Detalhes: filetes dourados, hovers suaves, muito respiro vertical

## Conteúdo & imagens
- Textos: extraídos verbatim das ~19 páginas originais
- Imagens: baixadas dos originais (`wp-content/uploads`) para `/public/images`

## Dados
- Constantes centralizadas em `src/lib/content.ts` (endereço, contato, menus, textos por página)

## Entrega
- Git inicializado em `d:\Estafano`, commits organizados
- Repositório novo no GitHub via `gh` + push

## Fora de escopo (YAGNI)
- Backend real / envio de formulários / reservas online
- CMS, i18n, animações complexas
- Autenticação

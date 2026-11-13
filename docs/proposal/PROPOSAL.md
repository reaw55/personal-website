# Proposal: a trip-planning service for Thailand's lesser-known destinations

**Status:** Draft v0.2 (2026-11-13). Revised after rechecking the draft
against the research: added the places-and-prices and competition sections,
made the commission figures consistent, and rebuilt the example trips from
researched prices.

**Origin:** builds on the owner's paper *"Designing a Digital Trip Planning
Platform to Spotlight Thailand's Lesser-Known Travel Destinations and Foster
Local Businesses: A Software Engineering Perspective"* (NIC-NIDA 2023).

**How far to trust the numbers.** The research was desk research under a
short time limit. Figures marked "approx." come from news coverage, booking
sites, blogs or forum posts, and some are years old. Nothing here has been
confirmed with a partner, a guide or a government office. Section 10 lists
what to verify first.

Research appendices:

| Topic | File |
| --- | --- |
| Destinations: north and northeast (Isan), 10 places | [research-destinations-north-northeast.md](research-destinations-north-northeast.md) |
| Destinations: south, central, east and west, 10 places | [research-destinations-south-central-east.md](research-destinations-south-central-east.md) |
| Pricing: guides, platforms, apps, community tourism | [research-pricing.md](research-pricing.md) |
| Market size, competitors, government programmes | [research-market.md](research-market.md) |

---

## Key evidence from the research

- **Spending is highly concentrated.** In 2025 the top 5 provinces (Bangkok,
  Phuket, Chon Buri, Surat Thani, Chiang Mai) took about **70%** of tourism
  revenue, and the top 10 about 81%. The other 67 provinces shared about
  19% (approx.; [research-market.md](research-market.md)).
- **Demand is soft, and there is policy support.** Foreign arrivals were
  about 33.0M in 2025, down about 7% on 2024, and the 2026 targets were
  cut. The government ran tax deductions for travel in 55 "secondary"
  provinces in 2024 and 2025 (up to 15,000 THB in 2024; a 1.5× multiplier
  capped at about 30,000 THB in 2025). Uptake was reported as weak.
- **Incumbent commissions are high:** about 20–32% (GetYourGuide 20–30%,
  Withlocals 32%, Viator about 20–30%). This proposal charges 12–15%
  ([research-pricing.md](research-pricing.md)).
- **Community tourism lacks reach.** About 200 community tourism groups
  reportedly "lack a reliable platform" to reach customers.
- **Local prices are low.** Homestays cost about 350–1,200 THB a night,
  workshops about 250–800 THB, and a licensed guide about 1,500–3,000 THB
  a day (section 2).
- **Planner subscriptions have a ceiling.** Global trip-planner apps charge
  about $40–50 a year, and free AI planners push that down.
- **Guiding needs a licence.** Only Thai nationals holding a Department of
  Tourism licence may work as guides (Tourism Business and Guide Act
  B.E. 2551).

## 1. Problem

- Visitors cluster in a few hotspots. That crowds those places, while
  secondary provinces see little of the spending.
- Small local businesses (homestays, community tourism groups, family
  restaurants and craft makers) have weak digital presence. Global
  marketplaces are hard for them to join and take 20–32% of each booking.
- Travellers who want "off the beaten path" trips face fragmented, mostly
  Thai-language information, unclear transport, and no trusted way to book.
- AI planners are widely used but little trusted: one survey found only 7%
  of travellers "almost always" trust them. Thin data on small local places
  is a likely reason.

## 2. Places and what they cost

The research covers 20 destinations. These nine have the best-sourced
prices or the most organised community tourism, so they are the realistic
candidates for a first pilot. The other eleven are in the appendices.

| Destination | Why go | Best season | From Bangkok | Local prices found (THB) |
| --- | --- | --- | --- | --- |
| **Nan** (north) | Wat Phumin murals, old town, Doi Phu Kha, salt wells | Nov–Feb | Flight approx. 1.5 h; bus approx. 10–11 h | Homestay 350 per person per night, meals 100, khantoke dinner 200; 2-day/1-night community package 1,650–2,000 per person |
| **Mae Hong Son** (north) | Mountain loop, caves, Shan and hill-tribe villages | Nov–Feb | Fly via Chiang Mai, or 4–6 h by road from there | English-speaking guide 1,500 a day plus 800 for the guide's lodging; homestay approx. 500 |
| **Sakon Nakhon** (Isan) | Indigo-dyeing capital, Nong Han lake | Nov–Mar | Flight approx. 1 h; bus approx. 10–11 h | Indigo-dyeing workshop 250–800 |
| **Loei** (Isan) | Chiang Khan riverside, Phu Ruea, Phi Ta Khon festival | Dec–Feb | Bus about 8 h, 440–650 | Local bus Loei–Chiang Khan 38 |
| **Nakhon Si Thammarat**, Khiriwong village (south) | Award-winning community village, orchards, shadow puppets | Feb–Aug | Flight about 1 h 10 min | Homestay about 500–700 a night (46 homes, organised since 1996) |
| **Satun** (south) | UNESCO Global Geopark, caves, quiet coast | Nov–Apr | Fly to Trang or Hat Yai, then 1.5–2 h by road | Community island trip 800 per person half day, 1,500 full day (may be dated) |
| **Trang** (south) | Quiet islands, dugong habitat, food culture | Nov–Apr | Flight approx. 1.5 h | Island homestays approx. 1,100–2,300 a night (booking-site prices) |
| **Samut Songkhram**, Amphawa (central) | Canal community, fireflies, railway market | All year; weekends | Van or car about 1–1.5 h | Homestay 600–900 weekdays, 800–1,200 weekends; firefly boat 60 per person shared or 600 private |
| **Chanthaburi** (east) | Fruit orchards, gem market, old riverside town | Apr–Jul | Bus about 4 h, about 200–250 | Orchard fruit buffet about 199–400 per person (dated) |

Guide and package benchmarks that apply across destinations:

| Item | Price (THB) | Note |
| --- | --- | --- |
| Licensed guide, fee only | about 1,000–1,500 half day; 1,500–3,000 full day | Old forum figures plus one current operator quote; approx. |
| Guide plus private vehicle, full day | about 4,000–8,000 | Operator listings; one Bangkok quote at 5,500 |
| Village homestay with dinner and breakfast | about 900 per person per night | One listing |
| Packaged community trip sold to foreigners | about 2,000–4,000 per person per day | Includes transport, guide and most meals |

**Secondary-province status.** The research confirmed the southern list
(which includes Nakhon Si Thammarat, Satun and Trang). It did not retrieve
the full list of 55, so the other six places above still need checking
against the official list before any tax-benefit claim is made.

## 3. Offering

A **planner plus a local marketplace** focused only on secondary provinces:

1. **Itinerary planner (web and PWA).** It builds a 1–5 day route from
   interests, season and budget, with realistic transport legs from Bangkok
   and between stops. It works in English and Thai, and offline. The plan
   draws only on places the team has verified, which answers the trust
   problem with general AI planners.
2. **Curated local partners.** Verified homestays, community tourism
   experiences, eateries and makers, each with a short story, photos,
   prices and booking by request.
3. **Licensed local guides.** Bookable half-day and full-day guides. Every
   guide's Department of Tourism licence is checked before listing and
   shown as a "Licensed Thai guide" badge.
4. **Ready-made "hidden Thailand" packages.** Small-group trips on fixed
   dates (for example 3 days in Nan), sold through a licensed tour-operator
   partner until the business holds its own licence.
5. **Tax-benefit flag for Thai travellers.** Partners in a secondary
   province that can issue an e-tax invoice are marked, so a booking can
   count toward the government deduction when a scheme is running.
6. **For provinces and tourism offices.** A report of demand signals (saved
   and planned trips by area and season) plus co-marketing campaigns.

## 4. Customers

| Segment | Need | Channel |
| --- | --- | --- |
| Repeat international visitors and long-stay visa holders | Authentic, uncrowded trips they can trust | Search content, travel forums, long-stay communities |
| Thai weekenders based in Bangkok | Quick 2–3 day plans, tax-deductible trips | Facebook, TikTok, LINE Official Account |
| Local businesses and community tourism groups | Bookings at a fair commission, simple listing in Thai | Provincial tourism offices, community tourism networks, in-person onboarding |
| Provinces and tourism offices | Reach and demand data for secondary destinations | Direct partnerships, pilots |

The long-stay segment is real: the Destination Thailand Visa drew more than
35,000 applicants in its first year (approx.).

## 5. Competition and positioning

| Player | What it is | Where this proposal differs |
| --- | --- | --- |
| Klook, GetYourGuide, Viator | Global activity marketplaces | They take 20–30% and their listings concentrate in the big hubs |
| Withlocals, ToursByLocals, Airbnb Experiences | Guide and host marketplaces | 20–32% commission; city-centred |
| Local Alike | Thai community-tourism social enterprise; about 100 communities, 70% of revenue to communities | Sells curated tours, not a self-service planner. A likely partner |
| TakeMeTour | Thai marketplace for private local guides | Guide-centred and skewed to major cities. A likely supplier of guides |
| TAGTHAi | Government-backed travel app | Broad aggregator, not built around discovering small places. A possible distribution partner |
| ChatGPT, Gemini, Layla and other AI planners | Free or cheap itinerary tools | No verified local data and no booking with small businesses |

**Position:** the only planner whose data on secondary provinces is checked
on the ground, with booking that leaves 85–88% with the local business.

## 6. Pricing proposal

These are assumptions for the pilot, set against the benchmarks in
[research-pricing.md](research-pricing.md).

| Revenue line | Proposed price | Rationale |
| --- | --- | --- |
| Planner: free tier | 0 THB | Itinerary plus map; brings in visitors |
| Planner: Pro | about 149 THB a month or 990 THB a year (about $28) | Offline maps, unlimited trips, shared planning. Below the $40–50 a year of global apps |
| Partner bookings (homestays, community experiences, workshops) | **12% commission**, paid by the partner | Partner keeps 88%, against 68–80% on global marketplaces |
| Guide bookings | **15% commission** on the guide fee | Guide keeps 85%; the platform handles payment, licence checks and reviews |
| Curated packages | 15–25% margin over cost, through a licensed operator | In line with small-group operators |
| Featured listing | about 300–500 THB a month, optional | Promotion in seasonal guides |
| Province or tourism-office campaign | about 150,000–400,000 THB each | Content, campaign and a demand report. Not benchmarked; an assumption to test |

The pricing research suggested 15–20% would still undercut competitors.
The lower 12–15% here is a deliberate choice to win partners during the
pilot, and it can rise later.

### What one trip earns

Two example trips for two travellers, built from the prices in section 2.
Travel to the province and local transport are left out because the
platform would not sell them at first.

| | Nan, 3 days / 2 nights | Amphawa, 2 days / 1 night |
| --- | --- | --- |
| Homestay | 1,400 (350 × 2 people × 2 nights) | about 1,000 (weekend rate) |
| Meals and one khantoke dinner | 1,400 | not bookable |
| Guide, one day | 1,500 | none |
| Two workshops or boat trips | about 2,000 | 700 (private firefly boat plus temple boat) |
| **Bookable spend** | **about 6,300 THB** | **about 1,700 THB** |
| Platform commission | about 800 THB | about 200 THB |

The Nan guide rate is borrowed from Mae Hong Son, because no Nan rate was
found.

**What this means.** Commission on do-it-yourself trips is small: roughly
200–800 THB a trip. A thousand such trips a year would bring in well under
1 million THB. So in the first year the business cannot rest on commissions
and subscriptions alone. Two lines carry more weight:

- **Packages.** A 3-day community package for two at about 3,000 THB per
  person per day is 18,000 THB; a 20% margin is about 3,600 THB, four to
  five times the commission on the same trip booked piece by piece.
- **Province campaigns.** One campaign is worth as much as several hundred
  commission trips, if provinces will pay for it. That is unproven.

## 7. MVP scope (8–12 weeks)

1. **Pilot provinces (recommended):**
   - **Nan:** the best-sourced community prices, a clear cool-season draw
     and a 1.5-hour flight. It tests the multi-day trip and the package.
   - **Samut Songkhram (Amphawa):** about an hour from Bangkok, so partners
     can be onboarded in person cheaply, and it tests the Thai weekender
     segment.
   - **Next in line:** Khiriwong in Nakhon Si Thammarat, which has the most
     organised homestay group in the research.
2. **Product:**
   - content site with pages built ahead of time, so search engines can
     read them;
   - itinerary builder (rules plus an LLM assist, on human-checked data);
   - map view.
3. **Partners:**
   - 20–30 partners onboarded in person, with photos and prices verified;
   - booking by request (form to the partner by LINE or email) before any
     instant booking is built.
4. **Payments:** PromptPay and cards through a Thai payment gateway, with
   weekly payouts to partners.
5. **Measure:**
   - planner-to-booking conversion;
   - average order value;
   - partner response time;
   - review score;
   - share of spend kept locally.

## 8. Go-to-market

- **Content:** one deep guide per destination in Thai and English (best
  season, how to get there, a 3-day plan, local partners), refreshed each
  season.
- **Partnerships:** provincial tourism offices, community tourism networks
  (DASTA, Local Alike), universities (student ambassadors) and transport
  operators.
- **Timing:** launch campaigns alongside government secondary-city
  incentives and the cool, fruit and festival seasons.
- **Trust:** verified badges, licence checks and transparent pricing that
  shows what the partner receives.

## 9. Risks and compliance

| Risk | Mitigation |
| --- | --- |
| Thin margins on small bookings (section 6) | Lead with packages and province campaigns; keep onboarding costs low by starting near Bangkok |
| Tour-business and guide licensing | Sell packages through a licensed operator at first; list only licensed Thai guides; get legal review before launch |
| Falling arrivals and weak domestic spending | Serve both international and Thai travellers; price for the Thai market |
| Reliance on tax schemes that change every year | Treat the tax flag as a bonus, not the core offer |
| PDPA (Thai personal data law) | Collect minimal data, publish a privacy notice, sign data agreements with partners |
| Partner quality and response time | In-person onboarding, response-time targets, reviews, re-verification each quarter |
| Seasonality (rain; smoke season in the north) | Hold inventory in more than one region; rainy-season offers |
| A large platform or a government app moves in | Depth of local relationships, Thai-language onboarding, lower commission |

## 10. Next steps

1. **Verify before anything else:**
   - the official list of 55 secondary provinces, and the tax rules in
     force for 2026;
   - current guide day rates, with quotes from licensed guides in Nan;
   - homestay and activity prices in the two pilot provinces, directly with
     the operators;
   - the commission terms of Klook, TakeMeTour and Local Alike, which the
     research could not find.
2. Interview 10 partners and 10 travellers per pilot province to test the
   12% and 15% commissions and the package price.
3. Ask two provincial tourism offices whether they would pay for a
   campaign, and how much.
4. Find a licensed tour-operator partner.
5. Build the MVP (section 7) and run a 3-month pilot. Decide whether to
   continue from conversion and partner retention.

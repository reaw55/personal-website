# Proposal: a trip-planning service for Thailand's lesser-known destinations

**Status:** Draft v0.1 (2026-11-05). The numbers are planning assumptions;
validate them against the research files before committing to them.

**Origin:** builds on the owner's paper *"Designing a Digital Trip Planning
Platform to Spotlight Thailand's Lesser-Known Travel Destinations and Foster
Local Businesses: A Software Engineering Perspective"* (NIC-NIDA 2023).

Research appendices (written in parallel; one may be missing if its research
ran out of time):

| Topic | File |
| --- | --- |
| Destinations: north and northeast (Isan) | [research-destinations-north-northeast.md](research-destinations-north-northeast.md) |
| Destinations: south, central, east and west | [research-destinations-south-central-east.md](research-destinations-south-central-east.md) |
| Pricing: guides, platforms, apps, community tourism | [research-pricing.md](research-pricing.md) |
| Market size, competitors, government programmes | [research-market.md](research-market.md) |

---

## 1. Problem

- Visitors cluster in a few hotspots (Bangkok, Phuket, Chiang Mai, Pattaya).
  That crowds those places, while secondary provinces see little spending.
- Small local businesses (homestays, community-based tourism groups, family
  restaurants and craft makers) have weak digital presence. Global
  marketplaces are hard for them to join, and their commissions (often
  around 20–30%, see the pricing research) take much of the margin.
- Travellers who want "off the beaten path" trips face fragmented, mostly
  Thai-language information, unclear transport, and no trusted booking path.

## 2. Offering

A **planner plus a local marketplace** focused only on secondary provinces:

1. **Smart itinerary planner (web and PWA).** It builds a 1–5 day route
   from interests, season and budget, with realistic transport legs from
   Bangkok and between stops. It works in English and Thai first, and it
   works offline.
2. **Curated local partners.** Verified homestays, community-based tourism
   experiences, eateries and makers, each with a short story, photos, prices
   and instant or requested booking.
3. **Licensed local guides.** Bookable half-day and full-day hosts. Only
   TAT-licensed Thai guides may guide (foreigners cannot work as guides in
   Thailand), so this also creates jobs locally.
4. **Ready-made "hidden Thailand" packages.** Fixed-date small-group trips
   (e.g. 3 days in Nan, or Trang islands by longtail), sold under a licensed
   tour-operator partner until we hold our own licence.
5. **For provinces and local tourism offices (B2G and B2B).** A dashboard of
   demand signals (saved and planned trips by area and season) plus
   co-marketing campaigns. Partnerships can draw on the government's
   secondary-city promotion programmes.

## 3. Customers

| Segment | Need | Channel |
| --- | --- | --- |
| Repeat international visitors (2nd+ trip), digital nomads | Authentic, uncrowded trips | SEO content, Reddit and travel forums, nomad communities |
| Thai domestic weekenders (Bangkok-based) | Quick 2–3 day plans, tax-deductible secondary-city trips | Thai social media (Facebook, TikTok, LINE OA) |
| Local businesses and community-based tourism groups | Bookings at fair commission, simple listing tools | Provincial tourism offices, CBT networks, on-site onboarding |
| Provinces and tourism offices | Data and reach for secondary destinations | Direct partnerships, pilots |

## 4. Pricing proposal (assumptions to validate)

Benchmarks are in [research-pricing.md](research-pricing.md).

| Revenue line | Proposed price | Rationale |
| --- | --- | --- |
| Planner: Free | 0 THB | Itinerary plus map; drives SEO and acquisition |
| Planner: Pro | ~149 THB/month or ~990 THB/year (approx. $4–5/month) | Offline maps, unlimited trips, collaboration, Thai and English export; priced below global AI planners |
| Partner bookings (homestays, experiences) | **10–12% commission**, paid by the partner | Clearly below global OTAs and marketplaces (approx. 20–30%), which is the core value proposition for local businesses |
| Guide bookings | 12–15% commission on guide fee | Guide keeps 85–88%; platform handles payment, insurance and reviews |
| Curated packages | 15–25% margin over cost, via a licensed operator | Comparable to small-group tour operators |
| Featured partner listing | ~300–500 THB/month (optional) | Promotion in seasonal guides and newsletters |
| Province / tourism office pilot | ~150k–400k THB per campaign (approx.) | Content, campaign and demand-data report per province |

**Unit example (one 3-day secondary-city trip, two travellers):**
- Spend: about 2 nights' homestay, 1 guide day, 2 experiences and meals.
  This assumes partner spend of roughly 9,000–12,000 THB in total; validate
  against the destination research.
- Platform revenue at ~12%: roughly 1,100–1,400 THB per trip.
- Local businesses keep about 88%.

## 5. MVP scope (8–12 weeks)

1. **Pilot:** 2 provinces with strong community tourism and easy access from
   Bangkok (e.g. one in the north or Isan and one in the south or east;
   pick from the research tables).
2. **Product:**
   - static content site with server-rendered or pre-rendered pages for
     SEO;
   - itinerary builder (rules plus an LLM assist, with human-curated data);
   - map view.
3. **Partners:**
   - 20–30 partners onboarded in person, with photos and prices verified;
   - booking by request (form → partner via LINE or email) before building
     instant booking.
4. **Payments:** PromptPay and cards through a Thai payment gateway;
   payouts to partners weekly.
5. **Measure:**
   - planner-to-booking conversion;
   - average order value;
   - partner response time;
   - review score;
   - share of spend kept locally.

## 6. Go-to-market

- **Content:** one deep guide per destination in Thai and English (best
  season, how to get there, a 3-day plan, local partners), refreshed every
  season.
- **Partnerships:** provincial tourism offices, community-based tourism
  networks, universities (student ambassadors), and transport partners
  (bus, rail, regional airlines).
- **Campaign timing:** align with government secondary-city incentives and
  with fruit, festival and cool seasons.
- **Trust:** verified badges, licensed-guide checks and transparent pricing
  (show what the partner receives).

## 7. Risks and compliance

| Risk | Mitigation |
| --- | --- |
| Tour business and guide licensing (Tourism Business and Guide Act) | Sell packages through a licensed operator partner at first; list only licensed guides; get legal review before launch |
| PDPA (Thai personal data law) | Collect minimal data, have a consent and privacy notice, add a data-processing agreement with partners |
| Partner quality and response time | In-person onboarding, response-time targets, reviews, quarterly re-verification |
| Seasonality (rain, smoke season in the north) | Promote seasonal, multi-region inventory and rainy-season offers |
| Big platforms copying the idea | Depth of local relationships, Thai-language content, lower commission, province partnerships |

## 8. Next steps

1. Validate the pricing assumptions with 10 partner interviews and 10
   traveller interviews per pilot province.
2. Choose the 2 pilot provinces from the research tables.
3. Find a licensed tour-operator partner.
4. Build the MVP (section 5) and run a 3-month pilot. Decide whether to go
   further based on conversion and partner retention.

# Cana products — launch capsule

Four SKUs. Lead with the gift set. Each "Pre-order" button links to a Stripe Payment Link (replace the `STRIPE_LINK_*` placeholders with real links). Prices are starting suggestions — adjust to real costs.

Image files go in `/public/images/` using the filenames below.

---

## 1. The "Be Still" Gift Set  ⟶ lead product
- **Price:** $78
- **Includes:** the Be Still mug + the Blessing Dish + gift box + blessing card
- **Image:** `giftset.jpg`
- **Stripe:** `STRIPE_LINK_GIFTSET`
- **Short line:** The whole table, ready to give.
- **Description:** Our founding gift — the Be Still mug and the Lord-bless-you dish, nestled in a bone gift box with a blessing card. Made to be opened slowly and kept for years.

## 2. Be Still Mug
- **Price:** $38
- **Verse:** "Be still, and know" — **Psalm 46:10**
- **Image:** `mug.jpg`
- **Stripe:** `STRIPE_LINK_MUG`
- **Short line:** For the quiet of the morning.
- **Description:** Warm ivory stoneware with the words carved into the clay, tone-on-tone — felt as much as read. A daily reminder in your hands.

## 3. Blessing Dish
- **Price:** $20
- **Verse:** "The Lord bless you and keep you" — **Numbers 6:24**
- **Image:** `dish.jpg`
- **Stripe:** `STRIPE_LINK_DISH`
- **Short line:** A blessing by the door, by the sink, by the bed.
- **Description:** A small hand-formed dish for rings, keys, or a quiet moment — carrying the oldest blessing in Scripture.

## 4. Cana Light (luminary)  ⟶ hero / scroll-stopper
- **Price:** $68
- **Verse:** "The Lord is my light" — **Psalm 27:1**
- **Image:** `luminary.jpg`
- **Stripe:** `STRIPE_LINK_LUMINARY`
- **Short line:** A cross of candlelight on the evening table.
- **Description:** A pierced stoneware luminary. Set a tea light inside and the verse glows; a soft cross of light falls across the table at dusk.

---

### Notes for the build
- Card order on the page: **Gift Set, Mug, Blessing Dish, Cana Light.**
- The Cana Light is the best hero image for the top of the page (it's the scroll-stopper); the Gift Set is the best "buy this" card.
- Every product is also available individually; the gift set reuses the same mug and dish SKUs (no separate versions).

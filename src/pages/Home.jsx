import { useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/home/Hero";
import { AnnouncementSection, ReviewCard, StoryTeaser } from "../components/home/Sections";
import ProductCard from "../components/common/ProductCard";
import CategoryCard from "../components/common/CategoryCard";
import { SectionHeading, HorizontalScroller, Reveal } from "../components/common/Misc";
import { useAnnouncements, useProducts, useSettings } from "../hooks/useStore";
import { db } from "../lib/store";
import { CATEGORIES } from "../lib/data";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [reviewsPaused, setReviewsPaused] = useState(false);

  const products = useProducts();
  const announcements = useAnnouncements();
  const settings = useSettings();
  const reviews = db.getReviews().filter((r) => r.is_featured);

  const offers = products.filter((p) => p.is_offer);
  const newArrivals = products.filter((p) => p.is_new_arrival);
  const featured = products.filter((p) => p.is_featured);

  return (
    <div>
      <Hero />

      <AnnouncementSection announcements={announcements} />

      {offers.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Limited Time"
            title="Offer Products"
            action={
              <Link
                to="/offers"
                className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-mist transition-colors hover:text-bone sm:flex"
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <HorizontalScroller>
            {offers.map((p, i) => (
              <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[28%] lg:w-[22%]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </HorizontalScroller>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading
            eyebrow="Just Dropped"
            title="New Arrivals"
            action={
              <Link
                to="/new-arrivals"
                className="hidden items-center gap-1.5 text-xs uppercase tracking-widest text-mist transition-colors hover:text-bone sm:flex"
              >
                View all <ArrowRight size={13} />
              </Link>
            }
          />
          <HorizontalScroller>
            {newArrivals.map((p, i) => (
              <div key={p.id} className="w-[62%] shrink-0 snap-start sm:w-[28%] lg:w-[22%]">
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </HorizontalScroller>
        </section>
      )}

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
        <SectionHeading eyebrow="Explore" title="Shop by Category" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading eyebrow="The Edit" title="Featured Products" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-8">
          <SectionHeading eyebrow="Word on the Street" title="Reviews" />

          <div
            className={`reviews-auto-scroll no-scrollbar overflow-hidden pb-2 ${
              reviewsPaused ? "is-paused" : ""
            }`}
            aria-label="Customer reviews"
            onPointerDown={() => setReviewsPaused(true)}
            onPointerUp={() => setReviewsPaused(false)}
            onPointerCancel={() => setReviewsPaused(false)}
            onPointerLeave={() => setReviewsPaused(false)}
            onTouchStart={() => setReviewsPaused(true)}
            onTouchEnd={() => setReviewsPaused(false)}
          >
            <div className="reviews-marquee flex w-max gap-4">
              <div className="reviews-set flex shrink-0 gap-4">
                {reviews.map((r) => (
                  <ReviewCard key={`review-a-${r.id}`} review={r} />
                ))}
              </div>

              <div className="reviews-set flex shrink-0 gap-4" aria-hidden="true">
                {reviews.map((r) => (
                  <ReviewCard key={`review-b-${r.id}`} review={r} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <StoryTeaser settings={settings} />
    </div>
  );
}

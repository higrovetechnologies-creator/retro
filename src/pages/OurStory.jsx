import { useEffect } from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { useSettings } from "../hooks/useStore";
import { db } from "../lib/store";
import { ReviewCard } from "../components/home/Sections";
import { Reveal } from "../components/common/Misc";

export default function OurStory() {
  const settings = useSettings();
  const reviews = db.getReviews();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pb-24 pt-28">
      <section className="mx-auto max-w-[1000px] px-4 text-center sm:px-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-mist">Our Story</p>
        <h1 className="mt-4 font-display text-[42px] leading-[1.05] text-bone sm:text-[58px]">
          Tirunelveli's first <span className="italic">aesthetic clothing cart</span>
        </h1>
      </section>

      <Reveal className="mx-auto mt-12 max-w-[1200px] px-4 sm:px-8">
        <div className="aspect-[16/9] overflow-hidden rounded-[26px] border border-line">
          <img
            src="https://picsum.photos/seed/retro-story-main/1600/900"
            alt="Retro Clothing"
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-12 max-w-[760px] px-4 sm:px-8">
        <p className="text-[16px] leading-[1.9] text-mist">{settings.storyLong}</p>
      </Reveal>

      <section className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-8">
        <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
          The People Behind It
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {[settings.founder, settings.cofounder].map((person, i) => (
            <Reveal key={person.name} delay={i * 0.1} className="overflow-hidden rounded-[22px] border border-line">
              <div className="aspect-[4/3]">
                <img src={person.image} alt={person.name} className="h-full w-full object-cover" />
              </div>
              <div className="glass p-5">
                <p className="text-[11px] uppercase tracking-widest text-mist">
                  {i === 0 ? "Founder" : "CEO"}
                </p>
                <p className="mt-1 font-display text-xl text-bone">{person.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto mt-20 max-w-[1400px] px-4 sm:px-8">
          <p className="mb-6 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-mist">
            What People Say
          </p>
          <div className="no-scrollbar flex snap-x justify-center gap-4 overflow-x-auto pb-2">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </section>
      )}

      <Reveal className="mx-auto mt-20 max-w-[1200px] px-4 sm:px-8">
        <div className="overflow-hidden rounded-[26px] border border-line">
          <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-3">
              <MapPin size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-bone" />
              <div>
                <p className="font-display text-xl text-bone">Visit the Flagship Store</p>
                <p className="mt-1 max-w-md text-sm text-mist">{settings.address}</p>
              </div>
            </div>
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="flex shrink-0 items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-xs font-medium uppercase tracking-widest text-bone transition-colors hover:bg-bone hover:text-ink"
            >
              Open in Google Maps <ExternalLink size={13} />
            </a>
          </div>
          <iframe
            title="Retro Clothing location"
            className="h-[320px] w-full grayscale invert-[0.92] contrast-[1.1]"
            loading="lazy"
            src={`https://www.google.com/maps?q=8.7297747,77.6792023&z=16&output=embed`}
          />
        </div>
      </Reveal>
    </div>
  );
}

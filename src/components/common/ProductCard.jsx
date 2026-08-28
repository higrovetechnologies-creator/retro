import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ProductCard({ product, index = 0 }) {
  const discount =
    product.was_price && product.was_price > product.now_price
      ? Math.round(
          ((product.was_price - product.now_price) / product.was_price) * 100
        )
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        margin: "-40px",
      }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block"
      >
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-[20px] border border-line bg-charcoal">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={product.images?.[0]}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.06]
              "
            />
          </div>

          {/* Hover Gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/40
              via-transparent
              to-transparent
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          {/* Offer Badge */}
          {product.is_offer && discount && (
            <span
              className="
                absolute
                right-3
                top-3
                inline-flex
                items-center
                rounded-full
                border
                border-white/20
                bg-gradient-to-br
                from-white
                via-[#c7c5bd]
                to-[#74736f]
                px-3.5
                py-1.5
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#17171a]
                shadow-[0_4px_18px_rgba(255,255,255,0.16)]
              "
            >
              {discount}% Off
            </span>
          )}
        </div>

        {/* Product Information */}
        <div className="mt-3.5 px-0.5">
          <h3
            className="
              truncate
              font-sans
              text-[13.5px]
              font-medium
              text-bone/95
            "
          >
            {product.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="font-display text-[15px] text-bone">
              ₹{product.now_price}
            </span>

            {product.was_price && (
              <span className="text-[12px] text-mist line-through">
                ₹{product.was_price}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

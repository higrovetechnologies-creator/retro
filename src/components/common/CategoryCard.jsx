import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function CategoryCard({ category }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/${category.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-[22px] border border-line"
      >
        <img
          src={category.image}
          alt={category.label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <span className="font-display text-2xl text-bone">{category.label}</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full glass text-bone transition-transform duration-500 group-hover:rotate-45">
            <ArrowUpRight size={16} strokeWidth={1.75} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

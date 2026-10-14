interface OfferBannerProps {
  title: string;
  description: string;
  badgeText?: string | null;
}

export function OfferBanner({ title, description, badgeText }: OfferBannerProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-brand px-6 py-4 text-white shadow-md">
      {badgeText && (
        <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{badgeText}</span>
      )}
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-white/85">{description}</p>
      </div>
    </div>
  );
}

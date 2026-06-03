'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export function Spinner({ size = 18 }: { size?: number }) {
  const t = useTranslations('common');
  return (
    <span
      className="lb-spinner"
      style={{
        width: size,
        height: size,
      }}
      aria-label={t('loading')}
    />
  );
}

export function SkeletonLine({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={`lb-skeleton ${className}`}
      style={style}
      data-testid="skeleton"
    />
  );
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
}: {
  title?: string;
  description?: string;
  onRetry?: (() => void) | (() => Promise<void>);
  retryLabel?: string;
}) {
  const t = useTranslations('common');
  const resolvedTitle = title ?? t('errorTitle');
  const resolvedDescription = description ?? t('errorDescription');
  const resolvedRetryLabel = retryLabel ?? t('retry');
  return (
    <div className="rounded-[26px] border border-[#f1d0d0] bg-white px-4 py-4 text-[#2a2730] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
      <div className="text-[14px] font-extrabold text-[#9b3e3e]">{resolvedTitle}</div>
      <div className="mt-2 text-[12px] font-semibold text-[#7f7669]">{resolvedDescription}</div>
      {onRetry ? (
        <button
          type="button"
          onClick={() => void onRetry()}
          className="mobile-pill mt-4 h-11 w-full bg-[#9b3e3e] text-[12px] font-extrabold uppercase tracking-[0.14em] text-white"
        >
          {resolvedRetryLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-[#ece2d3] bg-white px-4 py-4 text-[#2a2730] shadow-[0_8px_24px_rgba(31,26,10,0.05)]">
      <div className="text-[14px] font-extrabold text-[#7f7669]">{title}</div>
      {description ? (
        <div className="mt-2 text-[12px] font-semibold text-[#8b816f]">{description}</div>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

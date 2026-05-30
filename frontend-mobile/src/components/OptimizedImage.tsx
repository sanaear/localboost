import type { ImgHTMLAttributes } from "react";
import { getCloudinaryOptimizedSrc, getCloudinaryOptimizedSrcSet } from "@/lib/cloudinary";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "width" | "height" | "loading" | "decoding"> & {
  src: string;
  width: number;
  height: number;
  priority?: boolean;
  widths?: number[];
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority,
  widths,
  sizes,
  ...rest
}: Props) {
  const defaultWidths = widths ?? [width, width * 2];
  const optimizedSrc = getCloudinaryOptimizedSrc(src, width) ?? src;
  const optimizedSrcSet = getCloudinaryOptimizedSrcSet(src, defaultWidths);

  return (
    <img
      src={optimizedSrc}
      srcSet={optimizedSrcSet ?? undefined}
      sizes={optimizedSrcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...rest}
    />
  );
}


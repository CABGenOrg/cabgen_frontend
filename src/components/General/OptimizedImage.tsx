"use client";

import React from "react";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  loading?: "eager" | "lazy";
  quality?: number;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  sizes,
  priority,
  fill,
  objectFit,
  placeholder,
  blurDataURL,
  loading,
  quality,
}: OptimizedImageProps) => {
  const baseClasses = fill
    ? `transition-opacity blur duration-300 ${className ?? ""}`
    : `max-w-full max-h-full transition-opacity blur duration-300 ${className ?? ""}`;

  const objectFitClass = objectFit ? `object-${objectFit}` : "";
  const finalClassName = `${baseClasses} ${objectFitClass}`.trim();

  const commonProps = {
    src,
    alt,
    sizes: sizes ?? "100vw",
    quality: quality ?? 75,
    className: finalClassName,
    onLoad: (image: React.SyntheticEvent<HTMLImageElement>) =>
      image.currentTarget.classList.remove("blur"),
    priority,
    loading,
    placeholder: (blurDataURL ? "blur" : placeholder) ?? "empty",
    blurDataURL,
  } as const;

  if (fill) {
    return <Image {...commonProps} fill />;
  }

  return (
    <Image
      {...commonProps}
      width={width ?? 1000}
      height={height ?? 1000}
    />
  );
};

export default OptimizedImage;

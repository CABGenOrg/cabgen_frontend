"use client";
import React from "react";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
}

const OptimizedImage = ({ src, alt, width, height, className, sizes }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width ? width : 1000}
      height={height ? height : 1000}
      sizes={sizes ?? "100vw"}
      quality={75}
      className={
        className
          ? `max-w-full max-h-full ${className} transition-opacity blur duration-300`
          : "max-w-full max-h-full"
      }
      onLoad={(image) => image.currentTarget.classList.remove("blur")}
    />
  );
};

export default OptimizedImage;

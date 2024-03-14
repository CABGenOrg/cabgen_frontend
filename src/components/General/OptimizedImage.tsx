"use client";
import React from "react";
import Image from "next/image";

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const OptimizedImage = ({ src, alt, width, height, className }: ImageProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width ? width : 2500}
      height={height ? height : 2500}
      quality={65}
      className={
        className ? `${className} transition-all blur duration-300` : ""
      }
      onLoad={(image) => image.currentTarget.classList.remove("blur")}
      priority
    />
  );
};

export default OptimizedImage;

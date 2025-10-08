"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ImageWithFallback = ({
  fallback = "/assets/images/dummy.jpg",
  alt,
  src,
  ...props
}: ImageWithFallbackProps) => {
  const [error, setError] = useState<boolean | null>(null);
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  useEffect(() => {
    setError(null);
    setImgSrc(src || fallback);
  }, [src, fallback]);

  return (
    <Image
    alt={alt}
    src={error ? fallback : imgSrc}
    onError={() => setError(true)}
    {...props}
    />
  );
};

export default ImageWithFallback;

/*   WE CAN SHORT THE ABOVE CODE LIKE THIS */

// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const ImageWithFallback = ({
//   fallback = "/assets/images/dummy.jpg",
//   alt,
//   src,
//   ...props
// }: ImageWithFallbackProps) => {
//   const [imgSrc, setImgSrc] = useState(src || fallback);

//   useEffect(() => {
//     setImgSrc(src || fallback);
//   }, [src, fallback]);

//   return (
//     <Image
//       alt={alt}
//       onError={() => setImgSrc(fallback)}
//       src={imgSrc}
//       {...props}
//     />
//   );
// };

// export default ImageWithFallback;

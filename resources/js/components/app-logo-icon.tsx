import { ImgHTMLAttributes } from "react";

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      src="/storage/logo.png" // ✅ apna logo ka path yahan do (public/images/logo.png)
      alt="App Logo"
      className="h-5 w-auto" // height/width Tailwind classes
    />
  );
}

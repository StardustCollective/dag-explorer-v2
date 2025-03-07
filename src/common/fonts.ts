import clsx from "clsx";
import localFont from "next/font/local";
import { Inter, IBM_Plex_Mono } from "next/font/google";

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const twkLausanne = localFont({
  // weight: '50 1000',
  variable: "--font-twk-lausanne",
  src: [
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-50.woff2",
      weight: "50",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-50Italic.woff2",
      weight: "50",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-100.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-100Italic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-150.woff2",
      weight: "150",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-150Italic.woff2",
      weight: "150",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-200.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-200Italic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-250.woff2",
      weight: "250",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-250Italic.woff2",
      weight: "250",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-300.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-300Italic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-350.woff2",
      weight: "350",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-350Italic.woff2",
      weight: "350",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-400Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-450.woff2",
      weight: "450",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-450Italic.woff2",
      weight: "450",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-500Italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-550.woff2",
      weight: "550",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-550Italic.woff2",
      weight: "550",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-600Italic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-650.woff2",
      weight: "650",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-650Italic.woff2",
      weight: "650",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-700.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-700Italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-750.woff2",
      weight: "750",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-750Italic.woff2",
      weight: "750",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-800.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-800Italic.woff2",
      weight: "800",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-850.woff2",
      weight: "850",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-850Italic.woff2",
      weight: "850",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-900.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-900Italic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-950.woff2",
      weight: "950",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-950Italic.woff2",
      weight: "950",
      style: "italic",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-1000.woff2",
      weight: "1000",
      style: "normal",
    },
    {
      path: "../assets/fonts/Lausanne/woff2/TWKLausanne-1000Italic.woff2",
      weight: "1000",
      style: "italic",
    },
  ],
});

export const fontVariables = clsx(
  inter.variable,
  ibmPlexMono.variable,
  twkLausanne.variable
);

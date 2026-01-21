import "@/styles/globals.css";

export const metadata = {
  title: "Low Shipping Image Optimizer",
  description: "Optimize product images for lower shipping",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

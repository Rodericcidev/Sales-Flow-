export const metadata = {
  title: "Sales Flow",
  description: "Simple sales follow-up system for B2B teams",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#ffffff", color: "#111111" }}>
        {children}
      </body>
    </html>
  );
}

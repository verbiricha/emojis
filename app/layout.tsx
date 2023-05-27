import { Providers } from "./providers";
import Grid from "@emoji/components/Grid";
export const metadata = {
  title: "Emoji",
  description: "Manage your nostr emoji collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <main>
            <Grid>{children}</Grid>
          </main>
        </body>
      </Providers>
    </html>
  );
}

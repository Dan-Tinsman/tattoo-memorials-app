import { GeistSans } from "geist/font/sans";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Tattoo Memorial App",
    description: "Tattoo Memorial App",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={GeistSans.className}>
            <head>
                <script
                    src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
                    async
                    defer
                ></script>
            </head>
            <body className="bg-background text-foreground">
                <main className="min-h-screen flex flex-col items-center">
                    {children}
                </main>
            </body>
        </html>
    );
}

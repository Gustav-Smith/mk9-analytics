import "./globals.css";
import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
    title: "MK9 Analytics",
    description: "Plataforma de Gestão Operacional de Trade Marketing",
};

export default function HomePage() {
    return (
        <main
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "2rem",
                fontWeight: "bold",
            }}
        >
            🚀 MK9 Analytics
        </main>
    );
}
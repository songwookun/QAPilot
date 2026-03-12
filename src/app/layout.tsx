import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QASupport - QA 학습 플랫폼",
  description:
    "QA 준비생을 위한 실습형 QA 학습 플랫폼. 기획서 기반 TC/CL 작성부터 버그 리포트까지.",
  verification: {
    google: "u7LtiogX1Rpi_iSoQIRPvceTCQ-yMayn8WbMCLuVF2k",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}

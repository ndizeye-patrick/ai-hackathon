import ChatSection from "./components/chat-section";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-10 p-24 bg-gradient-to-bl from-slate-300 to-blue-50">
      <h1 className="font-bold text-4xl">Mucyo AI</h1>
      <ChatSection />
      <Footer />
    </main>
  );
}

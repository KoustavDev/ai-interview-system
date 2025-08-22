import NavigationBar from "@/components/navigationBar";

export default async function RootLayout({ children }) {
  return (
    <main>
      <NavigationBar />
      {children}
    </main>
  );
}

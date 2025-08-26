export const metadata = {
  title: "Dashboard | AI Interview System",
  description: "Recruiters can manage and track their job postings.",
};

export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}

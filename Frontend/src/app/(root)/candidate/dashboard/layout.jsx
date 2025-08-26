export const metadata = {
  title: "Dashboard | AI Interview System",
  description: "Candidate dashboard to browse jobs and apply easily.",
};
export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}

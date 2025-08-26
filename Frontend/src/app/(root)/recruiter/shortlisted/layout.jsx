export const metadata = {
  title: "Shortlisted | AI Interview System",
  description: "Recruiters can view candidates shortlisted from interviews.",
};
export default async function Layout({ children }) {
  return (
    <div>
      <section>{children}</section>
    </div>
  );
}

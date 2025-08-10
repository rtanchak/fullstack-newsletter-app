export default function AuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="author-layout">
      {children}
    </div>
  );
}

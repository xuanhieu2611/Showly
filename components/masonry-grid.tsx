type Props = {
  children: React.ReactNode;
};

export function MasonryGrid({ children }: Props) {
  return (
    <div className="columns-2 sm:columns-3 gap-3">
      {children}
    </div>
  );
}

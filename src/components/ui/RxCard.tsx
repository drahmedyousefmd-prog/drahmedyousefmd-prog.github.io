/**
 * Prescription drug row — the primary medication block in the Rx column.
 * Styling via `.rx-primary` & friends.
 */
export function RxCard({
  name,
  instruction,
  price,
}: {
  name: string;
  instruction?: string;
  price?: string | null;
}) {
  return (
    <div className="rx-primary">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="rx-drug-name">{name}</div>
          {instruction && <div className="rx-instruction mt-0.5">{instruction}</div>}
        </div>
        {price ? <span className="rx-price">{price}</span> : null}
      </div>
    </div>
  );
}
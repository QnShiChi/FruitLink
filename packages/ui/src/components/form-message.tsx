export function FormMessage(props: { type: 'error' | 'success'; message: string }) {
  const tone =
    props.type === 'error'
      ? 'border-red-300 bg-red-50 text-red-700'
      : 'border-emerald-300 bg-emerald-50 text-emerald-700';

  return <div className={`rounded border px-4 py-3 text-sm ${tone}`}>{props.message}</div>;
}

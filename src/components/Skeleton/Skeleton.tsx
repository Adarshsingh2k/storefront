interface Props {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export default function Skeleton({ width = '100%', height = '16px', borderRadius = '4px' }: Props) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
     
    />
  );
}

interface Props {
  step: number;
  title: string;
  description: string;
}

export default function StepHeader({ step, title, description }: Props) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">{step}</span>
        </div>
        <h1 className="text-xl font-bold text-brand-text">{title}</h1>
      </div>
      <p className="text-sm text-brand-muted ml-11">{description}</p>
    </div>
  );
}

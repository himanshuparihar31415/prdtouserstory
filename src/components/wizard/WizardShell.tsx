import type { ReactNode } from 'react';
import StepSidebar from '../layout/StepSidebar';
import StepHeader from '../layout/StepHeader';

interface Props {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}

export default function WizardShell({ step, title, description, children }: Props) {
  return (
    <div className="flex h-[calc(100vh-56px)]">
      <StepSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <StepHeader step={step} title={title} description={description} />
        {children}
      </main>
    </div>
  );
}

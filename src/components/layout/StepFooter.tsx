import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '../../store/wizardStore';

interface Props {
  step: number;
  onNext?: () => void;
  nextLabel?: string;
  canProceed?: boolean;
  hideNext?: boolean;
}

export default function StepFooter({ step, onNext, nextLabel = 'Continue', canProceed = true, hideNext = false }: Props) {
  const { projectId } = useParams<{ projectId: string }>();
  const { markStepComplete } = useWizardStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
    markStepComplete(step);
    navigate(`/projects/${projectId}/steps/${step + 1}`);
  };

  const handleBack = () => {
    navigate(`/projects/${projectId}/steps/${step - 1}`);
  };

  return (
    <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100">
      {step > 1 ? (
        <button onClick={handleBack} className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
      ) : (
        <div />
      )}
      {!hideNext && step < 13 && (
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`btn-primary flex items-center gap-2 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {nextLabel} <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

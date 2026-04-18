import { useEffect, useRef, useState } from 'react';
import { simulateStream } from '../../mock/mockStream';

interface Props {
  fullText: string;
  onDone?: () => void;
  className?: string;
}

export default function StreamingText({ fullText, onDone, className = '' }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    cancelRef.current = simulateStream(
      fullText,
      (chunk) => setDisplayed((prev) => prev + chunk),
      () => { setDone(true); onDone?.(); }
    );
    return () => cancelRef.current();
  }, [fullText]);

  return (
    <div className={`whitespace-pre-wrap font-sans text-sm text-brand-text leading-relaxed ${className}`}>
      {displayed}
      {!done && <span className="cursor-blink" />}
    </div>
  );
}

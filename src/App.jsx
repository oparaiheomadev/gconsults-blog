import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="p-10 space-y-4">
      <h1 className="text-4xl">GConsults Blog</h1>
      <p className="text-muted-foreground">Same colors as the website.</p>
      <Button>Primary button</Button>
    </div>
  );
}

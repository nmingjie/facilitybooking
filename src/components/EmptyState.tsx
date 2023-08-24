'use client';

import { useRouter } from "next/navigation";

import {Button} from "@/components/ui/button";
import Heading from "./Heading";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  resetUrl?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
  resetUrl = "/"
}) => {
  const router = useRouter();

  return ( 
    <div 
      className="
        h-[60vh]
        flex 
        flex-col 
        gap-2 
        justify-center 
        items-center 
      "
    >
      <Heading
        center
        title={title}
        subtitle={subtitle}
      />
      <div className="w-48 mt-4">
        {showReset && (
          <Button
            className="bg-blue-500"
            onClick={() => router.push(resetUrl)}
          >Remove all filters
          </Button>
        )}
      </div>
    </div>
   );
}
 
export default EmptyState;
import { Badge } from "@/components/ui/badge"
import { ConfidenceBar } from "./ConfidenceBar"
import type { ResultCardProps } from "@/types"

export function ResultCard({ 
  sizeLabel, 
  confidence, 
  rationale, 
  alternates = [] 
}: ResultCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Size Recommendation</h3>
        <Badge className="text-lg px-4 py-2">
          {sizeLabel}
        </Badge>
      </div>
      
      <div className="space-y-4">
        <ConfidenceBar value={confidence} />
        
        <div>
          <h4 className="font-medium mb-2">Reasoning</h4>
          <p className="text-sm text-muted-foreground">{rationale}</p>
        </div>

        {alternates.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Alternative Sizes</h4>
            <div className="flex flex-wrap gap-2">
              {alternates.map((size) => (
                <Badge key={size} variant="outline" className="text-xs">
                  {size}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

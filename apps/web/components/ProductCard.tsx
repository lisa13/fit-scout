import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";
import type { ProductCardProps } from "@/types";

export function ProductCard({
  image,
  title,
  brandName,
  price,
  score,
  reason,
}: ProductCardProps) {
  return (
    <div className="card overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-square bg-muted">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute right-3 top-3 flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 bg-background/80 p-0 hover:bg-background"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {score && (
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-background/80">
              {Math.round(score * 100)}%
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">
          {title}
        </h3>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${price}</span>
          <Badge variant="outline">{brandName}</Badge>
        </div>
        {reason && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">{reason}</p>
          </div>
        )}
        <Button className="w-full" size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          View Product
        </Button>
      </div>
    </div>
  );
}

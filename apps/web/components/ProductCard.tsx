import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Heart } from "lucide-react"
import type { ProductCardProps } from "@/types"

export function ProductCard({ 
  image, 
  title, 
  brandName, 
  price, 
  score, 
  reason 
}: ProductCardProps) {
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-background/80 hover:bg-background">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {score && (
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-background/80">
              {Math.round(score * 100)}%
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">
            ${price}
          </span>
          <Badge variant="outline">{brandName}</Badge>
        </div>
        {reason && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground">{reason}</p>
          </div>
        )}
        <Button className="w-full" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Product
        </Button>
      </div>
    </div>
  )
}

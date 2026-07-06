import { useState, useRef, useEffect } from "react";
import { ProgressPhoto } from "@/types/progress";
import { format, parseISO } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoveHorizontal } from "lucide-react";

interface PhotoComparisonProps {
  photos: ProgressPhoto[];
}

export function PhotoComparison({ photos }: PhotoComparisonProps) {
  if (!photos || photos.length < 2) {
    return (
      <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
        <p className="text-muted-foreground">Upload at least 2 photo records to enable the comparison tool.</p>
      </div>
    );
  }

  // Sort photos oldest to newest for the selector
  const sortedPhotos = [...photos].sort((a, b) => new Date(a.record_date).getTime() - new Date(b.record_date).getTime());
  
  const [beforeId, setBeforeId] = useState<string>(sortedPhotos[0].id);
  const [afterId, setAfterId] = useState<string>(sortedPhotos[sortedPhotos.length - 1].id);
  const [viewAngle, setViewAngle] = useState<'front' | 'back' | 'left' | 'right'>('front');

  const beforePhoto = photos.find(p => p.id === beforeId);
  const afterPhoto = photos.find(p => p.id === afterId);

  const beforeUrl = beforePhoto ? beforePhoto[`${viewAngle}_url`] : undefined;
  const afterUrl = afterPhoto ? afterPhoto[`${viewAngle}_url`] : undefined;

  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/20 p-4 rounded-xl border">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Before</label>
          <Select value={beforeId} onValueChange={(val) => setBeforeId(val as string)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortedPhotos.map(p => (
                <SelectItem key={p.id} value={p.id}>{format(parseISO(p.record_date), "MMM dd, yyyy")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs font-semibold text-muted-foreground uppercase">Angle</label>
          <Select value={viewAngle} onValueChange={(val: any) => setViewAngle(val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="front">Front</SelectItem>
              <SelectItem value="back">Back</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 space-y-1 w-full">
          <label className="text-xs font-semibold text-muted-foreground uppercase">After</label>
          <Select value={afterId} onValueChange={(val) => setAfterId(val as string)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortedPhotos.map(p => (
                <SelectItem key={p.id} value={p.id}>{format(parseISO(p.record_date), "MMM dd, yyyy")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(!beforeUrl || !afterUrl) ? (
        <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground">Missing photos for the selected dates/angle.</p>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className="relative w-full aspect-[3/4] sm:aspect-square md:aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none border-4 border-background shadow-2xl"
          onMouseDown={(e) => { setIsDragging(true); handleMove(e.clientX); }}
          onTouchStart={(e) => { setIsDragging(true); handleMove(e.touches[0].clientX); }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* After Photo (Base) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={afterUrl} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
          
          {/* Before Photo (Clipped) */}
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={beforeUrl} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
          </div>

          {/* Slider Line */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white pointer-events-none drop-shadow-md"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-lg text-black">
              <MoveHorizontal className="h-5 w-5" />
            </div>
          </div>
          
          {/* Labels */}
          <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold pointer-events-none backdrop-blur-sm">
            Before
          </div>
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-semibold pointer-events-none backdrop-blur-sm">
            After
          </div>
        </div>
      )}
    </div>
  );
}

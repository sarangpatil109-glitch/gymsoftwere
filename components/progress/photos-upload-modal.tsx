import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { useAddProgressPhoto } from "@/hooks/useProgress";
import { Member } from "@/types/member";

const photoSchema = z.object({
  record_date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

type PhotoFormValues = z.infer<typeof photoSchema>;

interface PhotosUploadModalProps {
  member: Member;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotosUploadModal({ member, open, onOpenChange }: PhotosUploadModalProps) {
  const addPhotos = useAddProgressPhoto();
  
  const [files, setFiles] = useState<{ front?: File, back?: File, left?: File, right?: File }>({});
  const [previews, setPreviews] = useState<{ front?: string, back?: string, left?: string, right?: string }>({});

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PhotoFormValues>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      record_date: new Date().toISOString().split('T')[0],
      notes: "",
    }
  });

  const handleFileChange = (type: 'front' | 'back' | 'left' | 'right', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const removeFile = (type: 'front' | 'back' | 'left' | 'right') => {
    setFiles(prev => { const newFiles = { ...prev }; delete newFiles[type]; return newFiles; });
    setPreviews(prev => { const newPreviews = { ...prev }; delete newPreviews[type]; return newPreviews; });
  };

  const onSubmit = (data: PhotoFormValues) => {
    if (!files.front && !files.back && !files.left && !files.right) {
      alert("Please upload at least one photo");
      return;
    }

    addPhotos.mutate({
      payload: {
        member_id: member.id,
        record_date: data.record_date,
        notes: data.notes
      },
      files
    }, {
      onSuccess: () => {
        reset();
        setFiles({});
        setPreviews({});
        onOpenChange(false);
      }
    });
  };

  const UploadBox = ({ type, label }: { type: 'front' | 'back' | 'left' | 'right', label: string }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div 
          className="border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center relative overflow-hidden bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => !previews[type] && inputRef.current?.click()}
        >
          {previews[type] ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previews[type]} alt={label} className="absolute inset-0 w-full h-full object-cover" />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={(e) => { e.stopPropagation(); removeFile(type); }}
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          ) : (
            <div className="text-center p-4">
              <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Click to upload</p>
            </div>
          )}
          <input 
            type="file" 
            ref={inputRef}
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileChange(type, e)}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Progress Photos</DialogTitle>
          <DialogDescription>
            Upload photos for {member.fullName} to track visual progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          
          <div className="grid grid-cols-2 gap-4">
            <UploadBox type="front" label="Front View" />
            <UploadBox type="back" label="Back View" />
            <UploadBox type="left" label="Left Side" />
            <UploadBox type="right" label="Right Side" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" {...register("record_date")} />
              {errors.record_date && <p className="text-sm text-destructive">{errors.record_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea placeholder="Any notes on this check-in..." {...register("notes")} rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={addPhotos.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={addPhotos.isPending}>
              {addPhotos.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Photos
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadPortfolioPhoto, publishProfile } from "@/app/actions/onboarding";
import { deletePhoto, updatePhotoOrder, setCoverPhoto } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";

type Photo = {
  id: string;
  image_url: string;
  thumbnail_url: string;
  title: string | null;
  is_cover: boolean | null;
  sort_order: number | null;
};

type Props = {
  artistId: string;
  photos: Photo[];
  isPublished: boolean;
};

export function PortfolioManager({ artistId, photos: initialPhotos, isPublished }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (photos.length >= 50) return;
      setUploading(true);
      const newPhotos: Photo[] = [];
      for (const file of accepted.slice(0, 50 - photos.length)) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadPortfolioPhoto(artistId, fd);
        if (result.photo) {
          newPhotos.push({
            ...result.photo,
            title: null,
            is_cover: photos.length === 0 && newPhotos.length === 0,
            sort_order: photos.length + newPhotos.length,
          });
        }
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
      setUploading(false);
    },
    [artistId, photos.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    disabled: uploading || photos.length >= 50,
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = photos.findIndex((p) => p.id === active.id);
    const newIndex = photos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(photos, oldIndex, newIndex);
    setPhotos(reordered);
    await updatePhotoOrder(reordered.map((p) => p.id));
  };

  const handleDelete = async (id: string) => {
    await deletePhoto(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSetCover = async (id: string) => {
    await setCoverPhoto(id);
    setPhotos((prev) =>
      prev.map((p) => ({ ...p, is_cover: p.id === id }))
    );
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    await publishProfile(artistId);
  };

  return (
    <div className="space-y-6">
      {/* Publish banner */}
      {!isPublished && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-800">
              {photos.length < 3
                ? `Cần thêm ${3 - photos.length} ảnh nữa để công bố hồ sơ`
                : "Đã đủ 3 ảnh — sẵn sàng công bố!"}
            </p>
          </div>
          {photos.length >= 3 && (
            <Button
              onClick={handlePublish}
              disabled={publishLoading}
              className="shrink-0 bg-[#C9A96E] hover:bg-[#B8925A] text-white"
            >
              {publishLoading ? "Đang xử lý..." : "Công bố hồ sơ 🎉"}
            </Button>
          )}
        </div>
      )}

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-[#C9A96E] bg-[#FDF8F2]" : "border-[#E8E2DB] hover:border-[#C9A96E]/50"
        } ${photos.length >= 50 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="text-2xl mb-1">📸</p>
        <p className="text-sm font-medium text-[#1C1C1C]">
          {uploading ? "Đang tải lên..." : photos.length >= 50 ? "Đã đạt giới hạn 50 ảnh" : "Kéo thả hoặc nhấn để thêm ảnh"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WEBP — tối đa 10MB</p>
      </div>

      {/* Sortable photo grid */}
      {photos.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  onDelete={handleDelete}
                  onSetCover={handleSetCover}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {photos.length === 0 && !uploading && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">🖼️</p>
          <p className="text-sm">Chưa có ảnh nào. Hãy tải ảnh đầu tiên!</p>
        </div>
      )}
    </div>
  );
}

function SortablePhoto({
  photo,
  onDelete,
  onSetCover,
}: {
  photo: Photo;
  onDelete: (id: string) => Promise<void>;
  onSetCover: (id: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative aspect-square rounded-xl overflow-hidden bg-[#F2EDE8]">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
      />

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.thumbnail_url}
        alt={photo.title ?? "portfolio photo"}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {photo.is_cover && (
        <span className="absolute top-2 left-2 bg-[#C9A96E] text-white text-xs px-2 py-0.5 rounded-full font-medium z-10">
          Cover
        </span>
      )}

      {/* Hover actions */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 z-10">
        {!photo.is_cover && (
          <button
            onClick={() => onSetCover(photo.id)}
            className="text-xs bg-white/90 text-[#1C1C1C] px-2 py-1 rounded-lg font-medium hover:bg-white"
          >
            Đặt cover
          </button>
        )}
        <button
          onClick={() => onDelete(photo.id)}
          className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-medium hover:bg-red-600 ml-auto"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

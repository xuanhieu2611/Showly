"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { OnboardingStepper } from "@/components/onboarding-stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVINCES, getDistricts } from "@/lib/vietnam-locations";
import { useOnboardingStore } from "@/lib/onboarding-store";
import {
  createArtistProfile,
  uploadPortfolioPhoto,
  publishProfile,
} from "@/app/actions/onboarding";
import { createClient } from "@/lib/supabase/client";

const STEP_LABELS = ["Username", "Chuyên môn", "Vị trí", "Ảnh đầu tiên"];

const SPECIALTIES = [
  { value: "nail", emoji: "💅", label: "Nail Art" },
  { value: "makeup", emoji: "💄", label: "Trang điểm" },
  { value: "hair", emoji: "✂️", label: "Làm tóc" },
];

type Photo = { id: string; image_url: string; thumbnail_url: string; preview?: string };

export default function JoinPage() {
  const store = useOnboardingStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [artistId, setArtistId] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");

  useEffect(() => {
    // Redirect if already has a profile
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
    });
  }, [router]);

  // Debounced username check
  useEffect(() => {
    if (!store.username) { setUsernameStatus("idle"); return; }
    if (!/^[a-z0-9_]{3,30}$/.test(store.username)) { setUsernameStatus("invalid"); return; }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/username-check?username=${store.username}`);
      const json = await res.json();
      setUsernameStatus(json.available ? "available" : "taken");
    }, 400);
    return () => clearTimeout(timer);
  }, [store.username]);

  const handleNext = async () => {
    setError("");
    if (store.step === 1) {
      if (usernameStatus !== "available") return;
      store.setStep(2);
    } else if (store.step === 2) {
      if (store.specialties.length === 0) { setError("Chọn ít nhất một chuyên môn"); return; }
      store.setStep(3);
    } else if (store.step === 3) {
      if (!store.city || !store.district) { setError("Vui lòng chọn tỉnh/thành và quận/huyện"); return; }
      setLoading(true);
      try {
        const result = await createArtistProfile({
          username: store.username,
          displayName: store.displayName || store.username,
          specialties: store.specialties,
          city: store.city,
          district: store.district,
        });
        setLoading(false);
        if (result.error) { setError(result.error); return; }
        setArtistId(result.profileId!);
        store.setStep(4);
      } catch {
        setLoading(false);
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } else if (store.step === 4) {
      if (!artistId) return;
      if (photos.length < 3) { setError("Cần ít nhất 3 ảnh để công bố hồ sơ"); return; }
      setLoading(true);
      try {
        const result = await publishProfile(artistId);
        if ("redirect" in result) {
          router.push(result.redirect);
        } else {
          setError(result.error);
          setLoading(false);
        }
      } catch {
        setLoading(false);
        setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (!artistId) return;
      setUploading(true);
      try {
        for (const file of accepted.slice(0, 50 - photos.length)) {
          const fd = new FormData();
          fd.append("file", file);
          const result = await uploadPortfolioPhoto(artistId, fd);
          if (result.photo) {
            setPhotos((prev) => [
              ...prev,
              { ...result.photo!, preview: URL.createObjectURL(file) },
            ]);
          } else if (result.error) {
            setError(result.error);
          }
        }
      } catch {
        setError("Tải ảnh thất bại. Vui lòng thử lại.");
      } finally {
        setUploading(false);
      }
    },
    [artistId, photos.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    disabled: !artistId || uploading,
  });

  const canNext =
    (store.step === 1 && usernameStatus === "available") ||
    (store.step === 2 && store.specialties.length > 0) ||
    (store.step === 3 && !!store.city && !!store.district) ||
    (store.step === 4 && photos.length >= 3);

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[#1C1C1C]">Tạo portfolio</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bước {store.step} / 4</p>
        </div>

        <OnboardingStepper currentStep={store.step} labels={STEP_LABELS} />

        <div className="bg-white rounded-2xl border border-[#E8E2DB] p-6 shadow-sm space-y-6">

          {/* Step 1 — Username */}
          {store.step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Chọn tên người dùng</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Đây là link portfolio của bạn: <span className="text-[#C9A96E]">showly.vn/@{store.username || "tên-của-bạn"}</span>
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="display-name">Tên hiển thị</Label>
                <Input
                  id="display-name"
                  placeholder="Nguyễn Thị Linh"
                  value={store.displayName}
                  onChange={(e) => store.setDisplayName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    placeholder="linh_nail"
                    value={store.username}
                    onChange={(e) => store.setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="h-11 pl-7"
                  />
                  {usernameStatus !== "idle" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                      {usernameStatus === "checking" && <span className="text-muted-foreground">...</span>}
                      {usernameStatus === "available" && <span className="text-green-600">✓ Khả dụng</span>}
                      {usernameStatus === "taken" && <span className="text-red-500">✗ Đã dùng</span>}
                      {usernameStatus === "invalid" && <span className="text-red-500">✗ Không hợp lệ</span>}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Chỉ dùng chữ thường, số và dấu _ (3–30 ký tự)
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Specialty */}
          {store.step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Chuyên môn của bạn</h2>
                <p className="text-sm text-muted-foreground mt-1">Chọn một hoặc nhiều chuyên môn</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => {
                      const has = store.specialties.includes(s.value);
                      store.setSpecialties(
                        has
                          ? store.specialties.filter((x) => x !== s.value)
                          : [...store.specialties, s.value]
                      );
                    }}
                    className={`p-4 rounded-xl border-2 text-center transition-all space-y-2 ${
                      store.specialties.includes(s.value)
                        ? "border-[#C9A96E] bg-[#FDF8F2]"
                        : "border-[#E8E2DB] hover:border-[#C9A96E]/50"
                    }`}
                  >
                    <span className="text-3xl block">{s.emoji}</span>
                    <span className="text-sm font-medium">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Location */}
          {store.step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Vị trí của bạn</h2>
                <p className="text-sm text-muted-foreground mt-1">Khách hàng tìm bạn qua vị trí</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Tỉnh/Thành phố</Label>
                  <Select value={store.city} onValueChange={(v) => { if (v) store.setCity(v); }}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Chọn tỉnh/thành..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {store.city && (
                  <div className="space-y-2">
                    <Label>Quận/Huyện</Label>
                    <Select value={store.district} onValueChange={(v) => { if (v) store.setDistrict(v); }}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Chọn quận/huyện..." />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts(store.city).map((d) => (
                          <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4 — Photos */}
          {store.step === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-heading text-xl font-semibold">Tải ảnh portfolio</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Tải ít nhất 3 ảnh để công bố hồ sơ. ({photos.length}/3 tối thiểu)
                </p>
              </div>

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p) => (
                    <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-[#F2EDE8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.preview ?? p.thumbnail_url}
                        alt="portfolio photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-[#C9A96E] bg-[#FDF8F2]"
                    : "border-[#E8E2DB] hover:border-[#C9A96E]/50"
                }`}
              >
                <input {...getInputProps()} />
                <p className="text-3xl mb-2">📸</p>
                <p className="text-sm font-medium text-[#1C1C1C]">
                  {uploading ? "Đang tải lên..." : isDragActive ? "Thả ảnh vào đây" : "Kéo thả ảnh hoặc nhấn để chọn"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — tối đa 10MB mỗi ảnh</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {store.step > 1 && (
              <Button
                variant="outline"
                onClick={() => store.setStep(store.step - 1)}
                disabled={loading || uploading}
                className="flex-1 h-11"
              >
                Quay lại
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canNext || loading || uploading}
              className="flex-1 h-11 bg-[#C9A96E] hover:bg-[#B8925A] text-white font-semibold"
            >
              {loading
                ? "Đang xử lý..."
                : store.step === 4
                ? "Công bố hồ sơ 🎉"
                : "Tiếp theo →"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

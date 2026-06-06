"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PROVINCES, getDistricts } from "@/lib/vietnam-locations";
import { updateProfile } from "@/app/actions/dashboard";
import type { Tables } from "@/lib/supabase/types";

const SPECIALTIES = [
  { value: "nail", emoji: "💅", label: "Nail Art" },
  { value: "makeup", emoji: "💄", label: "Trang điểm" },
  { value: "hair", emoji: "✂️", label: "Làm tóc" },
];

const PRICE_OPTIONS = [
  { value: "contact", label: "Liên hệ" },
  { value: "under_200k", label: "Dưới 200.000₫" },
  { value: "200k_500k", label: "200.000₫ – 500.000₫" },
  { value: "500k_1m", label: "500.000₫ – 1.000.000₫" },
  { value: "above_1m", label: "Trên 1.000.000₫" },
];

const EXPERIENCE_OPTIONS = [
  { value: "under_1", label: "Dưới 1 năm" },
  { value: "1_3", label: "1 – 3 năm" },
  { value: "3_5", label: "3 – 5 năm" },
  { value: "5_plus", label: "Trên 5 năm" },
];

type Props = {
  profile: Tables<"artist_profiles">;
  displayName: string;
  specialties: string[];
};

export function EditProfileForm({ profile, displayName: initialDisplayName, specialties: initialSpecialties }: Props) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(profile.bio ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [district, setDistrict] = useState(profile.district ?? "");
  const [priceRange, setPriceRange] = useState(profile.price_range ?? "");
  const [yearsExperience, setYearsExperience] = useState(profile.years_experience ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(profile.tiktok_url ?? "");
  const [contactInfo, setContactInfo] = useState(profile.contact_info ?? "");
  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !district) { setError("Vui lòng chọn tỉnh/thành và quận/huyện"); return; }
    if (specialties.length === 0) { setError("Chọn ít nhất một chuyên môn"); return; }
    setSaving(true);
    setError("");
    const result = await updateProfile({
      displayName, bio, city, district, priceRange, yearsExperience,
      instagramUrl, tiktokUrl, contactInfo, specialties,
    });
    setSaving(false);
    if (result?.error) { setError(result.error); } else { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const toggleSpecialty = (val: string) => {
    setSpecialties((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Section title="Thông tin cơ bản">
        <Field label="Tên hiển thị">
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Nguyễn Thị Linh" className="h-11" />
        </Field>
        <Field label={`Bio (${bio.length}/300)`}>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            placeholder="Giới thiệu ngắn về bạn và phong cách làm việc..."
            rows={3}
          />
        </Field>
      </Section>

      <Section title="Chuyên môn">
        <div className="flex gap-3">
          {SPECIALTIES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => toggleSpecialty(s.value)}
              className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                specialties.includes(s.value)
                  ? "border-[#C9A96E] bg-[#FDF8F2]"
                  : "border-[#E8E2DB] hover:border-[#C9A96E]/50"
              }`}
            >
              <span className="text-xl block">{s.emoji}</span>
              <span className="text-xs font-medium mt-1 block">{s.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Vị trí">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tỉnh/Thành phố">
            <Select value={city} onValueChange={(v) => { if (v) { setCity(v); setDistrict(""); } }}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Chọn..." /></SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quận/Huyện">
            <Select value={district} onValueChange={(v) => { if (v) setDistrict(v); }} disabled={!city}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Chọn..." /></SelectTrigger>
              <SelectContent>
                {getDistricts(city).map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Dịch vụ">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Khoảng giá">
            <Select value={priceRange} onValueChange={(v) => { if (v) setPriceRange(v); }}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Chọn..." /></SelectTrigger>
              <SelectContent>
                {PRICE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Kinh nghiệm">
            <Select value={yearsExperience} onValueChange={(v) => { if (v) setYearsExperience(v); }}>
              <SelectTrigger className="h-11"><SelectValue placeholder="Chọn..." /></SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Mạng xã hội & Liên hệ">
        <Field label="Instagram URL">
          <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." className="h-11" />
        </Field>
        <Field label="TikTok URL">
          <Input value={tiktokUrl} onChange={(e) => setTiktokUrl(e.target.value)} placeholder="https://tiktok.com/@..." className="h-11" />
        </Field>
        <Field label="Số điện thoại / Zalo">
          <Input value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} placeholder="0901 234 567" className="h-11" />
          <p className="text-xs text-muted-foreground">Thông tin này không hiện trong HTML nguồn, chỉ hiện khi khách bấm nút liên hệ.</p>
        </Field>
      </Section>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={saving}
        className="w-full h-11 bg-[#C9A96E] hover:bg-[#B8925A] text-white font-semibold"
      >
        {saving ? "Đang lưu..." : saved ? "✓ Đã lưu" : "Lưu thay đổi"}
      </Button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-4">
      <h3 className="font-semibold text-sm text-[#1C1C1C]">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, BarChart3, Megaphone, Crown, Eye, MousePointerClick, Power, Calendar, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { PLACEMENT_LABELS, type AdPlacement, type Ad, type SponsoredBusiness } from "@/hooks/useAds";

const PLACEMENTS: AdPlacement[] = ["hero", "middle", "news", "sidebar", "mobile_sticky", "popup", "carousel"];

const Admin = () => {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur sticky top-0 z-30">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to site
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-display text-xl">
              Admin <span className="gold-text">Console</span>
            </h1>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold">Open access (dev)</Badge>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="ads" className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-grid">
            <TabsTrigger value="ads"><Megaphone className="h-4 w-4 mr-2" />Ads</TabsTrigger>
            <TabsTrigger value="sponsored"><Crown className="h-4 w-4 mr-2" />Sponsored</TabsTrigger>
            <TabsTrigger value="analytics"><BarChart3 className="h-4 w-4 mr-2" />Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="ads" className="mt-6"><AdsManager /></TabsContent>
          <TabsContent value="sponsored" className="mt-6"><SponsoredManager /></TabsContent>
          <TabsContent value="analytics" className="mt-6"><AdAnalytics /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Admin;

/* ---------------- ADS MANAGER ---------------- */

const emptyAd: Partial<Ad> = {
  title: "",
  description: "",
  image_url: "",
  redirect_url: "",
  placement: "hero",
  priority: 0,
  is_active: true,
};

function AdsManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<Ad> | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
    setAds((data ?? []) as Ad[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return ads;
    if (filter === "active") return ads.filter((a) => a.is_active);
    if (filter === "expired") return ads.filter((a) => a.end_date && new Date(a.end_date) < new Date());
    return ads.filter((a) => a.placement === filter);
  }, [ads, filter]);

  const onSave = async (form: Partial<Ad>) => {
    const payload: any = { ...form };
    delete payload.created_at; delete payload.updated_at;
    delete payload.impressions; delete payload.clicks;
    if (form.id) {
      const { error } = await supabase.from("ads").update(payload).eq("id", form.id);
      if (error) return toast.error(error.message);
      toast.success("Ad updated");
    } else {
      delete payload.id;
      const { error } = await supabase.from("ads").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Ad created");
    }
    setEditing(null);
    load();
  };

  const onToggle = async (ad: Ad) => {
    const { error } = await supabase.from("ads").update({ is_active: !ad.is_active }).eq("id", ad.id);
    if (error) toast.error(error.message); else { toast.success(ad.is_active ? "Disabled" : "Enabled"); load(); }
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
    setConfirmDel(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ads</SelectItem>
              <SelectItem value="active">Active only</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              {PLACEMENTS.map((p) => (
                <SelectItem key={p} value={p}>{PLACEMENT_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{filtered.length} ad(s)</span>
        </div>
        <Button onClick={() => setEditing({ ...emptyAd })} className="bg-gradient-gold text-gold-foreground shadow-gold">
          <Plus className="h-4 w-4 mr-1" /> New ad
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">No ads yet. Create your first one.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ad) => {
            const expired = ad.end_date && new Date(ad.end_date) < new Date();
            return (
              <Card key={ad.id} className="overflow-hidden flex flex-col">
                <div className="aspect-[16/9] bg-muted relative">
                  {ad.image_url && <img src={ad.image_url} alt="" className="h-full w-full object-cover" />}
                  <Badge className="absolute top-2 left-2 bg-gold text-gold-foreground">{PLACEMENT_LABELS[ad.placement]}</Badge>
                  {!ad.is_active && <Badge variant="secondary" className="absolute top-2 right-2">Inactive</Badge>}
                  {expired && <Badge variant="destructive" className="absolute bottom-2 right-2">Expired</Badge>}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="font-semibold line-clamp-1">{ad.title}</div>
                  {ad.description && <div className="text-xs text-muted-foreground line-clamp-2">{ad.description}</div>}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-2">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{ad.impressions}</span>
                    <span className="inline-flex items-center gap-1"><MousePointerClick className="h-3 w-3" />{ad.clicks}</span>
                    <span className="ml-auto">CTR {ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button size="sm" variant="ghost" onClick={() => onToggle(ad)}>
                      <Power className={`h-4 w-4 mr-1 ${ad.is_active ? "text-green-600" : "text-muted-foreground"}`} />
                      {ad.is_active ? "On" : "Off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(ad)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setConfirmDel(ad.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AdEditDialog ad={editing} onClose={() => setEditing(null)} onSave={onSave} />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this ad?</AlertDialogTitle>
            <AlertDialogDescription>This permanently removes the ad and its analytics.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && onDelete(confirmDel)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AdEditDialog({ ad, onClose, onSave }: { ad: Partial<Ad> | null; onClose: () => void; onSave: (a: Partial<Ad>) => void }) {
  const [form, setForm] = useState<Partial<Ad>>({});
  const [uploading, setUploading] = useState(false);
  useEffect(() => { setForm(ad ?? {}); }, [ad]);

  const upload = async (file: File) => {
    setUploading(true);
    const path = `ads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("ad-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("ad-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast.success("Image uploaded");
  };

  const set = <K extends keyof Ad>(k: K, v: Ad[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={!!ad} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit ad" : "New advertisement"}</DialogTitle>
          <DialogDescription>Configure placement, schedule and creative.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="Eg. Diwali Mega Sale at Heera Jewellers" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2} />
          </div>
          <div className="grid gap-2">
            <Label>Banner image</Label>
            <div className="flex items-center gap-3">
              <Input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://… or upload" />
              <Label className="inline-flex items-center gap-2 cursor-pointer rounded-md border bg-background px-3 py-2 text-sm hover:bg-secondary shrink-0">
                <Upload className="h-4 w-4" /> {uploading ? "…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
              </Label>
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="rounded-md aspect-[16/6] object-cover w-full" />}
          </div>
          <div className="grid gap-2">
            <Label>Redirect URL</Label>
            <Input value={form.redirect_url ?? ""} onChange={(e) => set("redirect_url", e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Placement</Label>
              <Select value={form.placement ?? "hero"} onValueChange={(v) => set("placement", v as AdPlacement)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PLACEMENTS.map((p) => <SelectItem key={p} value={p}>{PLACEMENT_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Input type="number" value={form.priority ?? 0} onChange={(e) => set("priority", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start date</Label>
              <Input type="datetime-local" value={form.start_date ? toLocal(form.start_date) : ""} onChange={(e) => set("start_date", new Date(e.target.value).toISOString())} />
            </div>
            <div className="grid gap-2">
              <Label>End date (optional)</Label>
              <Input type="datetime-local" value={form.end_date ? toLocal(form.end_date) : ""} onChange={(e) => set("end_date", e.target.value ? new Date(e.target.value).toISOString() : null as any)} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <div className="font-medium text-sm">Active</div>
              <div className="text-xs text-muted-foreground">Show this ad on the site.</div>
            </div>
            <Switch checked={!!form.is_active} onCheckedChange={(v) => set("is_active", v)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.title || !form.image_url} className="bg-gradient-gold text-gold-foreground">
            {form.id ? "Save changes" : "Create ad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function toLocal(iso: string) {
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

/* ---------------- SPONSORED MANAGER ---------------- */

const emptySponsored: Partial<SponsoredBusiness> = {
  name: "", category: "Restaurants", area: "Vidyagiri", tagline: "",
  image_url: "", redirect_url: "", rating: 4.7, reviews: 0, priority: 0, is_active: true,
};

function SponsoredManager() {
  const [items, setItems] = useState<SponsoredBusiness[]>([]);
  const [editing, setEditing] = useState<Partial<SponsoredBusiness> | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("sponsored_businesses").select("*").order("priority", { ascending: false });
    setItems((data ?? []) as SponsoredBusiness[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const onSave = async (form: Partial<SponsoredBusiness>) => {
    const payload: any = { ...form };
    delete payload.created_at; delete payload.updated_at;
    if (form.id) {
      const { error } = await supabase.from("sponsored_businesses").update(payload).eq("id", form.id);
      if (error) return toast.error(error.message);
      toast.success("Updated");
    } else {
      delete payload.id;
      const { error } = await supabase.from("sponsored_businesses").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Added");
    }
    setEditing(null); load();
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("sponsored_businesses").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
    setConfirmDel(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{items.length} sponsored business(es)</div>
        <Button onClick={() => setEditing({ ...emptySponsored })} className="bg-gradient-gold text-gold-foreground shadow-gold">
          <Plus className="h-4 w-4 mr-1" /> Add sponsored
        </Button>
      </div>

      {loading ? (
        <div className="text-muted-foreground text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <Card className="p-10 text-center text-muted-foreground">No sponsored businesses yet.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Card key={it.id} className="overflow-hidden">
              <div className="aspect-[4/3] bg-muted relative">
                {it.image_url && <img src={it.image_url} alt="" className="h-full w-full object-cover" />}
                <Badge className="absolute top-2 left-2 bg-gradient-gold text-gold-foreground">
                  <Crown className="h-3 w-3 mr-1" /> Sponsored
                </Badge>
                {!it.is_active && <Badge variant="secondary" className="absolute top-2 right-2">Inactive</Badge>}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="text-xs text-gold uppercase font-semibold tracking-wider">{it.category}</div>
                <div className="font-semibold">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.area} · ★ {it.rating} · {it.reviews} reviews</div>
                <div className="flex items-center gap-2 pt-2 border-t mt-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(it)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setConfirmDel(it.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SponsoredEditDialog item={editing} onClose={() => setEditing(null)} onSave={onSave} />
      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove sponsored business?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && onDelete(confirmDel)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function SponsoredEditDialog({ item, onClose, onSave }: { item: Partial<SponsoredBusiness> | null; onClose: () => void; onSave: (s: Partial<SponsoredBusiness>) => void }) {
  const [form, setForm] = useState<Partial<SponsoredBusiness>>({});
  const [uploading, setUploading] = useState(false);
  useEffect(() => { setForm(item ?? {}); }, [item]);
  const set = <K extends keyof SponsoredBusiness>(k: K, v: SponsoredBusiness[K]) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file: File) => {
    setUploading(true);
    const path = `sponsored/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("ad-images").upload(path, file, { upsert: true });
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("ad-images").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
  };

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{form.id ? "Edit business" : "Add sponsored business"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2"><Label>Business name</Label>
            <Input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2"><Label>Category</Label>
              <Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="Restaurants, Gym, Hospital…" /></div>
            <div className="grid gap-2"><Label>Area</Label>
              <Input value={form.area ?? ""} onChange={(e) => set("area", e.target.value)} /></div>
          </div>
          <div className="grid gap-2"><Label>Tagline</Label>
            <Textarea value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} rows={2} /></div>
          <div className="grid gap-2">
            <Label>Image</Label>
            <div className="flex items-center gap-3">
              <Input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} placeholder="https://…" />
              <Label className="inline-flex items-center gap-2 cursor-pointer rounded-md border bg-background px-3 py-2 text-sm hover:bg-secondary shrink-0">
                <Upload className="h-4 w-4" /> {uploading ? "…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
              </Label>
            </div>
            {form.image_url && <img src={form.image_url} alt="" className="rounded-md aspect-[4/3] object-cover w-full" />}
          </div>
          <div className="grid gap-2"><Label>Redirect URL</Label>
            <Input value={form.redirect_url ?? ""} onChange={(e) => set("redirect_url", e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2"><Label>Rating</Label>
              <Input type="number" step="0.1" min={0} max={5} value={form.rating ?? 4.7} onChange={(e) => set("rating", Number(e.target.value))} /></div>
            <div className="grid gap-2"><Label>Reviews</Label>
              <Input type="number" value={form.reviews ?? 0} onChange={(e) => set("reviews", Number(e.target.value))} /></div>
            <div className="grid gap-2"><Label>Priority</Label>
              <Input type="number" value={form.priority ?? 0} onChange={(e) => set("priority", Number(e.target.value))} /></div>
          </div>
          <div className="flex items-center justify-between rounded-md border p-3">
            <div className="font-medium text-sm">Active</div>
            <Switch checked={!!form.is_active} onCheckedChange={(v) => set("is_active", v)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.name || !form.image_url} className="bg-gradient-gold text-gold-foreground">
            {form.id ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- ANALYTICS ---------------- */

function AdAnalytics() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("ads").select("*");
      setAds((data ?? []) as Ad[]);
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const totalImp = ads.reduce((s, a) => s + a.impressions, 0);
    const totalClicks = ads.reduce((s, a) => s + a.clicks, 0);
    const active = ads.filter((a) => a.is_active && (!a.end_date || new Date(a.end_date).getTime() > now)).length;
    const expired = ads.filter((a) => a.end_date && new Date(a.end_date).getTime() < now).length;
    const ctr = totalImp ? (totalClicks / totalImp) * 100 : 0;
    return { totalImp, totalClicks, active, expired, ctr };
  }, [ads]);

  const top = useMemo(() => {
    return [...ads].sort((a, b) => {
      const ca = a.impressions ? a.clicks / a.impressions : 0;
      const cb = b.impressions ? b.clicks / b.impressions : 0;
      return cb - ca;
    }).slice(0, 5);
  }, [ads]);

  if (loading) return <div className="text-muted-foreground text-sm">Loading…</div>;

  const cards = [
    { label: "Total impressions", value: stats.totalImp.toLocaleString(), icon: Eye },
    { label: "Total clicks", value: stats.totalClicks.toLocaleString(), icon: MousePointerClick },
    { label: "Average CTR", value: `${stats.ctr.toFixed(2)}%`, icon: BarChart3 },
    { label: "Active ads", value: stats.active, icon: Power },
    { label: "Expired ads", value: stats.expired, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <c.icon className="h-4 w-4 text-gold" />
            </div>
            <div className="font-display text-3xl mt-2">{c.value}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-display text-xl mb-4">Top performing ads (by CTR)</h3>
        {top.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b">
                <tr>
                  <th className="py-2 pr-4">Ad</th>
                  <th className="py-2 pr-4">Placement</th>
                  <th className="py-2 pr-4 text-right">Impr.</th>
                  <th className="py-2 pr-4 text-right">Clicks</th>
                  <th className="py-2 text-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {top.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{a.title}</td>
                    <td className="py-3 pr-4 text-muted-foreground">{PLACEMENT_LABELS[a.placement]}</td>
                    <td className="py-3 pr-4 text-right">{a.impressions}</td>
                    <td className="py-3 pr-4 text-right">{a.clicks}</td>
                    <td className="py-3 text-right text-gold font-semibold">
                      {a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

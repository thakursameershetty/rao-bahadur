"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function AdminUpdateCountPage() {
  const [count, setCount] = useState<number | "">("");
  const [sales, setSales] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/counter')
      .then(res => res.json())
      .then(data => {
        if (data.count) setCount(data.count);
        if (data.sales) setSales(data.sales);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    
    try {
      const res = await fetch('/api/admin/counter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: typeof count === 'number' ? count : parseInt(count as string, 10),
          sales: typeof sales === 'number' ? sales : parseInt(sales as string, 10),
        })
      });

      if (res.ok) {
        setMessage("Successfully updated counters.");
      } else {
        setMessage("Failed to update counters.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen p-8 max-w-xl mx-auto flex flex-col items-center justify-center">Loading current values...</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full bg-card/20 backdrop-blur-md border border-primary/20 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center text-gradient-gold">Update Counters</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground/80">People Entered (Count)</label>
            <input 
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 0)}
              className="w-full p-3 bg-background/50 border border-border/50 focus:border-primary/50 outline-none rounded-xl text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground/80">Tickets Sold (Sales)</label>
            <input 
              type="number"
              value={sales}
              onChange={(e) => setSales(parseInt(e.target.value) || 0)}
              className="w-full p-3 bg-background/50 border border-border/50 focus:border-primary/50 outline-none rounded-xl text-foreground"
              required
            />
          </div>
          <Button variant="regal" type="submit" disabled={saving} className="w-full py-6 rounded-xl mt-4">
            {saving ? "Saving..." : "Update Values"}
          </Button>
          {message && <p className="text-center mt-4 text-sm text-primary">{message}</p>}
        </form>
      </div>
    </div>
  );
}

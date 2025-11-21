"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";

export interface Plan {
  id: number;
  asset: string;
  entry: number;
  exit: number;
  notes?: string;
}

export default function EntryExitPlanner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState<Partial<Plan>>({});
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "entry" || name === "exit" ? Number(value) : value }));
  };

  const addOrUpdate = () => {
    if (!form.asset || form.entry === undefined || form.exit === undefined) return;
    if (editingId !== null) {
      setPlans((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } as Plan : p)));
      setEditingId(null);
    } else {
      const newPlan: Plan = {
        id: Date.now(),
        asset: form.asset as string,
        entry: form.entry as number,
        exit: form.exit as number,
        notes: form.notes as string,
      };
      setPlans((prev) => [...prev, newPlan]);
    }
    setForm({});
  };

  const editPlan = (plan: Plan) => {
    setForm(plan);
    setEditingId(plan.id);
  };

  const deletePlan = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="w-full max-w-2xl">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Add / Edit Plan</h2>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Input id="asset" name="asset" value={form.asset ?? ""} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="entry">Entry Price</Label>
              <Input id="entry" name="entry" type="number" value={form.entry ?? ""} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="exit">Exit Price</Label>
              <Input id="exit" name="exit" type="number" value={form.exit ?? ""} onChange={handleChange} />
            </div>
            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" name="notes" value={form.notes ?? ""} onChange={handleChange} />
            </div>
          </div>
          <Button onClick={addOrUpdate} className="w-full">
            {editingId !== null ? "Update Plan" : "Add Plan"}
          </Button>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <h3 className="text-lg font-medium">{plan.asset}</h3>
            </CardHeader>
            <CardContent>
              <p>Entry: {plan.entry}</p>
              <p>Exit: {plan.exit}</p>
              {plan.notes && <p>Notes: {plan.notes}</p>}
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => editPlan(plan)}>
                <Pencil className="size-4 mr-1" /> Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => deletePlan(plan.id)}>
                <Trash2 className="size-4 mr-1" /> Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

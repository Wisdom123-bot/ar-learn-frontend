"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";

interface ClassMean {
  class_name: string;
  mean_score: number;
}

export default function PremiumCharts({ schoolId, term }: { schoolId: string; term: string }) {
  const [data, setData] = useState<ClassMean[]>([]);

  useEffect(() => {
    if (!schoolId) return;
    api.get(`/analytics/class-ranking`, { params: { school_id: schoolId, term } })
      .then((res) => setData(res.data || []))
      .catch(console.error);
  }, [schoolId, term]);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-semibold text-gray-800 mb-4">📊 Class Performance (Premium)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="class_name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="mean_score" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { useMemo } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const AXIS = "#64748b";
const GRID = "rgba(255,255,255,0.06)";

type Props = {
  enquiries: number;
  students: number;
  onboardingPending: number;
  receiptsTotalInr: number;
  expensesTotalInr: number;
  outstandingToCollectInr: number;
};

export default function HqDashboardCharts({
  enquiries,
  students,
  onboardingPending,
  receiptsTotalInr,
  expensesTotalInr,
  outstandingToCollectInr,
}: Props) {
  const baseChart = useMemo(
    (): Partial<ApexOptions> => ({
      chart: {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        foreColor: AXIS,
        background: "transparent",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      theme: { mode: "dark" as const },
      grid: { borderColor: GRID, strokeDashArray: 4 },
      dataLabels: { enabled: false },
      legend: { labels: { colors: AXIS } },
    }),
    []
  );

  const countOptions: ApexOptions = useMemo(
    () => ({
      ...baseChart,
      chart: { ...baseChart.chart, type: "bar", id: "hq-counts" },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "55%",
          dataLabels: { position: "top" },
        },
      },
      colors: ["#00d4ff"],
      xaxis: {
        categories: ["Enquiries", "Students", "Onboarding pending"],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (v: number) => (Number.isInteger(v) ? String(v) : ""),
        },
      },
      title: {
        text: "Pipeline & roster (counts)",
        align: "left",
        style: { color: "#94a3b8", fontSize: "11px", fontWeight: 600 },
      },
    }),
    [baseChart]
  );

  const countSeries = useMemo(
    () => [{ name: "Count", data: [enquiries, students, onboardingPending] }],
    [enquiries, students, onboardingPending]
  );

  const inrOptions: ApexOptions = useMemo(
    () => ({
      ...baseChart,
      chart: { ...baseChart.chart, type: "bar", id: "hq-inr" },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "55%",
        },
      },
      colors: ["#34d399"],
      xaxis: {
        categories: ["Receipts (lifetime)", "Expenses (lifetime)", "Balance to collect"],
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (v: number) =>
            `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
        },
      },
      title: {
        text: "Finances (INR)",
        align: "left",
        style: { color: "#94a3b8", fontSize: "11px", fontWeight: 600 },
      },
    }),
    [baseChart]
  );

  const inrSeries = useMemo(
    () => [
      {
        name: "INR",
        data: [receiptsTotalInr, expensesTotalInr, outstandingToCollectInr],
      },
    ],
    [receiptsTotalInr, expensesTotalInr, outstandingToCollectInr]
  );

  const pieTotal = receiptsTotalInr + expensesTotalInr + outstandingToCollectInr;
  const pieOptions: ApexOptions = useMemo(
    () => ({
      ...baseChart,
      chart: { ...baseChart.chart, type: "donut", id: "hq-mix" },
      labels: ["Receipts", "Expenses", "Outstanding"],
      colors: ["#34d399", "#f87171", "#fbbf24"],
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              name: { color: "#94a3b8" },
              value: {
                color: "#e8eef5",
                formatter: (val: string) =>
                  `₹${Number(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`,
              },
              total: {
                show: true,
                label: "Total (INR)",
                color: "#64748b",
                formatter: () =>
                  pieTotal > 0
                    ? `₹${pieTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                    : "—",
              },
            },
          },
        },
      },
      title: {
        text: "Lifetime mix — receipts vs expenses vs outstanding",
        align: "left",
        style: { color: "#94a3b8", fontSize: "11px", fontWeight: 600 },
      },
      stroke: { width: 0 },
      dataLabels: {
        enabled: true,
        formatter: (val: string | number | number[], opts?: { seriesIndex?: number }) => {
          const idx = opts?.seriesIndex ?? 0;
          const v = [receiptsTotalInr, expensesTotalInr, outstandingToCollectInr][idx] ?? 0;
          if (!pieTotal || pieTotal <= 0) return "";
          return `${((Number(v) / pieTotal) * 100).toFixed(0)}%`;
        },
        style: { fontSize: "10px", colors: ["#0a0a10"] },
      },
    }),
    [baseChart, pieTotal, receiptsTotalInr, expensesTotalInr, outstandingToCollectInr]
  );

  const pieSeries = useMemo(
    () => [receiptsTotalInr, expensesTotalInr, outstandingToCollectInr],
    [receiptsTotalInr, expensesTotalInr, outstandingToCollectInr]
  );

  const showPie = pieTotal > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Charts</h2>
        <p className="mt-1 text-xs text-[#64748b] max-w-2xl">
          Counts for intake and roster; INR bars and donut compare lifetime receipts, lifetime expenses, and current
          balance still to collect.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-4 min-h-[320px]">
          <Chart options={countOptions} series={countSeries} type="bar" height={280} />
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-4 min-h-[320px]">
          <Chart options={inrOptions} series={inrSeries} type="bar" height={280} />
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-[#07070c]/80 p-4 min-h-[360px] max-w-xl">
        {showPie ? (
          <Chart options={pieOptions} series={pieSeries} type="donut" height={320} />
        ) : (
          <div className="flex items-center justify-center h-[280px] text-sm text-[#64748b] font-mono">
            Add receipts, expenses, or open balances to see the mix chart.
          </div>
        )}
      </div>
    </div>
  );
}

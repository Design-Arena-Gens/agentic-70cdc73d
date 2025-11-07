"use client";
import { useMemo, useState } from "react";
import { FIRMS, FirmModel, PhaseFilter, SortKey, computeMetrics } from "@/data/propfirms";

export default function Page() {
  const [phase, setPhase] = useState<PhaseFilter>("any");
  const [sortKey, setSortKey] = useState<SortKey>("normalizedCost");
  const [minAccount, setMinAccount] = useState<number>(10000);

  const rows = useMemo(() => {
    const items = [] as Array<{ firm: string; url: string; model: FirmModel; metrics: ReturnType<typeof computeMetrics> }>;
    for (const firm of FIRMS) {
      for (const model of firm.models) {
        if (phase !== "any" && model.phases !== phase) continue;
        if (model.accountSizeUSD < minAccount) continue;
        const metrics = computeMetrics(model);
        items.push({ firm: firm.name, url: firm.url, model, metrics });
      }
    }
    const sorted = items.sort((a, b) => {
      switch (sortKey) {
        case "fee":
          return a.model.feeUSD - b.model.feeUSD;
        case "feePer1k":
          return a.metrics.feePer1k - b.metrics.feePer1k;
        case "normalizedCost":
          return a.metrics.feePerAllowedLoss - b.metrics.feePerAllowedLoss;
        case "firstPayoutDays":
          return (a.model.firstPayoutDays ?? 9999) - (b.model.firstPayoutDays ?? 9999);
        case "profitSplit":
          return (b.model.profitSplitPct ?? 0) - (a.model.profitSplitPct ?? 0);
        default:
          return 0;
      }
    });
    return sorted;
  }, [phase, sortKey, minAccount]);

  const top = rows[0];

  return (
    <div>
      <section className="controls">
        <select className="select" value={phase} onChange={(e) => setPhase(e.target.value as PhaseFilter)}>
          <option value="any">Any evaluation type</option>
          <option value="one-phase">One phase</option>
          <option value="two-phase">Two phase</option>
          <option value="instant">Instant funding</option>
        </select>
        <select className="select" value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
          <option value="normalizedCost">Cheapest per $ of allowed loss</option>
          <option value="fee">Lowest entry fee</option>
          <option value="feePer1k">Lowest fee per $1k account</option>
          <option value="firstPayoutDays">Earliest first payout</option>
          <option value="profitSplit">Highest profit split</option>
        </select>
        <input className="input" type="number" min={0} step={1000} value={minAccount} onChange={(e) => setMinAccount(parseInt(e.target.value || "0", 10))} placeholder="Min account size (USD)" />
      </section>

      {top && (
        <section className="section">
          <span className="badge">Cheapest match</span>
          <div className="card" style={{ marginTop: 8 }}>
            <h3>
              {top.firm} ? {top.model.title} ? ${top.model.accountSizeUSD.toLocaleString()}
            </h3>
            <p>
              <a className="link" href={top.url} target="_blank" rel="noreferrer">Visit website</a>
            </p>
            <div className="kv">
              <div><b>Entry fee</b></div><div>${top.model.feeUSD.toLocaleString()}</div>
              <div><b>Allowed loss</b></div><div>${top.metrics.allowedLossUSD.toLocaleString()} ({top.model.maxTotalDrawdownPct}% max loss)</div>
              <div><b>Fee per $ of allowed loss</b></div><div>${top.metrics.feePerAllowedLoss.toFixed(4)}</div>
              <div><b>Fee per $1k account</b></div><div>${top.metrics.feePer1k.toFixed(2)}</div>
              {top.model.firstPayoutDays !== undefined && (<>
                <div><b>First payout</b></div><div>{top.model.firstPayoutDays} days</div>
              </>)}
              {top.model.profitSplitPct !== undefined && (<>
                <div><b>Profit split</b></div><div>{top.model.profitSplitPct}%</div>
              </>)}
              <div><b>Phases</b></div><div>{top.model.phases.replace("-", " ")}</div>
              <div><b>Refund on payout</b></div><div>{top.model.refundOnFirstPayout ? "Yes" : "No"}</div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="grid">
          {rows.map((row, idx) => (
            <div className="card" key={`${row.firm}-${row.model.title}-${idx}`}>
              <h3>
                {row.firm} ? {row.model.title} ? ${row.model.accountSizeUSD.toLocaleString()}
              </h3>
              <p>
                <a className="link" href={row.url} target="_blank" rel="noreferrer">Visit website</a>
              </p>
              <div className="kv">
                <div><b>Entry fee</b></div><div>${row.model.feeUSD.toLocaleString()}</div>
                <div><b>Allowed loss</b></div><div>${row.metrics.allowedLossUSD.toLocaleString()} ({row.model.maxTotalDrawdownPct}% max loss)</div>
                <div><b>Fee / $ allowed loss</b></div><div>${row.metrics.feePerAllowedLoss.toFixed(4)}</div>
                <div><b>Fee / $1k account</b></div><div>${row.metrics.feePer1k.toFixed(2)}</div>
                {row.model.firstPayoutDays !== undefined && (<>
                  <div><b>First payout</b></div><div>{row.model.firstPayoutDays} days</div>
                </>)}
                {row.model.profitSplitPct !== undefined && (<>
                  <div><b>Profit split</b></div><div>{row.model.profitSplitPct}%</div>
                </>)}
                <div><b>Phases</b></div><div>{row.model.phases.replace("-", " ")}</div>
                <div><b>Refund on payout</b></div><div>{row.model.refundOnFirstPayout ? "Yes" : "No"}</div>
                {row.model.notes && (<>
                  <div><b>Notes</b></div><div>{row.model.notes}</div>
                </>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

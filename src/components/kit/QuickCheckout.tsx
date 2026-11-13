"use client";

import { useState } from "react";
import { baht, fmtCard, fmtExpiry, isEmail, isPhone, isPostcode, luhn, makeRef, validExpiry } from "./persist";
import { btn } from "./panels";
import { Choice, Field, Icon, Sheet } from "./ui";

export type QLine = { name: string; detail?: string; qty: number; price: number };
type Ship = { id: string; label: string; detail: string; price: number; address: boolean };

/**
 * Checkout in a drawer for the smaller sites: contact, delivery, payment and
 * a confirmation with a reference. `request` mode skips payment for things
 * that are confirmed by the shop first, such as a room hold or a made to order piece.
 */
export function QuickCheckout({
  open,
  onClose,
  lines,
  prefix,
  ship = [],
  payments = ["card", "promptpay"],
  request,
  done: doneText,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  lines: QLine[];
  prefix: string;
  ship?: Ship[];
  payments?: ("card" | "promptpay" | "cod")[];
  /** confirmation by the shop instead of payment now */
  request?: string;
  done?: (ref: string, email: string) => string;
  onDone?: () => void;
}) {
  const [step, setStep] = useState<"details" | "pay" | "done">("details");
  const [f, setF] = useState({ name: "", email: "", phone: "", line1: "", postcode: "", note: "", card: "", exp: "", cvc: "" });
  const [via, setVia] = useState(0);
  const [pay, setPay] = useState(payments[0]);
  const [tried, setTried] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ref, setRef] = useState("");
  const [paid, setPaid] = useState<{ lines: QLine[]; total: number }>({ lines: [], total: 0 });
  const s = ship[via];
  const sub = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const total = sub + (s?.price ?? 0);
  const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

  const e1 = {
    name: f.name.trim().length < 2 && "Enter your name",
    email: !isEmail(f.email) && "Enter a valid email",
    phone: !isPhone(f.phone) && "Enter a Thai mobile number, for example 081 234 5678",
    line1: s?.address && f.line1.trim().length < 5 && "Enter house number, street and district",
    postcode: s?.address && !isPostcode(f.postcode) && "Postcodes have five digits",
  };
  const e2 = {
    card: pay === "card" && !luhn(f.card) && "Check the card number",
    exp: pay === "card" && !validExpiry(f.exp) && "MM/YY, not in the past",
    cvc: pay === "card" && !/^\d{3,4}$/.test(f.cvc) && "Three or four digits",
  };
  const bad = (e: object) => Object.values(e).some(Boolean);

  const finish = () => {
    setBusy(true);
    setTimeout(() => {
      setRef(makeRef(prefix));
      setPaid({ lines, total });
      setStep("done");
      setBusy(false);
      onDone?.();
    }, 800);
  };
  const close = () => {
    onClose();
    if (step === "done")
      setTimeout(() => {
        setStep("details");
        setTried(false);
      }, 400);
  };

  return (
    <Sheet open={open} onClose={close} title={step === "done" ? (request ? "Request sent" : "Order confirmed") : request ? "Your details" : step === "pay" ? "Payment" : "Checkout"}>
      {step === "done" ? (
        <div className="grid gap-5">
          <span className="grid size-11 place-items-center rounded-full bg-ink text-bg">{Icon.check}</span>
          <p className="text-[17px] leading-relaxed">{doneText ? doneText(ref, f.email) : `Thank you, ${f.name.split(" ")[0]}. Reference ${ref}. A receipt is on its way to ${f.email}.`}</p>
          <ul className="grid gap-2 rounded-[12px] bg-soft p-4 text-[14px]">
            {paid.lines.map((l) => (
              <li key={l.name + l.detail} className="flex justify-between gap-4">
                <span>
                  {l.qty} x {l.name}
                  {l.detail && <span className="block text-muted">{l.detail}</span>}
                </span>
                <span className="tabular-nums">{baht(l.qty * l.price)}</span>
              </li>
            ))}
            <li className="flex justify-between border-t border-line pt-2">
              <span>{request ? "Estimated total" : "Paid"}</span>
              <span className="tabular-nums">{baht(paid.total)}</span>
            </li>
          </ul>
          <button className={btn.ghost} onClick={close}>
            Close
          </button>
        </div>
      ) : step === "details" ? (
        <div className="grid gap-5">
          <Summary lines={lines} ship={s} total={total} />
          <Field label="Full name" autoComplete="name" value={f.name} onValue={set("name")} error={tried && e1.name} />
          <Field label="Email" type="email" autoComplete="email" value={f.email} onValue={set("email")} error={tried && e1.email} />
          <Field label="Mobile number" type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onValue={set("phone")} error={tried && e1.phone} />
          {ship.length > 0 && (
            <div className="grid gap-2" role="radiogroup" aria-label="Delivery">
              {ship.map((x, k) => (
                <Choice key={x.id} checked={via === k} onSelect={() => setVia(k)} title={x.label} detail={x.detail} aside={x.price ? baht(x.price) : "Free"} />
              ))}
            </div>
          )}
          {s?.address && (
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <Field label="Address" autoComplete="street-address" value={f.line1} onValue={set("line1")} error={tried && e1.line1} />
              <Field label="Postcode" inputMode="numeric" value={f.postcode} onValue={(v) => set("postcode")(v.replace(/\D/g, "").slice(0, 5))} error={tried && e1.postcode} />
            </div>
          )}
          {request && <Field label="Anything we should know (optional)" as="textarea" value={f.note} onValue={set("note")} />}
          <button
            className={btn.primary}
            disabled={busy}
            onClick={() => {
              setTried(true);
              if (bad(e1)) return;
              setTried(false);
              if (request) finish();
              else setStep("pay");
            }}
          >
            {request ? (busy ? "Sending" : request) : "Continue to payment"}
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          <Summary lines={lines} ship={s} total={total} />
          <div className="grid gap-2" role="radiogroup" aria-label="Payment">
            {payments.map((p) => (
              <Choice key={p} checked={pay === p} onSelect={() => setPay(p)} title={p === "card" ? "Card" : p === "promptpay" ? "PromptPay" : "Cash on delivery"} detail={p === "card" ? "Visa, Mastercard, JCB" : p === "promptpay" ? "QR code shown after you confirm" : "Pay the courier"} />
            ))}
          </div>
          {pay === "card" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Card number" inputMode="numeric" autoComplete="cc-number" value={f.card} onValue={(v) => set("card")(fmtCard(v))} error={tried && e2.card} className="sm:col-span-2" hint="Concept build: 4242 4242 4242 4242 works. Nothing is charged." />
              <Field label="Expiry" inputMode="numeric" autoComplete="cc-exp" value={f.exp} onValue={(v) => set("exp")(fmtExpiry(v))} error={tried && e2.exp} />
              <Field label="Security code" inputMode="numeric" value={f.cvc} onValue={(v) => set("cvc")(v.replace(/\D/g, "").slice(0, 4))} error={tried && e2.cvc} />
            </div>
          )}
          <div className="flex gap-3">
            <button className={`${btn.ghost} w-auto`} onClick={() => setStep("details")}>
              Back
            </button>
            <button
              className={btn.primary}
              disabled={busy}
              onClick={() => {
                setTried(true);
                if (bad(e2)) return;
                finish();
              }}
            >
              {busy ? "Placing order" : `Pay ${baht(total)}`}
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Summary({ lines, ship, total }: { lines: QLine[]; ship?: Ship; total: number }) {
  return (
    <div className="grid gap-1.5 rounded-[12px] bg-soft p-4 text-[14px]">
      {lines.map((l) => (
        <div key={l.name + l.detail} className="flex justify-between gap-4">
          <span className="min-w-0">
            {l.qty} x {l.name}
            {l.detail && <span className="block truncate text-[12.5px] text-muted">{l.detail}</span>}
          </span>
          <span className="tabular-nums">{baht(l.qty * l.price)}</span>
        </div>
      ))}
      {ship && (
        <div className="flex justify-between text-muted">
          <span>{ship.label}</span>
          <span>{ship.price ? baht(ship.price) : "Free"}</span>
        </div>
      )}
      <div className="flex justify-between border-t border-line pt-2 text-[15px]">
        <span>Total</span>
        <span className="tabular-nums">{baht(total)}</span>
      </div>
    </div>
  );
}

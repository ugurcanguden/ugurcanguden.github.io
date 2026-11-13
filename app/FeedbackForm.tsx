"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitFeedback, type FeedbackState } from "./actions";
import { APPS, FEEDBACK_TYPES, PLATFORMS } from "@/lib/apps";

const initialState: FeedbackState = { status: "idle", message: "" };

export interface FeedbackDefaults {
  category: string;
  type: string;
  platform: string;
  app_version: string;
  /** true ise uygulama/platform query'den geldi, salt-okunur gösterilir */
  locked: boolean;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="submit" disabled={pending}>
      {pending ? "Gönderiliyor…" : "Geri Bildirimi Gönder"}
    </button>
  );
}

export default function FeedbackForm({
  defaults,
}: {
  defaults: FeedbackDefaults;
}) {
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="form">
      <div className="grid">
        <label className="field">
          <span>Uygulama</span>
          <select name="category" defaultValue={defaults.category} required>
            {APPS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Geri bildirim türü</span>
          <select name="type" defaultValue={defaults.type}>
            {FEEDBACK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Platform</span>
          <select name="platform" defaultValue={defaults.platform}>
            {PLATFORMS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Uygulama sürümü (opsiyonel)</span>
          <input
            name="app_version"
            defaultValue={defaults.app_version}
            placeholder="örn. 1.4.2"
          />
        </label>
      </div>

      {defaults.locked && (
        <p className="hint">
          Uygulama ve cihaz bilgileri otomatik dolduruldu. İsterseniz
          değiştirebilirsiniz.
        </p>
      )}

      <label className="field">
        <span>Mesajınız</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={5}
          maxLength={4000}
          placeholder="Yaşadığınız sorunu veya önerinizi olabildiğince detaylı anlatın…"
        />
      </label>

      <label className="field">
        <span>E-posta (opsiyonel — size dönüş yapabilmemiz için)</span>
        <input type="email" name="email" placeholder="siz@ornek.com" />
      </label>

      {state.status !== "idle" && (
        <div
          className={`alert ${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}

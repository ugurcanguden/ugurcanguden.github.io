"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitFeedback, type FeedbackState } from "./actions";
import { APPS, FEEDBACK_TYPES, PLATFORMS, appLabel } from "@/lib/apps";
import type { Dictionary, Locale } from "@/lib/i18n";

const initialState: FeedbackState = { status: "idle", message: "" };

export interface FeedbackDefaults {
  category: string;
  type: string;
  platform: string;
  app_version: string;
  /** true ise uygulama/platform query'den geldi, kullanıcı yine değiştirebilir */
  locked: boolean;
}

function SubmitButton({ dict }: { dict: Dictionary }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="send" disabled={pending}>
      {pending ? dict.feedback.submitting : dict.feedback.submit}
    </button>
  );
}

export default function FeedbackForm({
  defaults,
  locale,
  dict,
}: {
  defaults: FeedbackDefaults;
  locale: Locale;
  dict: Dictionary;
}) {
  const [state, formAction] = useActionState(submitFeedback, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const t = dict.feedback;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="form">
      <input type="hidden" name="lang" value={locale} />

      <div className="pair">
        <label className="field">
          <span className="label">{t.appField}</span>
          <select name="category" defaultValue={defaults.category} required>
            {APPS.map((app) => (
              <option key={app.value} value={app.value}>
                {appLabel(app, t.appGeneral)}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label">{t.typeField}</span>
          <select name="type" defaultValue={defaults.type}>
            {FEEDBACK_TYPES.map((kind) => (
              <option key={kind.value} value={kind.value}>
                {t.types[kind.value] ?? kind.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label">{t.platformField}</span>
          <select name="platform" defaultValue={defaults.platform}>
            {PLATFORMS.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {t.platforms[platform.value] ?? platform.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="label">
            {t.versionField} <span className="aside">{t.versionOptional}</span>
          </span>
          <input
            name="app_version"
            defaultValue={defaults.app_version}
            placeholder={t.versionPlaceholder}
            inputMode="decimal"
            autoComplete="off"
          />
        </label>
      </div>

      {defaults.locked && <p className="note">{t.prefilled}</p>}

      <label className="field">
        <span className="label">{t.messageField}</span>
        <textarea
          name="message"
          rows={6}
          required
          minLength={5}
          maxLength={4000}
          placeholder={t.messagePlaceholder}
        />
      </label>

      <label className="field">
        <span className="label">
          {t.emailField} <span className="aside">{t.emailHint}</span>
        </span>
        <input
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          inputMode="email"
          autoComplete="email"
        />
      </label>

      {state.status !== "idle" && (
        <p
          className={`result ${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </p>
      )}

      <SubmitButton dict={dict} />
    </form>
  );
}

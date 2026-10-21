import { useI18n } from "../i18n/WebI18nContext";
import { useRelativeTimeState } from "../hooks/useRelativeTimeState";

// A "5m ago" label that keeps counting. Formatting the label inline in render
// does not: the React Compiler caches it on the timestamp alone.
export function RelativeTime(props: { timestamp: string }) {
  const { t } = useI18n();
  const relative = useRelativeTimeState(props.timestamp);
  if (relative.status !== "relative") return null;
  if (relative.value === "just now") return t("time.relative.justNow");
  const elapsed = /^(\d+)([mhd])$/.exec(relative.value);
  if (relative.suffix === "ago" && elapsed) {
    const key =
      elapsed[2] === "m"
        ? "time.relative.minutesAgo"
        : elapsed[2] === "h"
          ? "time.relative.hoursAgo"
          : "time.relative.daysAgo";
    return t(key, { count: elapsed[1] ?? "" });
  }
  return relative.suffix ? `${relative.value} ${relative.suffix}` : relative.value;
}

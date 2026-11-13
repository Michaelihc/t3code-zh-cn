import type { ChangeRequestTerminology } from "@t3tools/client-runtime/source-control-clients";
import type { WebTranslate } from "~/i18n/WebI18nContext";

export function offHeadPullRequestCheckoutToast(
  terminology: ChangeRequestTerminology,
  t?: WebTranslate,
) {
  return {
    type: "warning",
    title:
      t?.("pullRequests.handoff.checkoutUnconfirmed") ??
      "Checked out, but not confirmed on the latest commit",
    description:
      t?.("pullRequests.handoff.checkoutUnconfirmedDescription") ??
      `This checkout could not be confirmed at the ${terminology.singular}'s latest commit, so its code may differ. Local commits or uncommitted work keep a checkout where it is.`,
  } as const;
}

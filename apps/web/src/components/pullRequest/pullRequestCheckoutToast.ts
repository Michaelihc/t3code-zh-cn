import type { WebTranslate } from "~/i18n/WebI18nContext";

export const OFF_HEAD_PULL_REQUEST_CHECKOUT_TOAST = {
  type: "warning",
  title: "Checked out, but not confirmed on the latest commit",
  description:
    "This checkout could not be confirmed at the pull request's latest commit, so its code may differ. Local commits or uncommitted work keep a checkout where it is.",
} as const;

export function localizedOffHeadPullRequestCheckoutToast(t: WebTranslate) {
  return {
    ...OFF_HEAD_PULL_REQUEST_CHECKOUT_TOAST,
    title: t("pullRequests.handoff.checkoutUnconfirmed"),
    description: t("pullRequests.handoff.checkoutUnconfirmedDescription"),
  };
}

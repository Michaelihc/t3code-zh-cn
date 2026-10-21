import { act, fakeTimers, render } from "../../test/render";
import { describe, expect, it, vi } from "vite-plus/test";
import {
  AuthProvidersManageScope,
  type AuthEnvironmentScope,
  type EnvironmentId,
  ProviderDriverKind,
  ProviderInstanceId,
  type ServerProvider,
} from "@t3tools/contracts";
import { AsyncResult } from "effect/reactivity";

import type {
  LocalEnvironmentUpdateGroup,
  ProviderUpdateCandidate,
} from "./ProviderUpdateLaunchNotification.logic";

const testState = vi.hoisted(() => ({
  groups: [] as LocalEnvironmentUpdateGroup[],
  locale: "en" as "en" | "zh-CN",
  permittedEnvironmentIds: new Set<EnvironmentId>(),
  updateProvider: vi.fn(),
}));

vi.mock("~/state/server", () => ({
  serverEnvironment: { updateProvider: Symbol("updateProvider") },
}));

vi.mock("~/state/session", () => ({
  readEnvironmentScope: (environmentId: EnvironmentId, scope: AuthEnvironmentScope) =>
    scope === AuthProvidersManageScope && testState.permittedEnvironmentIds.has(environmentId),
  useEnvironmentScope: (environmentId: EnvironmentId | null, scope: AuthEnvironmentScope) =>
    environmentId !== null &&
    scope === AuthProvidersManageScope &&
    testState.permittedEnvironmentIds.has(environmentId),
}));

vi.mock("~/state/use-atom-command", () => ({
  useAtomCommand: () => testState.updateProvider,
}));

vi.mock("~/i18n/WebI18nContext", () => ({
  useI18n: () => ({
    locale: testState.locale,
    t: (key: string) => {
      const translations = {
        en: {
          "providerUpdate.action.retry": "Retry",
          "providerUpdate.action.update": "Update",
        },
        "zh-CN": {
          "providerUpdate.action.retry": "重试",
          "providerUpdate.action.update": "更新",
        },
      } as const;
      return translations[testState.locale][key as keyof (typeof translations)["en"]];
    },
  }),
}));

vi.mock("./ProviderUpdateLaunchNotification.environments", () => ({
  useLocalEnvironmentUpdateGroups: () => ({
    groups: testState.groups,
    isAnySettling: false,
  }),
}));

import { ProviderUpdateEnvironmentRows } from "./ProviderUpdateEnvironmentRows";

const environmentId = "env-wsl" as EnvironmentId;
const pendingExpiryMs = 6 * 60_000;

function provider(updateStatus?: "succeeded"): ServerProvider {
  const result: ServerProvider = {
    instanceId: ProviderInstanceId.make("codex-wsl"),
    driver: ProviderDriverKind.make("codex"),
    enabled: true,
    installed: true,
    version: updateStatus ? "1.1.0" : "1.0.0",
    status: "ready",
    auth: { status: "authenticated" },
    checkedAt: "2026-06-26T12:00:00.000Z",
    models: [],
    slashCommands: [],
    skills: [],
    versionAdvisory: {
      status: updateStatus ? "current" : "behind_latest",
      currentVersion: updateStatus ? "1.1.0" : "1.0.0",
      latestVersion: "1.1.0",
      updateCommand: "npm install -g @openai/codex@latest",
      canUpdate: true,
      checkedAt: "2026-06-26T12:00:00.000Z",
      message: updateStatus ? "Up to date." : "Update available.",
    },
  };

  return updateStatus
    ? {
        ...result,
        updateState: {
          status: updateStatus,
          startedAt: "2026-06-26T12:00:00.000Z",
          finishedAt: "2026-06-26T12:00:01.000Z",
          message: "Provider updated.",
          output: null,
        },
      }
    : result;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => {
    resolve = complete;
  });
  return { promise, resolve };
}

describe("ProviderUpdateEnvironmentRows", () => {
  function setup() {
    testState.locale = "en";
    testState.permittedEnvironmentIds.clear();
    testState.permittedEnvironmentIds.add(environmentId);
    testState.updateProvider.mockReset();
    const candidate = provider() as ProviderUpdateCandidate;
    testState.groups = [
      {
        environmentId,
        label: "WSL",
        isPrimary: false,
        isSettling: false,
        candidates: [candidate],
        providers: [candidate],
      },
    ];
  }

  it("provides localized update action labels", async () => {
    setup();
    await using screen = await render(<ProviderUpdateEnvironmentRows />);
    await expect.element(screen.getByRole("button", { name: "Update" })).toBeVisible();
    testState.locale = "zh-CN";
    await screen.rerender(<ProviderUpdateEnvironmentRows />);
    await expect.element(screen.getByRole("button", { name: "更新" })).toBeVisible();
  });

  it("keeps a successor pending when an expired request resolves late, then shows its success", async () => {
    setup();
    const firstRequest =
      deferred<ReturnType<typeof AsyncResult.success<{ providers: ServerProvider[] }>>>();
    const successorRequest =
      deferred<ReturnType<typeof AsyncResult.success<{ providers: ServerProvider[] }>>>();
    testState.updateProvider
      .mockReturnValueOnce(firstRequest.promise)
      .mockReturnValueOnce(successorRequest.promise);
    await using screen = await render(<ProviderUpdateEnvironmentRows />);
    using _timers = fakeTimers();
    await act(() =>
      (screen.getByRole("button", { name: "Update" }).element() as HTMLButtonElement).click(),
    );
    expect(screen.container.textContent).toContain("Updating…");
    await act(() => vi.advanceTimersByTimeAsync(pendingExpiryMs));
    expect(screen.container.textContent).toContain("Update timed out");
    await act(() =>
      (screen.getByRole("button", { name: "Retry" }).element() as HTMLButtonElement).click(),
    );
    expect(testState.updateProvider).toHaveBeenCalledTimes(2);
    expect(screen.container.textContent).toContain("Updating…");
    await act(() =>
      firstRequest.resolve(AsyncResult.success({ providers: [provider("succeeded")] })),
    );
    expect(screen.container.textContent).toContain("Updating…");
    await act(() =>
      successorRequest.resolve(AsyncResult.success({ providers: [provider("succeeded")] })),
    );
    expect(screen.container.textContent).toContain("Updated");
  });
});

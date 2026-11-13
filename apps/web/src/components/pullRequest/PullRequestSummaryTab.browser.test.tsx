import type { PullRequestComment } from "@t3tools/contracts";
import { WebI18nContext } from "~/i18n/WebI18nContext";
import { translateWebMessage } from "~/i18n/messages";

import { SourceControlProviderKind } from "@t3tools/contracts";
import { EnvironmentId, ProjectId, type PullRequestDetailView } from "@t3tools/contracts";
import { expect, it, vi } from "vite-plus/test";
import { userEvent } from "vite-plus/test/browser";

const state = vi.hoisted(() => ({ update: vi.fn(), canUpdate: true }));

vi.mock(import("~/state/use-atom-command"), async (original) => ({
  ...(await original()),
  useAtomCommand: (() => state.update) as never,
}));
vi.mock(import("~/state/session"), async (original) => ({
  ...(await original()),
  readEnvironmentScope: () => true,
  useEnvironmentScope: () => true,
}));
vi.mock(import("~/state/pullRequests"), async (original) => {
  const actual = await original();
  const { Atom } = await import("effect/reactivity");
  const allowed = Atom.make(true);
  const denied = Atom.make(false);
  return {
    ...actual,
    pullRequestEnvironment: {
      ...actual.pullRequestEnvironment,
      update: {
        ...actual.pullRequestEnvironment.update,
        permissionAtom: () => (state.canUpdate ? allowed : denied),
      },
    },
  };
});

function setup() {
  state.update.mockReset();
  state.update.mockResolvedValue({ _tag: "Success", value: undefined });
  state.canUpdate = true;
}

import { act, render as renderUi } from "../../../test/render";
import { PullRequestSummaryTab } from "./PullRequestSummaryTab";

const detail: PullRequestDetailView = {
  provider: SourceControlProviderKind.make("github"),
  projectId: ProjectId.make("project"),
  projectTitle: "Project",
  workspaceRoot: "/workspace",
  repository: "owner/repo",
  number: 1,
  title: "Test pull request",
  body: "Original description",
  url: "https://github.com/owner/repo/pull/1",
  author: { login: "author", name: null, avatarUrl: null },
  viewer: "author",
  state: "open",
  isDraft: false,
  mergeability: "mergeable",
  additions: 1,
  deletions: 0,
  changedFiles: 1,
  headBranch: "feature",
  baseBranch: "main",
  createdAt: "2026-09-01T00:00:00Z",
  updatedAt: "2026-09-01T00:00:00Z",
  mergedAt: null,
  closedAt: null,
  reviewers: [],
  labels: [],
  checks: [{ name: "Unit tests", status: "success", description: null, url: null }],
  comments: [],
  commentCount: 0,
  commentsTruncated: false,
  reviewThreads: [],
  commits: [],
  mergeCapabilities: { merge: false, squash: false, rebase: false },
  capabilities: {
    diff: true,
    comment: true,
    search: true,
    actions: [],
    mergeMethods: [],
    review: { inlineComment: false, reply: false, resolve: false, verdicts: [] },
    reviewers: { request: false, listCandidates: false },
    edit: { changeRequest: true, comment: true },
  },
  viewerPermissions: {
    actions: [],
    comment: true,
    resolve: false,
    verdicts: [],
    requestReviewers: false,
  },
};

// The comment filter persists to localStorage, so tests that touch it start and end empty.

const tab = (value = detail) => (
  <PullRequestSummaryTab
    scrollerRef={() => {}}
    environmentId={EnvironmentId.make("environment")}
    threadRef={null}
    reference={value}
    detail={value}
    activityPending={false}
    activityError={null}
    onRefresh={() => {}}
  />
);

async function render(value = detail) {
  const screen = await renderUi(tab(value));
  const { container } = screen;
  const heading = (title: string) => {
    const section = container.querySelector(`section[aria-label="${title}"]`);
    expect(section, `section ${title}`).not.toBeNull();
    return [...section!.querySelectorAll("button")].find(
      (button) => button.querySelector("span")?.textContent === title,
    )!;
  };
  return Object.assign(screen, {
    click: (title: string) => act(async () => heading(title).click()),
    expanded: (title: string) => heading(title).getAttribute("aria-expanded"),
    visibleText: () => container.innerText,
  });
}

it("keeps an unsaved description when collapsed and reopened, and after a failed save", async () => {
  setup();
  state.update.mockResolvedValue({ _tag: "Failure", cause: new Error("offline") });
  await using screen = await render();
  await act(async () =>
    screen.container.querySelector<HTMLButtonElement>('[aria-label="Edit description"]')!.click(),
  );
  const textarea = screen.container.querySelector("textarea")!;
  await userEvent.clear(textarea);
  await userEvent.type(textarea, "Unsaved description");
  await screen.click("Description");
  expect(screen.expanded("Description")).toBe("false");
  await screen.click("Description");
  expect(screen.container.querySelector("textarea")!.value).toBe("Unsaved description");

  await userEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(state.update).toHaveBeenCalledTimes(1);
  await expect.element(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  expect(screen.container.querySelector("textarea")!.value).toBe("Unsaved description");
});

it("ticks a description checkbox placed after an attachment and edits from the ticked body", async () => {
  setup();
  let finishSave = (_result: unknown) => {};
  state.update.mockReturnValueOnce(new Promise((resolve) => (finishSave = resolve)));
  const body = "Intro\n\nhttps://example.com/shot.png\n\n## Test plan\n- [ ] First\n- [ ] Second";
  const ticked = body.replace("- [ ] Second", "- [x] Second");
  await using screen = await render({ ...detail, body, observedAt: 1 });
  const boxes = () => screen.container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
  expect([...boxes()].map((box) => box.disabled)).toEqual([false, false]);

  await userEvent.click(boxes()[1]!);
  expect(state.update).toHaveBeenCalledWith({
    environmentId: "environment",
    input: expect.objectContaining({ number: 1, body: ticked }),
  });
  expect([...boxes()].map((box) => box.checked)).toEqual([false, true]);
  await act(async () => finishSave({ _tag: "Success", value: undefined }));

  // The host has not been read since the save, so the editor starts from the ticked body.
  await act(async () =>
    screen.container.querySelector<HTMLButtonElement>('[aria-label="Edit description"]')!.click(),
  );
  expect(screen.container.querySelector("textarea")!.value).toBe(ticked);
});

it("leaves description checkboxes read-only without the right to edit it", async () => {
  setup();
  const body = "- [ ] First";
  {
    await using screen = await render({ ...detail, body, viewer: "someone-else" });
    expect(
      screen.container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.disabled,
    ).toBe(true);
  }
  state.canUpdate = false;
  await using screen = await render({ ...detail, body });
  expect(screen.container.querySelector<HTMLInputElement>('input[type="checkbox"]')!.disabled).toBe(
    true,
  );
});

function chineseTab(value: PullRequestDetailView) {
  return (
    <WebI18nContext
      value={{
        locale: "zh-CN",
        appLocale: "zh-CN",
        setAppLocale: () => {},
        t: (key, values) => translateWebMessage("zh-CN", key, values),
      }}
    >
      {tab(value)}
    </WebI18nContext>
  );
}

it("filters bot comments using Chinese labels and hidden counts", async () => {
  using _storage = emptyLocalStorage();
  const value: PullRequestDetailView = {
    ...detail,
    commentCount: 1,
    comments: [
      {
        id: "bot-comment",
        kind: "issue-comment",
        author: { login: "review-app", name: null, avatarUrl: null, isBot: true },
        body: "Bot finding",
        createdAt: "2026-09-01T00:00:00Z",
        url: null,
        path: null,
        reviewState: null,
      },
    ],
  };
  await using screen = await renderUi(chineseTab(value));
  expect(screen.getByRole("button", { name: "筛选评论" }).element().textContent).toContain(
    "已隐藏 1 条",
  );
  expect(screen.container.innerText).not.toContain("Bot finding");
  expect(screen.container.innerText).toContain("唯一的评论已被筛选器隐藏。");
  await userEvent.click(screen.getByRole("button", { name: "筛选评论" }));
  await userEvent.click(filterItem("机器人评论"));
  expect(filterItem("机器人评论").getAttribute("aria-checked")).toBe("true");
  await userEvent.keyboard("{Escape}");
  expect(screen.container.innerText).toContain("Bot finding");
});

it("localizes partial reply counts and keeps the link to unloaded host replies", async () => {
  using _storage = emptyLocalStorage();
  const finding: PullRequestComment = {
    id: "finding",
    kind: "review-comment",
    author: detail.author,
    body: "Review finding",
    createdAt: "2026-09-01T00:00:00Z",
    url: `${detail.url}#comment-finding`,
    path: "src/index.ts",
    reviewState: null,
  };
  const value: PullRequestDetailView = {
    ...detail,
    comments: [finding],
    commentCount: 4,
    reviewThreads: [
      {
        id: "partial-thread",
        path: "src/index.ts",
        line: 1,
        side: "right",
        isResolved: false,
        isOutdated: false,
        comments: [finding],
        commentCount: 4,
        nextCommentsCursor: "next-page",
      },
    ],
  };
  await using screen = await renderUi(chineseTab(value));
  expect(screen.container.innerText).toContain("还有 3 条回复");
  expect(screen.getByRole("link", { name: "在托管平台查看" }).element().getAttribute("href")).toBe(
    finding.url,
  );
});

function emptyLocalStorage() {
  const snapshot = { ...localStorage };
  localStorage.clear();
  return {
    [Symbol.dispose]() {
      localStorage.clear();
      for (const [key, value] of Object.entries(snapshot)) localStorage.setItem(key, value);
    },
  };
}
function filterItem(label: string) {
  const item = [...document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')].find(
    (element) => element.textContent?.includes(label),
  );
  if (!item) throw new Error(`Missing filter: ${label}`);
  return item;
}

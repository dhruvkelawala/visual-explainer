# Teaching page

A teaching page builds a topic up from zero, block by block, for a reader with no background. The reader's own project is the running example. The shape comes from research-explainer.

## Feed it cited notes

Every claim on the page comes from the cited notes that `research` writes in the repo, usually `docs/research/<topic>.md`. Read them before you write. When no notes exist, run `research` first or ask the user. Do not teach from memory. A note cites each claim: a paper, an official doc, or a file path and line range.

## Order

| Part | What it holds |
|---|---|
| Hero | The one thesis the page builds toward, as a picture and one sentence. |
| The one idea | The frame that makes the rest obvious: a three-step strip that maps the blocks to their jobs, and the rule that governs them in one sentence. |
| Building blocks | 3 to 7 blocks. Each builds on the one before it and has no forward references, so a newcomer can read top to bottom. |
| Assembly | One figure that shows how the blocks fit together in the real system, with each node labelled by its block number. Then one sentence on why the parts compound. |
| Cheat sheet | A glossary of every term of art on the page, each with one plain sentence. |
| Sources | For each block, its primary sources (papers, docs, repos) and the repo paths of the notes. |
| Closing line | One mono footer line that says what the page is and what it feeds into. |

## Block anatomy

Each block, in this order:

1. **Head.** The section number, the label `Block N`, and an `h2` that states the block's takeaway in plain words ("Models repeat the answer training rewarded", not "Mode collapse").
2. **The question.** One short line with the question this block answers, asked from the reader's world ("We asked for creative output. Why did we get the same answer five times?").
3. **Explanation.** Two or three short paragraphs. Define each term in bold where it first appears. Say why the thing happens, not only that it happens.
4. **Figure.** One hand-drawn SVG in a `<figure>`. Its caption states the claim and adds to the prose.
5. **In our project.** A callout with the reader's real incidents, numbers, thresholds and file paths from the notes. With no project, use one worked example.
6. **Watch out**, only when needed. The limits: what the source does not claim, limits on calibration, failure modes, and what would test it.

Leave out "TL;DR", "key takeaway", "say it to a friend" and "repeat after me" boxes. The prose, the figures and the cheat sheet carry the takeaways.

## In the Field Guide look

| Part | Component |
|---|---|
| The one idea | The hero's Field note holds the rule. The three-step strip is a small plate: numbered stage boxes on the spine. |
| Block head | A section opener: the giant number, the label `Block N · <concept>`, and the `h2`. |
| The question | The `.lede` under the `h2`. Serif italic marks one or two words at most. |
| In our project | A `--surface` box with a 3px `--fg` border, a cobalt header strip that reads `In our project`, and file paths in mono. |
| Watch out | A hazards row: a `■ Risk` tomato tag or a `○ Check` butter tag. |
| Assembly | A plate whose stages are the blocks. Its key steps through them, so **Walk the path** walks the blocks in order. |
| Cheat sheet | A `<dl>` with mono terms, as in a specimen card. |
| Closing line | The footer. |

## Figures that teach

| The idea | Figure |
|---|---|
| Where the mass of a distribution sits | One or two curves, with the peak marked by a dashed drop line. |
| Picking from a space | A curve or scatter, with the picked dots marked and labelled. |
| A ceiling, or returns that shrink | A rising curve that flattens under a dashed limit line. |
| Ranking into bands | Horizontal rungs, a candidate dot, and arrows labelled with the verdict. |
| Similarity and clusters | A 2D scatter: near-duplicates ringed with a dashed tomato line, picks ringed in cobalt. |
| A loop or feedback cycle | Four boxes in a cycle, with numbered arrows. |

Colour every mark with tokens, as `references/field-guide.md` says, so both schemes work.

## Checks

```
□ every claim traces to a cited line in the notes
□ a newcomer can read the blocks in order; no block uses a term from a later one
□ each block runs head → question → explanation → figure → in our project → watch out (when needed)
□ every term of art is in the cheat sheet
□ sources link each block to its primary sources and to the notes in the repo
```

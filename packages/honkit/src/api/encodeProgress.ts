import Immutable from "immutable";
import encodeNavigation, { EncodedNavigation } from "./encodeNavigation";
import Output from "../models/output";
import Page from "../models/page";

export type EncodedChapters = Array<
    EncodedNavigation[string] & {
        path: string;
        done: boolean;
        percent: number;
    }
>;
export type PartialEncodedChapterValue = EncodedNavigation[string] &
    Partial<{
        path: string;
        done: boolean;
        percent: number;
    }>;
export type EncodeProgress = {
    // Previous percent
    prevPercent: number;
    // Current percent
    percent: number;
    // Current chapter
    current: number;
    // List of chapter with progress
    chapters: EncodedChapters;
};

/**
 page.progress is a deprecated property from GitBook v2
 */

function encodeProgress(output: Output, page: Page): EncodeProgress {
    const current = page.getPath();
    const navigation = Immutable.Map<string, PartialEncodedChapterValue>(encodeNavigation(output));

    const n = navigation.size;
    let percent = 0,
        prevPercent = 0,
        currentChapter = null;
    let done = true;

    const chapters = navigation
        .map((nav, chapterPath) => {
            nav.path = chapterPath;
            return nav;
        })
        .valueSeq()
        .sortBy((nav) => {
            return nav.index;
        })
        .map((nav, i) => {
            // Calcul percent
            nav.percent = (i * 100) / Math.max(n - 1, 1);

            // Is it done
            nav.done = done;
            if (nav.path == current) {
                currentChapter = nav;
                percent = nav.percent;
                done = false;
            } else if (done) {
                prevPercent = nav.percent;
            }

            return nav;
        })
        .toJS() as EncodedChapters;

    return {
        // Previous percent
        prevPercent: prevPercent,

        // Current percent
        percent: percent,

        // List of chapter with progress
        chapters: chapters,

        // Current chapter
        current: currentChapter
    };
}

export default encodeProgress;

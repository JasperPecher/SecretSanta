import React from "react";
import { ExternalLink } from "lucide-react";

export type TextSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string };

const URL_REGEX =
  /(https?:\/\/[^\s]+|www\.[^\s]+|(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+(?:com|de|org|net|co|io|at|ch|eu|app|dev|me|shop|store|online|uk|fr|it|es|nl|be|pl|dk|se|no|fi)(?:\/[^\s]*)?)/gi;

export function extractUrlAndTrailing(rawMatch: string): {
  url: string;
  trailing: string;
  href: string;
} {
  let url = rawMatch;
  let trailing = "";

  while (url.length > 0) {
    const lastChar = url[url.length - 1];
    if (/[.,!?;:\x27"]/.test(lastChar)) {
      trailing = lastChar + trailing;
      url = url.slice(0, -1);
      continue;
    }
    if (lastChar === ")") {
      const openParens = (url.match(/\(/g) || []).length;
      const closeParens = (url.match(/\)/g) || []).length;
      if (closeParens > openParens) {
        trailing = lastChar + trailing;
        url = url.slice(0, -1);
        continue;
      }
    }
    if (lastChar === "]") {
      const openBrackets = (url.match(/\[/g) || []).length;
      const closeBrackets = (url.match(/\]/g) || []).length;
      if (closeBrackets > openBrackets) {
        trailing = lastChar + trailing;
        url = url.slice(0, -1);
        continue;
      }
    }
    break;
  }

  let href = url;
  if (/^www\./i.test(href) || !/^https?:\/\//i.test(href)) {
    href = `https://${href}`;
  }

  return { url, trailing, href };
}

export function parseTextWithLinks(text: string): TextSegment[] {
  if (!text) return [];

  const segments: TextSegment[] = [];
  const regex = new RegExp(URL_REGEX.source, "gi");
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const rawMatch = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, matchIndex),
      });
    }

    const { url, trailing, href } = extractUrlAndTrailing(rawMatch);
    if (url) {
      segments.push({
        type: "link",
        value: url,
        href,
      });
    }
    if (trailing) {
      segments.push({
        type: "text",
        value: trailing,
      });
    }

    lastIndex = matchIndex + rawMatch.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return segments;
}

export function getFirstUrl(
  text: string,
): { url: string; href: string } | null {
  if (!text) return null;
  const segments = parseTextWithLinks(text);
  const firstLink = segments.find(
    (s): s is { type: "link"; value: string; href: string } =>
      s.type === "link",
  );
  return firstLink ? { url: firstLink.value, href: firstLink.href } : null;
}

export function LinkifiedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const segments = parseTextWithLinks(text);

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (segment.type === "text") {
          return <React.Fragment key={index}>{segment.value}</React.Fragment>;
        }

        return (
          <a
            key={index}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`${segment.href} (in neuem Tab öffnen)`}
            className="inline text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-sky-400/50 hover:decoration-sky-300 transition-colors break-all"
          >
            <span>{segment.value}</span>
            <ExternalLink
              className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5 align-middle shrink-0 opacity-80"
              aria-hidden="true"
            />
            <span className="sr-only"> (öffnet in neuem Tab)</span>
          </a>
        );
      })}
    </span>
  );
}

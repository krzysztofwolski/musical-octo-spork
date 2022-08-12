/** @jsx h */
import { h } from "preact";
import { tw } from "../utils/twind.ts";

interface ParagraphData {
  text: string;
}

interface HeaderData {
  text: string;
  level: number;
}

interface ListData {
  items: string[];
  style: "unordered" | "ordered";
}

interface esjBlock {
  id: string;
  type: string;
  data: ParagraphData | HeaderData | ListData | Record<never, never>;
}

interface ejsData {
  version: string;
  time: number;
  blocks: esjBlock[];
}

export const renderParagraph = (data: ParagraphData) => {
  return (
    <p
      class={tw`text-base text-gray-800`}
      dangerouslySetInnerHTML={{
        __html: data.text,
      }}
    />
  );
};

export const renderHeader = (data: HeaderData) => {
  switch (data.level) {
    case 1:
      return (
        <h1
          class={tw`text-5xl text-gray-800 my-2`}
          dangerouslySetInnerHTML={{
            __html: data.text,
          }}
        />
      );
    case 2:
      return (
        <h2
          class={tw`text-2xl text-gray-800 my-2`}
          dangerouslySetInnerHTML={{
            __html: data.text,
          }}
        />
      );
    case 3:
      return (
        <h3
          class={tw`text-xl text-gray-800 my-2`}
          dangerouslySetInnerHTML={{
            __html: data.text,
          }}
        />
      );
    default:
      return (
        <h4
          class={tw`text-lg text-gray-800 my-2`}
          dangerouslySetInnerHTML={{
            __html: data.text,
          }}
        />
      );
  }
};

const renderList = (data: ListData) => {
  if (data.style === "ordered") {
    return (
      <ol class={tw`list-decimal`}>
        {data.items.map((item) => (
          <li
            dangerouslySetInnerHTML={{
              __html: item,
            }}
          />
        ))}
      </ol>
    );
  }
  return (
    <ul>
      {data.items.map((item) => (
        <li
          class={tw`list-disc ml-8`}
          dangerouslySetInnerHTML={{
            __html: item,
          }}
        />
      ))}
    </ul>
  );
};

const renderDelimiter = () => {
  return <hr class={tw`my-2`} />;
};

const renderBlock = (block: esjBlock) => {
  switch (block.type) {
    case ("header"):
      return renderHeader(block.data as HeaderData);
    case ("paragraph"):
      return renderParagraph(block.data as ParagraphData);
    case ("list"):
      return renderList(block.data as ListData);
    case ("delimiter"):
      return renderDelimiter();
    default:
      return <p>Unsupported block type: {block.type}</p>;
  }
};

export type EditorJSRendererProps = {
  stringData: string;
};

export function EditorJSRenderer({ stringData }: EditorJSRendererProps) {
  const data = JSON.parse(stringData) as ejsData;
  const { blocks } = data;

  return (
    <div>
      {blocks.map((b) => renderBlock(b))}
    </div>
  );
}

export default EditorJSRenderer;

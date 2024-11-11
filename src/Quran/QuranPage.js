import React, { useState, useEffect } from "react";
import { usePageContext } from "./PageContext";
import { Popover, Spin } from "antd";
import "./Tasmi3i.css";
import PageList from "./PageList";
import Mistakes from "./Mistakes";
import DynamicGlobalStyle from "./DynamicGlobalStyle";

const getFontNameForPage = (pageNumber) => {
  const paddedPageNumber = pageNumber < 10 ? `00${pageNumber}` 
                        : pageNumber < 100 ? `0${pageNumber}` 
                        : `${pageNumber}`;
  return `QCF_P${paddedPageNumber}`;
};



const findMistakesInText = (textData, mistakes) => {
  return textData.map((page) => {
    return page.map((word) => {
      const wordMistakes = mistakes.filter((m) => m.ID_Word === word.id);
      if (wordMistakes.length > 0) {
        return { ...word, mistakes: wordMistakes };
      }
      return word;
    });
  });
};

const highlightMistake = (word, mistakes) => {
  let letters = removeHarakat(word).split("");

  mistakes.forEach((mistake) => {
    if (mistake.Mistake_Type === "1" || mistake.Mistake_Type === "3") {
      const pos = mistake.Letter_Position;
      if (pos !== null && pos >= 0 && pos < letters.length) {
        letters[pos] = (
          <span key={pos} style={{ color: "red" }}>
            {letters[pos]}
          </span>
        );
      }
    }
  });

  return (
    <span>
      {letters.map((letter, index) => (
        <React.Fragment key={index}>{letter}</React.Fragment>
      ))}
    </span>
  );
};

let removeHarakat = (text) => {
  return text
    .replaceAll("ّ", "")
    .replaceAll("َ", "")
    .replaceAll("ٌ", "")
    .replaceAll("ِ", "")
    .replaceAll("ُ", "")
    .replaceAll("ْ", "")
    .replaceAll("ّ", "")
    .replaceAll("ٍ", "")
    .replaceAll("ً", "")
    .replaceAll("ٌ", "");
};

const QuranPage = () => {
  const { currentPage } = usePageContext();
  const [pageData, setPageData] = useState(null);
  const [pageMistakes, setPageMistakes] = useState([]);
  const [mistakeWords, setMistakeWords] = useState([]);
  const [isMistakesLoading, setMistakesLoading] = useState();

  useEffect(() => {
    const loadPageData = async () => {
      const data = await import(`./Pages/page_${currentPage}.json`);
      setPageData(data);
    };
    loadPageData();
  }, [currentPage]);

  useEffect(() => {
    if (pageData && pageMistakes.length > 0) {
      const wordsWithMistakes = findMistakesInText(
        pageData.lines.map((line) => line.words),
        pageMistakes
      );
      setMistakeWords(wordsWithMistakes);
    }
  }, [pageData, pageMistakes]);

  const getMistakeColor = (mistakes) => {
    const mistakesColors = {
      1: "lightblue",
      2: "lightgreen",
      3: "lightcoral",
      12: "linear-gradient(to left, lightblue, lightgreen)",
      13: "linear-gradient(to left, lightblue, lightcoral)",
      23: "linear-gradient(to left, lightgreen, lightcoral)",
      123: "linear-gradient(to left, lightblue, lightgreen ,lightcoral)",
    };

    const colorsSet = new Set();
    mistakes.map((mistake, index) => {
      colorsSet.add(parseInt(mistake?.Mistake_Type, 10));
    });
    const sortedColors = [...colorsSet].sort();
    let color = "";
    sortedColors.map((char, index) => {
      color += String(char);
    });
    return mistakesColors[color];
  };

  const renderPopoverContent = (word) => (
    <div className="popover-table-container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>الموضع</th>
            <th>نوع الخطأ</th>
          </tr>
        </thead>
        <tbody>
          {word.mistakes.map((mistake, index) => (
            <tr key={index}>
              <td>
                {mistake.Mistake_Type === "2" ? (
                  <div
                    style={{ border: "1px solid #ccc", verticalAlign: "none" }}
                  />
                ) : (
                  highlightMistake(word.text, [mistake])
                )}
              </td>
              <td>{getMistakeType(mistake.Mistake_Type)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const getMistakeType = (type) => {
    switch (type) {
      case "1":
        return "خطأ تشكيلي";
      case "2":
        return "خطأ حفظي";
      case "3":
        return "خطأ تجويدي";
      default:
        return "نوع غير معروف";
    }
  };

  const font = getFontNameForPage(currentPage);

  return (
    <div className="app-container">
      {<DynamicGlobalStyle fontFamily={font} />}
      <div className="page-list">
        <PageList />
      </div>
      <div  className="quran-page" dir="rtl">
        {isMistakesLoading ? (
          <div className="spin-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <h2>{pageData ? pageData.header : ""}</h2>
            {pageData ? (
              <>
                <p>جزء: {pageData.juz}</p>
                {pageData.lines.map((line, index) => (
                  <div key={index} className="line">
                    {line.data && line.data.type === "start" && (
                      <h3 className="sura-name">{line.data.suraName}</h3>
                    )}
                    {mistakeWords[index] &&
                      mistakeWords[index].map((word, wordIndex) => {
                        const hasMistakes =
                          word.mistakes && word.mistakes.length > 0;
                        const backgroundColor = hasMistakes
                          ? getMistakeColor(word.mistakes)
                          : "transparent";

                        return hasMistakes ? (
                          <Popover
                            content={
                              <div
                                style={{
                                  maxHeight: "100px",
                                  overflowY: "auto",
                                  width: "200px",
                                }}
                              >
                                {renderPopoverContent(word)}
                              </div>
                            }
                            title="تفاصيل الخطأ"
                            trigger="click"
                            key={word.id}
                          >
                            <li
                              style={{
                                display: "inline-block",
                                cursor: "pointer",
                                background: backgroundColor,

                                borderRadius: "4px",
                              }}
                            >
                              {word.text}&nbsp;
                            </li>
                          </Popover>
                        ) : (
                          <li
                            style={{
                              display: "inline-block",
                              cursor: "default",
                            }}
                            key={word.id}
                          >
                            {word.text}&nbsp;
                          </li>
                        );
                      })}
                    <br />
                  </div>
                ))}
              </>
            ) : (
              <div></div>
            )}
          </>
        )}
      </div>
      <Mistakes
        currentPage={currentPage}
        onMistakesFetched={setPageMistakes}
        setMistakesLoading={setMistakesLoading}
      />
    </div>
  );
};

export default QuranPage;

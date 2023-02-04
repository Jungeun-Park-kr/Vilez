import React from "react";
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import DivideLine from "../../components/common/DivideLine";
import InputBox from "../common/InputBox";
import ProductCategory from "./ProductCategory";
import { useState, useEffect } from "react";
import NoProductList from "./NoProductList";
import { getShareArticleList } from "../../api/share";

import { HiCalendar } from "react-icons/hi";
import { HiHeart } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { getAskArticleList } from "../../api/ask";

const ProductList = () => {
  const [isAll, setIsAll] = useState(true);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [getArticle, setArticles] = useState([]);
  const [originalArticle, setOriginalArticle] = useState([]);

  // 무한 스크롤 관련 변수
  const [cnt, setCnt] = useState(0);

  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const urlId = pathname.includes("share") ? 2 : 1;
  const [list, setList] = useState("");
  const categoryToUse = category === "전체" ? "" : category;

  // 무한 스크롤 관련
  useEffect(() => {
    const handleScroll = () => {
      // get the scroll position and the height of the page
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight || window.innerHeight;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;

      // check if the scroll position is at the bottom of the page and there are more articles to load
      if (scrollTop + clientHeight >= scrollHeight && getArticle.length) {
        setCnt(cnt + 1);
      }
    };

    // add the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // remove the scroll event listener when unmounting the component
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [cnt, getArticle]);

  // 카테고리 변경 후 스크롤을 내렸다가 ,다른 카테고리를 선택했을 때 이전 카테고리 데이터가 쌓여 나옴
  useEffect(() => {
    // Update the isMounted variable to true to make sure the component is still mounted

    urlId === 1
      ? // 요청
        getAskArticleList("", "", categoryToUse, cnt, 15, 0, 1, "").then((res) => {
          const data = res;
          setOriginalArticle(data[0]);
          setArticles(data[0]);
          setList("물품 요청 목록");
        })
      : // 공유
        getShareArticleList("", "", categoryToUse, cnt, 15, 0, 1, "").then((res) => {
          const data = res;
          setOriginalArticle(data);
          setArticles(data);
          setList("물품 공유 목록");
        });
  }, [categoryToUse]);
  useEffect(() => {
    // Check if the component is still mounted before making the API call

    urlId === 1
      ? // 요청
        getAskArticleList("", "", categoryToUse, cnt, 15, 0, 1, "").then((res) => {
          const data = res;
          setOriginalArticle([...originalArticle, ...data[0]]);
          setArticles([...originalArticle, ...data[0]]);
          setList("물품 요청 목록");
        })
      : // 공유
        getShareArticleList("", "", categoryToUse, cnt, 15, 0, 1, "").then((res) => {
          const data = res;
          setOriginalArticle([...originalArticle, ...data]);
          setArticles([...originalArticle, ...data]);
          setList("물품 공유 목록");
        });
  }, [search, pathname, isAll, cnt]);

  // 공유가능 목록 보기위해 작성한 useEffect 0일때 공유가능, 1일때 공유 중
  useEffect(() => {
    if (isAll) {
      setArticles(originalArticle);
      // console.log(getArticle);
    } else {
      if (urlId === 2) {
        const tempShareArticle = getArticle.filter(
          (article) => article.shareListDto && article.shareListDto.state === 0
        );
        setArticles(tempShareArticle);
      } else {
        const tempShareArticle = getArticle.filter((article) => article.askDto && article.askDto.state === 0);
        setArticles(tempShareArticle);
      }
    }
  }, [pathname, isAll, categoryToUse, cnt]);

  // props에서 받아온 값이 newCategory에 들어감
  // setCategory에 넘어온 값을 입력
  function receiveCategory(newCategory) {
    setCategory(newCategory);
    setCnt(0);
    setOriginalArticle([]);
  }
  function onClickSeePossible() {
    setIsAll(!isAll);
  }
  // 목록 검색창
  function onSubmitSearch(event) {
    event.preventDefault();
    onChangeSearch(search);
  }
  function onChangeSearch(event) {
    console.log(event);
    urlId === 2
      ? getShareArticleList("", "", categoryToUse, cnt, 15, 0, 1, search).then((res) => {
          const data = res;
          setOriginalArticle(data);
          setArticles(data);
          setList("물품 공유 목록");
        })
      : getAskArticleList("", "", categoryToUse, cnt, 15, 0, 1, search).then((res) => {
          const data = res;
          setOriginalArticle(data);
          setArticles(data);
          setList("물품 공유 목록");
        });
    setSearch(event);
  }
  function onClicktoRegist() {
    navigate("/product/regist");
  }
  return (
    <div css={topWrap}>
      <div css={contentWrap}>
        <h2>{list}</h2>
        <div css={filterWrap}>
          <div css={filterLeftWrap}>
            <ProductCategory isMain={false} sendCategory={receiveCategory} list={true} />
          </div>
          <div css={filterRighWrap}>
            <form css={searchWrap} onSubmit={onSubmitSearch}>
              <InputBox
                useMainList={true}
                onChangeValue={onChangeSearch}
                value={search}
                placeholder="필요한 물품을 검색해보세요."
              />
              <img src="https://s3.ap-northeast-2.amazonaws.com/cdn.wecode.co.kr/icon/search.png" />
              <button type="submit">검색</button>
            </form>

            <div onClick={onClickSeePossible} css={isAll ? unPossibleWrap : possibleWrap}>
              공유가능한 물품만 보기
            </div>
          </div>
        </div>
        <DivideLine />

        <div css={buttonDiv}>
          <button css={buttonWrap} onClick={onClicktoRegist}>
            물품 등록
          </button>
        </div>

        {urlId === 2 ? (
          <div css={relatedProductWrapper}>
            {getArticle.map((article, idx) => (
              <div key={idx} onClick={() => navigate(`/product/detail/share/${article.shareListDto.id}`)}>
                <div css={thumbnailWrapper}>
                  <img src={article.shareListDto?.list[0]?.path} />
                </div>
                <div css={infoWrapper}>
                  <div>
                    <span>{article.shareListDto?.title}</span>
                    <small>1시간 전</small>
                  </div>
                  <div>
                    <small>
                      <HiCalendar />
                      {article?.shareListDto?.startDay} ~ {article?.shareListDto?.endDay}
                    </small>
                    <small>
                      <HiHeart />
                      {article?.listCnt}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div css={relatedProductWrapper}>
            {getArticle.map((article, idx) => (
              <div key={idx} onClick={() => navigate(`/product/detail/ask/${article.askDto.id}`)}>
                <div css={thumbnailWrapper}>
                  <img src={article?.askDto?.list[0]?.path} />
                </div>
                <div css={infoWrapper}>
                  <div>
                    <span>{article?.askDto?.title}</span>
                    <small>1시간 전</small>
                  </div>
                  <div>
                    <small>
                      <HiCalendar />
                      {article?.askDto?.startDay} ~ {article?.askDto?.endDay}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div css={NoProductWrap}>
        <NoProductList />
      </div>
    </div>
  );
};

const topWrap = css`
  padding-left: 200px;
  padding-right: 200px;
  margin-top: 70px;
  height: 100%;
`;
const contentWrap = css``;

const filterWrap = css`
  display: flex;
  justify-content: space-between;
  /* padding-bottom: 30px; */
  margin-top: 35px;
  position: relative;
`;

const filterLeftWrap = css`
  font-size: 25px;
  display: flex;
`;

const filterRighWrap = css`
  display: flex;
  width: 60%;
  justify-content: right;
  align-items: center;
`;

const searchWrap = css`
  width: 50%;
  padding: 1px;
  position: relative;
  & > img {
    position: absolute;
    width: 14px;
    top: 12px;
    left: 6px;
  }
  & > button {
    position: absolute;
    width: 30px;
    top: 9px;
    right: 10px;
    border: none;
    background-color: white;
    color: #66dd9c;
    cursor: pointer;
  }
`;

const possibleWrap = css`
  margin-left: 15px;
  cursor: pointer;
`;

const unPossibleWrap = css`
  margin-left: 15px;
  color: #66dd9c;
  cursor: pointer;
  font-weight: bold;
  box-sizing: border-box;
  background-color: white;
`;

const buttonDiv = css`
  width: 100%;
  /* display: inline-block; */
  display: flex;
  justify-content: flex-end;
`;

const buttonWrap = css`
  width: 10%;
  position: relative;
  margin-top: 25px;
  margin-bottom: 40px;
  cursor: pointer;
  display: block;
  height: 35px;
  border: none;
  border-radius: 5px;
  font-size: 12px;
  background-color: #66dd9c;
  color: white;
`;

const relatedProductWrapper = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 50px;
  width: 100%;
  height: 100%;
  margin-right: 50px;
  border-radius: 10px;

  cursor: pointer;

  & > div {
    margin-bottom: 70px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const thumbnailWrapper = css`
  height: 170px;
  background: #d9d9d9;
  border-radius: 10px 10px 0 0;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px 10px 0 0;
  }
`;

const infoWrapper = css`
  max-height: 80px;
  padding: 10px;
  background: #ffffff;
  border-radius: 0 0 10px 10px;

  & small {
    color: #8a8a8a;
  }

  & > div:nth-of-type(1) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 5px;
  }

  & > div:nth-of-type(2) {
    display: flex;
    flex-direction: row;

    & > small {
      margin-right: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;

      & > svg {
        margin-right: 3px;
      }
    }
  }
`;

const NoProductWrap = css`
  height: 250px;
`;

export default ProductList;

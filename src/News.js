import React, { useEffect, useState } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const updateNews = async ()=> {
  
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=38142b42773944059cad0408bf22a5b9&page=${page}&pageSize=${props.pageSize}`; 
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json()
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);

}

  useEffect(() => {
    updateNews();
  }, [])


  // const handlePrevClick = async () => {
  //   setPage(page - 1)
  //   updateNews();
  // }
  // const handleNextClick = async () => {
  //   setPage(page + 1)
  //   updateNews()
  // }
  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=38142b42773944059cad0408bf22a5b9&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1)
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };


  return (
    <>
      <h1 className='text-center' style={{margin:'60px 0px'}}>NewsMonkey-Top headlines</h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >

        <div className="container">

          <div className='row'>
            {articles.map((element) => {
              return <div className='col-md-4' key={element.url}>
                <Newsitem title={element.title} description={element.description} imageUrl={element.urlToImage} news={element.url} />
              </div>
            })}



          </div>
        </div>
      </InfiniteScroll>

    </>
  )
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}
export default News
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";

import axios from "axios";
import Slider from "react-slick";

import puppeteer from "puppeteer";

interface dataType {
  data: any[];
  imgArray: string[];
}

export default function Home({ data, imgArray }: dataType) {
  console.log(imgArray);
  useEffect(() => {
    const home = document.querySelector("#home");
    var style: any;
    if (document.querySelector("#home .banner-bg-images") == null) {
      style = document.createElement("style");
    } else {
      style = document.querySelector("#home .banner-bg-images");
    }
    style?.setAttribute("class", "banner-bg-images");
    var styleHTML: string = ``;

    data.forEach((_, index) => {
      styleHTML += `
      #home .react-slick-container .slide.index-${index + 1}{
        background-image: url("${imgArray[index]}");
      }
      `;
    });
    style.innerHTML = styleHTML;
    home?.appendChild(style);
  }, []);
  return (
    <section id="home">
      <Slider
        autoplay={true}
        autoplaySpeed={2000}
        pauseOnHover={true}
        dots={false}
        className="react-slick-container"
      >
        {data.map((anime, index) => {
          return (
            <div className={`slide index-${index + 1}`} key={index}>
              <h2>{anime?.title_english || ""}</h2>
              <span className="year">{anime?.year || "0000"}</span>
              <span className="jap">{anime?.title || ""}</span>
              <p>
                {(anime?.synopsis || "lorem ipsum").substring(0, 350) + "..."}
              </p>
              <a
                href={`https://animixplay.to/?q=${anime?.title.replaceAll(
                  " ",
                  "%20"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                ► Watch Now
              </a>
              <Link href="/" className="more">
                More
              </Link>
            </div>
          );
        })}
      </Slider>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const fromJiken = await axios.get(
    "https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity&limit=5"
  );
  var imgSrcArr: string[] = [];

  const browser = await puppeteer.launch({ headless: false });

  for (let index: number = 0; index < fromJiken.data?.data.length; index++) {
    let anime: any = fromJiken.data?.data[index];
    const page = await browser.newPage();
    await page.goto(
      "https://www.wallpaperflare.com/search?wallpaper=" +
        anime.title_english.replaceAll(" ", "+")
    );
    try {
      await page.waitForSelector("main img.lazy.loaded");
      var img: any = await page.evaluate(() => {
        var elem = document.querySelector("main img.lazy");
        if (elem != null) {
          if (elem.getAttribute("src") != null) {
            return elem.getAttribute("src");
          } else {
            return anime?.images?.jpg?.large_image_url;
          }
        } else {
          return anime?.images?.jpg?.large_image_url;
        }
      });
      imgSrcArr.push(img);
    } catch {
      imgSrcArr.push(anime?.images?.jpg?.large_image_url);
    }
  }

  await browser.close();

  const data: dataType = {
    data: fromJiken.data?.data || [],
    imgArray: imgSrcArr,
  };
  return {
    props: data,
  };
};

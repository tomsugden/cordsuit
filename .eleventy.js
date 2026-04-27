module.exports = function (eleventyConfig) {
  eleventyConfig.setTemplateFormats(["md", "njk", "html", "11ty.js"]);

  eleventyConfig.addPassthroughCopy("styles.css");
  for (const dir of [
    "articles",
    "bibliography",
    "discography",
    "drawings",
    "gigs",
    "news",
    "poems",
    "reviews",
    "songs",
    "tablature",
    "writing",
  ]) {
    eleventyConfig.addPassthroughCopy(`${dir}/*.jpg`);
    eleventyConfig.addPassthroughCopy(`${dir}/*.jpeg`);
    eleventyConfig.addPassthroughCopy(`${dir}/*.png`);
    eleventyConfig.addPassthroughCopy(`${dir}/*.gif`);
  }

  const sections = [
    "articles",
    "bibliography",
    "discography",
    "drawings",
    "gigs",
    "news",
    "poems",
    "reviews",
    "songs",
    "tablature",
    "writing",
  ];

  for (const name of sections) {
    eleventyConfig.addCollection(name, (api) =>
      api
        .getFilteredByGlob(`./${name}/*.md`)
        .filter((p) => !/\/index\.md$/.test(p.inputPath))
        .sort((a, b) => (a.data.title || "").localeCompare(b.data.title || ""))
    );
  }

  eleventyConfig.addCollection("gigsByDate", (api) =>
    api
      .getFilteredByGlob("./gigs/*.md")
      .filter((p) => !/\/index\.md$/.test(p.inputPath))
      .sort((a, b) => (a.fileSlug || "").localeCompare(b.fileSlug || ""))
  );

  return {
    dir: {
      input: ".",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_eleventy_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};

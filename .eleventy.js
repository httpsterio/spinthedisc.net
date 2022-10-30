const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const { DateTime } = require("luxon")

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight)
  
  // To enable merging of tags
  eleventyConfig.setDataDeepMerge(true)

  // Copy these static files to _site folder
  eleventyConfig.addPassthroughCopy('src/assets')
  eleventyConfig.addPassthroughCopy('src/manifest.json')


  // filter to format post date to year-month-day
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-MM-dd');
  })

  // Enable us to iterate over all the tags, excluding posts and all
  eleventyConfig.addCollection('tagList', collection => {
    const tagsSet = new Set()
    collection.getAll().forEach(item => {
      if (!item.data.tags) return
      item.data.tags
        .filter(tag => !['posts', 'all'].includes(tag))
        .forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  })

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",
    
    pathPrefix: "/",
    dir: {
      input: "src",
      data: "_data",
      output: "_site"
    }
  };
}
import { writeFile } from "node:fs/promises";
import * as cheerio from "cheerio";

const url = "https://wiki.leagueoflegends.com/en-us/List_of_champions"; // Replace with the actual URL

const response = await fetch(url);
if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
}   

const html = await response.text();     
const $ = cheerio.load(html);
const cleanText = (value) => value.replace(/\s+/g, " ").trim();

const champion = $("tbody tr")
    .map((_, element) => {
        const name = $(element).find("[data-champion]").attr("data-champion");
        
        // If the row doesn't have a champion attribute, skip it
        if (!name) return null;

        return {
            name: name,
            class: cleanText($(element).find("td:nth-child(2)").text()),
            releaseDate: cleanText($(element).find("td:nth-child(3)").text()),
            version: cleanText($(element).find("td:nth-child(4)").text())
        };
    })
    .get()
    .filter(Boolean); // Removes the null entries from the array

console.table(champion);

const jsonOutput = JSON.stringify(champion, null, 2);

await writeFile("data/search_index.json", jsonOutput, "utf8");
console.log("Successfully saved records to data/search_index.json");
